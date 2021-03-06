// Generated by CoffeeScript 1.6.3
(function() {
  var extendr, pathUtil, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  extendr = require('extendr');

  pathUtil = require('path');

  _ = require('underscore');

  module.exports = function(BasePlugin) {
    var HandlebarshelpersPlugin, _ref;
    return HandlebarshelpersPlugin = (function(_super) {
      var helperAdapter, partialAdapter;

      __extends(HandlebarshelpersPlugin, _super);

      function HandlebarshelpersPlugin() {
        _ref = HandlebarshelpersPlugin.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      HandlebarshelpersPlugin.prototype.name = 'handlebarshelpers';

      HandlebarshelpersPlugin.prototype.config = {
        debug: false,
        useTemplateDataFunctions: false,
        usePartials: false,
        extensions: []
      };

      HandlebarshelpersPlugin.prototype.trace = function(msg) {
        var logLevel;
        logLevel = this.getConfig().debug ? 'info' : 'debug';
        return this.docpad.log(logLevel, "[" + this.name + "] " + msg);
      };

      HandlebarshelpersPlugin.prototype.getHandlebarsPlugin = function() {
        if (this.handlebarsPlugin == null) {
          this.handlebarsPlugin = this.docpad.getPlugin('handlebars');
        }
        return this.handlebarsPlugin;
      };

      HandlebarshelpersPlugin.prototype.getHandlebars = function() {
        if (this.handlebars == null) {
          this.handlebars = this.getHandlebarsPlugin().handlebars;
        }
        return this.handlebars;
      };

      HandlebarshelpersPlugin.prototype.getPartialPlugin = function() {
        if (this.partialPlugin == null) {
          this.partialPlugin = this.docpad.getPlugin('partials');
        }
        return this.partialPlugin;
      };

      helperAdapter = function(fn) {
        return function(context, options) {
          if (options == null) {
            options = context;
            context = this;
          }
          return fn(context);
        };
      };

      partialAdapter = function(templateData, name) {
        return function(context, options) {
          if (options == null) {
            options = context;
            context = this;
          }
          return templateData.partial(name, context);
        };
      };

      HandlebarshelpersPlugin.prototype.registerHelperFn = function(name, helperFn) {
        this.trace("Register simple function as helper " + name);
        return this.registerHelper(name, helperAdapter(helperFn));
      };

      HandlebarshelpersPlugin.prototype.registerHelper = function(name, helper) {
        this.trace("Register helper " + name);
        return this.getHandlebars().registerHelper(name, helper);
      };

      HandlebarshelpersPlugin.prototype.registerPartial = function(name, partial) {
        this.trace("Register partial " + name);
        return this.getHandlebars().registerPartial(name, partial);
      };

      HandlebarshelpersPlugin.prototype.registerDocpadPartial = function(templateData, name) {
        return this.registerPartial(name, partialAdapter(templateData, name));
      };

      HandlebarshelpersPlugin.prototype.docpadReady = function(opts, next) {
        var collectionName, docpad, error, extensionPath, extensionRelativePath, extensions, helper, helpers, name, partial, partials, partialsPath, rootPath, templateData, usePartials, useTemplateDataFunctions, _i, _len, _ref1, _ref2, _ref3;
        docpad = this.docpad;
        _ref1 = this.getConfig(), useTemplateDataFunctions = _ref1.useTemplateDataFunctions, usePartials = _ref1.usePartials, extensions = _ref1.extensions;
        rootPath = docpad.getConfig().rootPath;
        templateData = docpad.getTemplateData();
        if (this.getHandlebarsPlugin() == null) {
          docpad.log('warn', 'handlebars plugin not installed');
          return;
        }
        if (!_.isArray(extensions)) {
          extensions = [extensions];
        }
        for (_i = 0, _len = extensions.length; _i < _len; _i++) {
          extensionRelativePath = extensions[_i];
          extensionPath = pathUtil.join(rootPath, extensionRelativePath);
          this.trace("Load handlebars extension module " + extensionRelativePath);
          try {
            _ref2 = require(extensionPath), helpers = _ref2.helpers, partials = _ref2.partials;
            for (name in helpers) {
              if (!__hasProp.call(helpers, name)) continue;
              helper = helpers[name];
              this.registerHelper(name, helper);
            }
            for (name in partials) {
              if (!__hasProp.call(partials, name)) continue;
              partial = partials[name];
              this.registerPartial(name, partial);
            }
          } catch (_error) {
            error = _error;
            docpad.log('error', "Error while loading extension " + extensionRelativePath + " :" + error);
            return next(error);
          }
        }
        if (useTemplateDataFunctions) {
          this.trace("load templateData functions has handlebars helpers");
          for (name in templateData) {
            if (!__hasProp.call(templateData, name)) continue;
            helper = templateData[name];
            if (_.isFunction(helper)) {
              this.registerHelperFn(name + "Helper", helper);
            }
          }
        }
        if (usePartials && this.getPartialPlugin()) {
          this.trace("Load partials");
          _ref3 = this.getPartialPlugin().getConfig(), partialsPath = _ref3.partialsPath, collectionName = _ref3.collectionName;
          docpad.getCollection(collectionName).forEach(function(partialDocument) {
            return this.registerDocpadPartial(templateData, partialDocument.name);
          });
        }
        return next();
        return next();
      };

      return HandlebarshelpersPlugin;

    })(BasePlugin);
  };

}).call(this);
