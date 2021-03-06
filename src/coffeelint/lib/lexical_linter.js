// Generated by CoffeeScript 1.7.1
(function() {
  var BaseLinter, LexicalLinter, TokenApi,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  TokenApi = (function() {
    function TokenApi(CoffeeScript, source, config, tokensByLine) {
      this.config = config;
      this.tokensByLine = tokensByLine;
      this.tokens = CoffeeScript.tokens(source);
      this.lines = source.split('\n');
      this.tokensByLine = {};
    }

    TokenApi.prototype.i = 0;

    TokenApi.prototype.peek = function(n) {
      if (n == null) {
        n = 1;
      }
      return this.tokens[this.i + n] || null;
    };

    return TokenApi;

  })();

  BaseLinter = require('./base_linter.js');

  module.exports = LexicalLinter = (function(_super) {
    __extends(LexicalLinter, _super);

    function LexicalLinter(source, config, rules, CoffeeScript) {
      LexicalLinter.__super__.constructor.call(this, source, config, rules);
      this.tokenApi = new TokenApi(CoffeeScript, source, this.config, this.tokensByLine);
      this.tokensByLine = this.tokenApi.tokensByLine;
    }

    LexicalLinter.prototype.acceptRule = function(rule) {
      return typeof rule.lintToken === 'function';
    };

    LexicalLinter.prototype.lint = function() {
      var error, errors, i, token, _i, _j, _len, _len1, _ref, _ref1;
      errors = [];
      _ref = this.tokenApi.tokens;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        token = _ref[i];
        this.tokenApi.i = i;
        _ref1 = this.lintToken(token);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          error = _ref1[_j];
          errors.push(error);
        }
      }
      return errors;
    };

    LexicalLinter.prototype.lintToken = function(token) {
      var errors, lineNumber, rule, type, v, value, _base, _i, _len, _ref, _ref1;
      type = token[0], value = token[1], lineNumber = token[2];
      if (typeof lineNumber === "object") {
        if (type === 'OUTDENT' || type === 'INDENT') {
          lineNumber = lineNumber.last_line;
        } else {
          lineNumber = lineNumber.first_line;
        }
      }
      if ((_base = this.tokensByLine)[lineNumber] == null) {
        _base[lineNumber] = [];
      }
      this.tokensByLine[lineNumber].push(token);
      this.lineNumber = lineNumber || this.lineNumber || 0;
      this.tokenApi.lineNumber = this.lineNumber;
      errors = [];
      _ref = this.rules;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule = _ref[_i];
        if (!(_ref1 = token[0], __indexOf.call(rule.tokens, _ref1) >= 0)) {
          continue;
        }
        v = this.normalizeResult(rule, rule.lintToken(token, this.tokenApi));
        if (v != null) {
          errors.push(v);
        }
      }
      return errors;
    };

    LexicalLinter.prototype.createError = function(ruleName, attrs) {
      if (attrs == null) {
        attrs = {};
      }
      attrs.lineNumber = this.lineNumber + 1;
      attrs.line = this.tokenApi.lines[this.lineNumber];
      return LexicalLinter.__super__.createError.call(this, ruleName, attrs);
    };

    return LexicalLinter;

  })(BaseLinter);

}).call(this);
