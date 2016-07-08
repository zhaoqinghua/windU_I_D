//     Backbone.js 1.1.2

//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

( function(root, factory) {

        // Set up Backbone appropriately for the environment. Start with AMD.
        if ( typeof define === 'function' && define.amd) {
            define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
                // Export global even in AMD case in case this script is loaded with
                // others that may still expect a global Backbone.
                root.Backbone = factory(root, exports, _, $);
            });

            // Next for Node.js or CommonJS. jQuery may not be needed as a module.
        } else if ( typeof exports !== 'undefined') {
            var _ = require('underscore');
            factory(root, exports, _);

            // Finally, as a browser global.
        } else {
            root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
        }

    }(this, function(root, Backbone, _, $) {

        // Initial Setup
        // -------------

        // Save the previous value of the `Backbone` variable, so that it can be
        // restored later on, if `noConflict` is used.
        var previousBackbone = root.Backbone;

        // Create local references to array methods we'll want to use later.
        var array = [];
        var slice = array.slice;

        // Current version of the library. Keep in sync with `package.json`.
        Backbone.VERSION = '1.1.2';

        // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
        // the `$` variable.
        Backbone.$ = $;

        // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
        // to its previous owner. Returns a reference to this Backbone object.
        Backbone.noConflict = function() {
            root.Backbone = previousBackbone;
            return this;
        };

        // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
        // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
        // set a `X-Http-Method-Override` header.
        Backbone.emulateHTTP = false;

        // Turn on `emulateJSON` to support legacy servers that can't deal with direct
        // `application/json` requests ... will encode the body as
        // `application/x-www-form-urlencoded` instead and will send the model in a
        // form param named `model`.
        Backbone.emulateJSON = false;

        // Backbone.Events
        // ---------------

        // A module that can be mixed in to *any object* in order to provide it with
        // custom events. You may bind with `on` or remove with `off` callback
        // functions to an event; `trigger`-ing an event fires all callbacks in
        // succession.
        //
        //     var object = {};
        //     _.extend(object, Backbone.Events);
        //     object.on('expand', function(){ alert('expanded'); });
        //     object.trigger('expand');
        //
        var Events = Backbone.Events = {

            // Bind an event to a `callback` function. Passing `"all"` will bind
            // the callback to all events fired.
            on : function(name, callback, context) {
                if (!eventsApi(this, 'on', name, [callback, context]) || !callback)
                    return this;
                this._events || (this._events = {});
                var events = this._events[name] || (this._events[name] = []);
                events.push({
                    callback : callback,
                    context : context,
                    ctx : context || this
                });
                return this;
            },

            // Bind an event to only be triggered a single time. After the first time
            // the callback is invoked, it will be removed.
            once : function(name, callback, context) {
                if (!eventsApi(this, 'once', name, [callback, context]) || !callback)
                    return this;
                var self = this;
                var once = _.once(function() {
                    self.off(name, once);
                    callback.apply(this, arguments);
                });
                once._callback = callback;
                return this.on(name, once, context);
            },

            // Remove one or many callbacks. If `context` is null, removes all
            // callbacks with that function. If `callback` is null, removes all
            // callbacks for the event. If `name` is null, removes all bound
            // callbacks for all events.
            off : function(name, callback, context) {
                if (!this._events || !eventsApi(this, 'off', name, [callback, context]))
                    return this;

                // Remove all callbacks for all events.
                if (!name && !callback && !context) {
                    this._events =
                    void 0;
                    return this;
                }

                var names = name ? [name] : _.keys(this._events);
                for (var i = 0,
                    length = names.length; i < length; i++) {
                    name = names[i];

                    // Bail out if there are no events stored.
                    var events = this._events[name];
                    if (!events)
                        continue;

                    // Remove all callbacks for this event.
                    if (!callback && !context) {
                        delete this._events[name];
                        continue;
                    }

                    // Find any remaining events.
                    var remaining = [];
                    for (var j = 0,
                        k = events.length; j < k; j++) {
                        var event = events[j];
                        if (callback && callback !== event.callback && callback !== event.callback._callback || context && context !== event.context) {
                            remaining.push(event);
                        }
                    }

                    // Replace events if there are any remaining.  Otherwise, clean up.
                    if (remaining.length) {
                        this._events[name] = remaining;
                    } else {
                        delete this._events[name];
                    }
                }

                return this;
            },

            // Trigger one or many events, firing all bound callbacks. Callbacks are
            // passed the same arguments as `trigger` is, apart from the event name
            // (unless you're listening on `"all"`, which will cause your callback to
            // receive the true name of the event as the first argument).
            trigger : function(name) {
                if (!this._events)
                    return this;
                var args = slice.call(arguments, 1);
                if (!eventsApi(this, 'trigger', name, args))
                    return this;
                var events = this._events[name];
                var allEvents = this._events.all;
                if (events)
                    triggerEvents(events, args);
                if (allEvents)
                    triggerEvents(allEvents, arguments);
                return this;
            },

            // Tell this object to stop listening to either specific events ... or
            // to every object it's currently listening to.
            stopListening : function(obj, name, callback) {
                var listeningTo = this._listeningTo;
                if (!listeningTo)
                    return this;
                var remove = !name && !callback;
                if (!callback && typeof name === 'object')
                    callback = this;
                if (obj)
                    (listeningTo = {})[obj._listenId] = obj;
                for (var id in listeningTo) {
                    obj = listeningTo[id];
                    obj.off(name, callback, this);
                    if (remove || _.isEmpty(obj._events))
                        delete this._listeningTo[id];
                }
                return this;
            }
        };

        // Regular expression used to split event strings.
        var eventSplitter = /\s+/;

        // Implement fancy features of the Events API such as multiple event
        // names `"change blur"` and jQuery-style event maps `{change: action}`
        // in terms of the existing API.
        var eventsApi = function(obj, action, name, rest) {
            if (!name)
                return true;

            // Handle event maps.
            if ( typeof name === 'object') {
                for (var key in name) {
                    obj[action].apply(obj, [key, name[key]].concat(rest));
                }
                return false;
            }

            // Handle space separated event names.
            if (eventSplitter.test(name)) {
                var names = name.split(eventSplitter);
                for (var i = 0,
                    length = names.length; i < length; i++) {
                    obj[action].apply(obj, [names[i]].concat(rest));
                }
                return false;
            }

            return true;
        };

        // A difficult-to-believe, but optimized internal dispatch function for
        // triggering events. Tries to keep the usual cases speedy (most internal
        // Backbone events have 3 arguments).
        var triggerEvents = function(events, args) {
            var ev,
                i = -1,
                l = events.length,
                a1 = args[0],
                a2 = args[1],
                a3 = args[2];
            switch (args.length) {
            case 0:
                while (++i < l)
                ( ev = events[i]).callback.call(ev.ctx);
                return;
            case 1:
                while (++i < l)
                ( ev = events[i]).callback.call(ev.ctx, a1);
                return;
            case 2:
                while (++i < l)
                ( ev = events[i]).callback.call(ev.ctx, a1, a2);
                return;
            case 3:
                while (++i < l)
                ( ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                return;
            default:
                while (++i < l)
                ( ev = events[i]).callback.apply(ev.ctx, args);
                return;
            }
        };

        var listenMethods = {
            listenTo : 'on',
            listenToOnce : 'once'
        };

        // Inversion-of-control versions of `on` and `once`. Tell *this* object to
        // listen to an event in another object ... keeping track of what it's
        // listening to.
        _.each(listenMethods, function(implementation, method) {
            Events[method] = function(obj, name, callback) {
                var listeningTo = this._listeningTo || (this._listeningTo = {});
                var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
                listeningTo[id] = obj;
                if (!callback && typeof name === 'object')
                    callback = this;
                obj[implementation](name, callback, this);
                return this;
            };
        });

        // Aliases for backwards compatibility.
        Events.bind = Events.on;
        Events.unbind = Events.off;

        // Allow the `Backbone` object to serve as a global event bus, for folks who
        // want global "pubsub" in a convenient place.
        _.extend(Backbone, Events);

        // Backbone.Model
        // --------------

        // Backbone **Models** are the basic data object in the framework --
        // frequently representing a row in a table in a database on your server.
        // A discrete chunk of data and a bunch of useful, related methods for
        // performing computations and transformations on that data.

        // Create a new model with the specified attributes. A client id (`cid`)
        // is automatically generated and assigned for you.
        var Model = Backbone.Model = function(attributes, options) {
            var attrs = attributes || {};
            options || ( options = {});
            this.cid = _.uniqueId('c');
            this.attributes = {};
            if (options.collection)
                this.collection = options.collection;
            if (options.parse)
                attrs = this.parse(attrs, options) || {};
            attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
            this.set(attrs, options);
            this.changed = {};
            this.initialize.apply(this, arguments);
        };

        // Attach all inheritable methods to the Model prototype.
        _.extend(Model.prototype, Events, {

            // A hash of attributes whose current and previous value differ.
            changed : null,

            // The value returned during the last failed validation.
            validationError : null,

            // The default name for the JSON `id` attribute is `"id"`. MongoDB and
            // CouchDB users may want to set this to `"_id"`.
            idAttribute : 'id',

            // Initialize is an empty function by default. Override it with your own
            // initialization logic.
            initialize : function() {
            },

            // Return a copy of the model's `attributes` object.
            toJSON : function(options) {
                return _.clone(this.attributes);
            },

            // Proxy `Backbone.sync` by default -- but override this if you need
            // custom syncing semantics for *this* particular model.
            sync : function() {
                return Backbone.sync.apply(this, arguments);
            },

            // Get the value of an attribute.
            get : function(attr) {
                return this.attributes[attr];
            },

            // Get the HTML-escaped value of an attribute.
            escape : function(attr) {
                return _.escape(this.get(attr));
            },

            // Returns `true` if the attribute contains a value that is not null
            // or undefined.
            has : function(attr) {
                return this.get(attr) != null;
            },

            // Set a hash of model attributes on the object, firing `"change"`. This is
            // the core primitive operation of a model, updating the data and notifying
            // anyone who needs to know about the change in state. The heart of the beast.
            set : function(key, val, options) {
                var attr,
                    attrs,
                    unset,
                    changes,
                    silent,
                    changing,
                    prev,
                    current;
                if (key == null)
                    return this;

                // Handle both `"key", value` and `{key: value}` -style arguments.
                if ( typeof key === 'object') {
                    attrs = key;
                    options = val;
                } else {
                    (attrs = {})[key] = val;
                }

                options || ( options = {});

                // Run validation.
                if (!this._validate(attrs, options))
                    return false;

                // Extract attributes and options.
                unset = options.unset;
                silent = options.silent;
                changes = [];
                changing = this._changing;
                this._changing = true;

                if (!changing) {
                    this._previousAttributes = _.clone(this.attributes);
                    this.changed = {};
                }
                current = this.attributes,
                prev = this._previousAttributes;

                // Check for changes of `id`.
                if (this.idAttribute in attrs)
                    this.id = attrs[this.idAttribute];

                // For each `set` attribute, update or delete the current value.
                for (attr in attrs) {
                    val = attrs[attr];
                    if (!_.isEqual(current[attr], val))
                        changes.push(attr);
                    if (!_.isEqual(prev[attr], val)) {
                        this.changed[attr] = val;
                    } else {
                        delete this.changed[attr];
                    }
                    unset ?
                    delete current[attr] : current[attr] = val;
                }

                // Trigger all relevant attribute changes.
                if (!silent) {
                    if (changes.length)
                        this._pending = options;
                    for (var i = 0,
                        length = changes.length; i < length; i++) {
                        this.trigger('change:' + changes[i], this, current[changes[i]], options);
                    }
                }

                // You might be wondering why there's a `while` loop here. Changes can
                // be recursively nested within `"change"` events.
                if (changing)
                    return this;
                if (!silent) {
                    while (this._pending) {
                        options = this._pending;
                        this._pending = false;
                        this.trigger('change', this, options);
                    }
                }
                this._pending = false;
                this._changing = false;
                return this;
            },

            // Remove an attribute from the model, firing `"change"`. `unset` is a noop
            // if the attribute doesn't exist.
            unset : function(attr, options) {
                return this.set(attr,
                void 0, _.extend({}, options, {
                    unset : true
                }));
            },

            // Clear all attributes on the model, firing `"change"`.
            clear : function(options) {
                var attrs = {};
                for (var key in this.attributes)
                attrs[key] =
                void 0;
                return this.set(attrs, _.extend({}, options, {
                    unset : true
                }));
            },

            // Determine if the model has changed since the last `"change"` event.
            // If you specify an attribute name, determine if that attribute has changed.
            hasChanged : function(attr) {
                if (attr == null)
                    return !_.isEmpty(this.changed);
                return _.has(this.changed, attr);
            },

            // Return an object containing all the attributes that have changed, or
            // false if there are no changed attributes. Useful for determining what
            // parts of a view need to be updated and/or what attributes need to be
            // persisted to the server. Unset attributes will be set to undefined.
            // You can also pass an attributes object to diff against the model,
            // determining if there *would be* a change.
            changedAttributes : function(diff) {
                if (!diff)
                    return this.hasChanged() ? _.clone(this.changed) : false;
                var val,
                    changed = false;
                var old = this._changing ? this._previousAttributes : this.attributes;
                for (var attr in diff) {
                    if (_.isEqual(old[attr], ( val = diff[attr])))
                        continue;
                    (changed || (changed = {}))[attr] = val;
                }
                return changed;
            },

            // Get the previous value of an attribute, recorded at the time the last
            // `"change"` event was fired.
            previous : function(attr) {
                if (attr == null || !this._previousAttributes)
                    return null;
                return this._previousAttributes[attr];
            },

            // Get all of the attributes of the model at the time of the previous
            // `"change"` event.
            previousAttributes : function() {
                return _.clone(this._previousAttributes);
            },

            // Fetch the model from the server. If the server's representation of the
            // model differs from its current attributes, they will be overridden,
            // triggering a `"change"` event.
            fetch : function(options) {
                options = options ? _.clone(options) : {};
                if (options.parse ===
                    void 0)
                    options.parse = true;
                var model = this;
                var success = options.success;
                options.success = function(resp) {
                    if (!model.set(model.parse(resp, options), options))
                        return false;
                    if (success)
                        success(model, resp, options);
                    model.trigger('sync', model, resp, options);
                };
                wrapError(this, options);
                return this.sync('read', this, options);
            },

            // Set a hash of model attributes, and sync the model to the server.
            // If the server returns an attributes hash that differs, the model's
            // state will be `set` again.
            save : function(key, val, options) {
                var attrs,
                    method,
                    xhr,
                    attributes = this.attributes;

                // Handle both `"key", value` and `{key: value}` -style arguments.
                if (key == null || typeof key === 'object') {
                    attrs = key;
                    options = val;
                } else {
                    (attrs = {})[key] = val;
                }

                options = _.extend({
                    validate : true
                }, options);

                // If we're not waiting and attributes exist, save acts as
                // `set(attr).save(null, opts)` with validation. Otherwise, check if
                // the model will be valid when the attributes, if any, are set.
                if (attrs && !options.wait) {
                    if (!this.set(attrs, options))
                        return false;
                } else {
                    if (!this._validate(attrs, options))
                        return false;
                }

                // Set temporary attributes if `{wait: true}`.
                if (attrs && options.wait) {
                    this.attributes = _.extend({}, attributes, attrs);
                }

                // After a successful server-side save, the client is (optionally)
                // updated with the server-side state.
                if (options.parse ===
                    void 0)
                    options.parse = true;
                var model = this;
                var success = options.success;
                options.success = function(resp) {
                    // Ensure attributes are restored during synchronous saves.
                    model.attributes = attributes;
                    var serverAttrs = model.parse(resp, options);
                    if (options.wait)
                        serverAttrs = _.extend(attrs || {}, serverAttrs);
                    if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
                        return false;
                    }
                    if (success)
                        success(model, resp, options);
                    model.trigger('sync', model, resp, options);
                };
                wrapError(this, options);

                method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
                if (method === 'patch' && !options.attrs)
                    options.attrs = attrs;
                xhr = this.sync(method, this, options);

                // Restore attributes.
                if (attrs && options.wait)
                    this.attributes = attributes;

                return xhr;
            },

            // Destroy this model on the server if it was already persisted.
            // Optimistically removes the model from its collection, if it has one.
            // If `wait: true` is passed, waits for the server to respond before removal.
            destroy : function(options) {
                options = options ? _.clone(options) : {};
                var model = this;
                var success = options.success;

                var destroy = function() {
                    model.stopListening();
                    model.trigger('destroy', model, model.collection, options);
                };

                options.success = function(resp) {
                    if (options.wait || model.isNew())
                        destroy();
                    if (success)
                        success(model, resp, options);
                    if (!model.isNew())
                        model.trigger('sync', model, resp, options);
                };

                if (this.isNew()) {
                    options.success();
                    return false;
                }
                wrapError(this, options);

                var xhr = this.sync('delete', this, options);
                if (!options.wait)
                    destroy();
                return xhr;
            },

            // Default URL for the model's representation on the server -- if you're
            // using Backbone's restful methods, override this to change the endpoint
            // that will be called.
            url : function() {
                var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
                if (this.isNew())
                    return base;
                return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
            },

            // **parse** converts a response into the hash of attributes to be `set` on
            // the model. The default implementation is just to pass the response along.
            parse : function(resp, options) {
                return resp;
            },

            // Create a new model with identical attributes to this one.
            clone : function() {
                return new this.constructor(this.attributes);
            },

            // A model is new if it has never been saved to the server, and lacks an id.
            isNew : function() {
                return !this.has(this.idAttribute);
            },

            // Check if the model is currently in a valid state.
            isValid : function(options) {
                return this._validate({}, _.extend(options || {}, {
                    validate : true
                }));
            },

            // Run validation against the next complete set of model attributes,
            // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
            _validate : function(attrs, options) {
                if (!options.validate || !this.validate)
                    return true;
                attrs = _.extend({}, this.attributes, attrs);
                var error = this.validationError = this.validate(attrs, options) || null;
                if (!error)
                    return true;
                this.trigger('invalid', this, error, _.extend(options, {
                    validationError : error
                }));
                return false;
            }
        });

        // Underscore methods that we want to implement on the Model.
        var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit', 'chain'];

        // Mix in each Underscore method as a proxy to `Model#attributes`.
        _.each(modelMethods, function(method) {
            if (!_[method])
                return;
            Model.prototype[method] = function() {
                var args = slice.call(arguments);
                args.unshift(this.attributes);
                return _[method].apply(_, args);
            };
        });

        // Backbone.Collection
        // -------------------

        // If models tend to represent a single row of data, a Backbone Collection is
        // more analogous to a table full of data ... or a small slice or page of that
        // table, or a collection of rows that belong together for a particular reason
        // -- all of the messages in this particular folder, all of the documents
        // belonging to this particular author, and so on. Collections maintain
        // indexes of their models, both in order, and for lookup by `id`.

        // Create a new **Collection**, perhaps to contain a specific type of `model`.
        // If a `comparator` is specified, the Collection will maintain
        // its models in sort order, as they're added and removed.
        var Collection = Backbone.Collection = function(models, options) {
            options || ( options = {});
            if (options.model)
                this.model = options.model;
            if (options.comparator !==
                void 0)
                this.comparator = options.comparator;
            this._reset();
            this.initialize.apply(this, arguments);
            if (models)
                this.reset(models, _.extend({
                    silent : true
                }, options));
        };

        // Default options for `Collection#set`.
        var setOptions = {
            add : true,
            remove : true,
            merge : true
        };
        var addOptions = {
            add : true,
            remove : false
        };

        // Define the Collection's inheritable methods.
        _.extend(Collection.prototype, Events, {

            // The default model for a collection is just a **Backbone.Model**.
            // This should be overridden in most cases.
            model : Model,

            // Initialize is an empty function by default. Override it with your own
            // initialization logic.
            initialize : function() {
            },

            // The JSON representation of a Collection is an array of the
            // models' attributes.
            toJSON : function(options) {
                return this.map(function(model) {
                    return model.toJSON(options);
                });
            },

            // Proxy `Backbone.sync` by default.
            sync : function() {
                return Backbone.sync.apply(this, arguments);
            },

            // Add a model, or list of models to the set.
            add : function(models, options) {
                return this.set(models, _.extend({
                    merge : false
                }, options, addOptions));
            },

            // Remove a model, or a list of models from the set.
            remove : function(models, options) {
                var singular = !_.isArray(models);
                models = singular ? [models] : _.clone(models);
                options || ( options = {});
                for (var i = 0,
                    length = models.length; i < length; i++) {
                    var model = models[i] = this.get(models[i]);
                    if (!model)
                        continue;
                    var id = this.modelId(model.attributes);
                    if (id != null)
                        delete this._byId[id];
                    delete this._byId[model.cid];
                    var index = this.indexOf(model);
                    this.models.splice(index, 1);
                    this.length--;
                    if (!options.silent) {
                        options.index = index;
                        model.trigger('remove', model, this, options);
                    }
                    this._removeReference(model, options);
                }
                return singular ? models[0] : models;
            },

            // Update a collection by `set`-ing a new list of models, adding new ones,
            // removing models that are no longer present, and merging models that
            // already exist in the collection, as necessary. Similar to **Model#set**,
            // the core operation for updating the data contained by the collection.
            set : function(models, options) {
                options = _.defaults({}, options, setOptions);
                if (options.parse)
                    models = this.parse(models, options);
                var singular = !_.isArray(models);
                models = singular ? ( models ? [models] : []) : models.slice();
                var id,
                    model,
                    attrs,
                    existing,
                    sort;
                var at = options.at;
                var sortable = this.comparator && (at == null) && options.sort !== false;
                var sortAttr = _.isString(this.comparator) ? this.comparator : null;
                var toAdd = [],
                    toRemove = [],
                    modelMap = {};
                var add = options.add,
                    merge = options.merge,
                    remove = options.remove;
                var order = !sortable && add && remove ? [] : false;

                // Turn bare objects into model references, and prevent invalid models
                // from being added.
                for (var i = 0,
                    length = models.length; i < length; i++) {
                    attrs = models[i];

                    // If a duplicate is found, prevent it from being added and
                    // optionally merge it into the existing model.
                    if ( existing = this.get(attrs)) {
                        if (remove)
                            modelMap[existing.cid] = true;
                        if (merge && attrs !== existing) {
                            attrs = this._isModel(attrs) ? attrs.attributes : attrs;
                            if (options.parse)
                                attrs = existing.parse(attrs, options);
                            existing.set(attrs, options);
                            if (sortable && !sort && existing.hasChanged(sortAttr))
                                sort = true;
                        }
                        models[i] = existing;

                        // If this is a new, valid model, push it to the `toAdd` list.
                    } else if (add) {
                        model = models[i] = this._prepareModel(attrs, options);
                        if (!model)
                            continue;
                        toAdd.push(model);
                        this._addReference(model, options);
                    }

                    // Do not add multiple models with the same `id`.
                    model = existing || model;
                    if (!model)
                        continue;
                    id = this.modelId(model.attributes);
                    if (order && (model.isNew() || !modelMap[id]))
                        order.push(model);
                    modelMap[id] = true;
                }

                // Remove nonexistent models if appropriate.
                if (remove) {
                    for (var i = 0,
                        length = this.length; i < length; i++) {
                        if (!modelMap[( model = this.models[i]).cid])
                            toRemove.push(model);
                    }
                    if (toRemove.length)
                        this.remove(toRemove, options);
                }

                // See if sorting is needed, update `length` and splice in new models.
                if (toAdd.length || (order && order.length)) {
                    if (sortable)
                        sort = true;
                    this.length += toAdd.length;
                    if (at != null) {
                        for (var i = 0,
                            length = toAdd.length; i < length; i++) {
                            this.models.splice(at + i, 0, toAdd[i]);
                        }
                    } else {
                        if (order)
                            this.models.length = 0;
                        var orderedModels = order || toAdd;
                        for (var i = 0,
                            length = orderedModels.length; i < length; i++) {
                            this.models.push(orderedModels[i]);
                        }
                    }
                }

                // Silently sort the collection if appropriate.
                if (sort)
                    this.sort({
                        silent : true
                    });

                // Unless silenced, it's time to fire all appropriate add/sort events.
                if (!options.silent) {
                    for (var i = 0,
                        length = toAdd.length; i < length; i++) {
                        ( model = toAdd[i]).trigger('add', model, this, options);
                    }
                    if (sort || (order && order.length))
                        this.trigger('sort', this, options);
                }

                // Return the added (or merged) model (or models).
                return singular ? models[0] : models;
            },

            // When you have more items than you want to add or remove individually,
            // you can reset the entire set with a new list of models, without firing
            // any granular `add` or `remove` events. Fires `reset` when finished.
            // Useful for bulk operations and optimizations.
            reset : function(models, options) {
                options || ( options = {});
                for (var i = 0,
                    length = this.models.length; i < length; i++) {
                    this._removeReference(this.models[i], options);
                }
                options.previousModels = this.models;
                this._reset();
                models = this.add(models, _.extend({
                    silent : true
                }, options));
                if (!options.silent)
                    this.trigger('reset', this, options);
                return models;
            },

            // Add a model to the end of the collection.
            push : function(model, options) {
                return this.add(model, _.extend({
                    at : this.length
                }, options));
            },

            // Remove a model from the end of the collection.
            pop : function(options) {
                var model = this.at(this.length - 1);
                this.remove(model, options);
                return model;
            },

            // Add a model to the beginning of the collection.
            unshift : function(model, options) {
                return this.add(model, _.extend({
                    at : 0
                }, options));
            },

            // Remove a model from the beginning of the collection.
            shift : function(options) {
                var model = this.at(0);
                this.remove(model, options);
                return model;
            },

            // Slice out a sub-array of models from the collection.
            slice : function() {
                return slice.apply(this.models, arguments);
            },

            // Get a model from the set by id.
            get : function(obj) {
                if (obj == null)
                    return
                    void 0;
                var id = this.modelId(this._isModel(obj) ? obj.attributes : obj);
                return this._byId[obj] || this._byId[id] || this._byId[obj.cid];
            },

            // Get the model at the given index.
            at : function(index) {
                return this.models[index];
            },

            // Return models with matching attributes. Useful for simple cases of
            // `filter`.
            where : function(attrs, first) {
                if (_.isEmpty(attrs))
                    return first ?
                    void 0 : [];
                return this[first ? 'find' : 'filter'](function(model) {
                    for (var key in attrs) {
                        if (attrs[key] !== model.get(key))
                            return false;
                    }
                    return true;
                });
            },

            // Return the first model with matching attributes. Useful for simple cases
            // of `find`.
            findWhere : function(attrs) {
                return this.where(attrs, true);
            },

            // Force the collection to re-sort itself. You don't need to call this under
            // normal circumstances, as the set will maintain sort order as each item
            // is added.
            sort : function(options) {
                if (!this.comparator)
                    throw new Error('Cannot sort a set without a comparator');
                options || ( options = {});

                // Run sort based on type of `comparator`.
                if (_.isString(this.comparator) || this.comparator.length === 1) {
                    this.models = this.sortBy(this.comparator, this);
                } else {
                    this.models.sort(_.bind(this.comparator, this));
                }

                if (!options.silent)
                    this.trigger('sort', this, options);
                return this;
            },

            // Pluck an attribute from each model in the collection.
            pluck : function(attr) {
                return _.invoke(this.models, 'get', attr);
            },

            // Fetch the default set of models for this collection, resetting the
            // collection when they arrive. If `reset: true` is passed, the response
            // data will be passed through the `reset` method instead of `set`.
            fetch : function(options) {
                options = options ? _.clone(options) : {};
                if (options.parse ===
                    void 0)
                    options.parse = true;
                var success = options.success;
                var collection = this;
                options.success = function(resp) {
                    var method = options.reset ? 'reset' : 'set';
                    collection[method](resp, options);
                    if (success)
                        success(collection, resp, options);
                    collection.trigger('sync', collection, resp, options);
                };
                wrapError(this, options);
                return this.sync('read', this, options);
            },

            // Create a new instance of a model in this collection. Add the model to the
            // collection immediately, unless `wait: true` is passed, in which case we
            // wait for the server to agree.
            create : function(model, options) {
                options = options ? _.clone(options) : {};
                if (!( model = this._prepareModel(model, options)))
                    return false;
                if (!options.wait)
                    this.add(model, options);
                var collection = this;
                var success = options.success;
                options.success = function(model, resp) {
                    if (options.wait)
                        collection.add(model, options);
                    if (success)
                        success(model, resp, options);
                };
                model.save(null, options);
                return model;
            },

            // **parse** converts a response into a list of models to be added to the
            // collection. The default implementation is just to pass it through.
            parse : function(resp, options) {
                return resp;
            },

            // Create a new collection with an identical list of models as this one.
            clone : function() {
                return new this.constructor(this.models, {
                    model : this.model,
                    comparator : this.comparator
                });
            },

            // Define how to uniquely identify models in the collection.
            modelId : function(attrs) {
                return attrs[this.model.prototype.idAttribute || 'id'];
            },

            // Private method to reset all internal state. Called when the collection
            // is first initialized or reset.
            _reset : function() {
                this.length = 0;
                this.models = [];
                this._byId = {};
            },

            // Prepare a hash of attributes (or other model) to be added to this
            // collection.
            _prepareModel : function(attrs, options) {
                if (this._isModel(attrs)) {
                    if (!attrs.collection)
                        attrs.collection = this;
                    return attrs;
                }
                options = options ? _.clone(options) : {};
                options.collection = this;
                var model = new this.model(attrs, options);
                if (!model.validationError)
                    return model;
                this.trigger('invalid', this, model.validationError, options);
                return false;
            },

            // Method for checking whether an object should be considered a model for
            // the purposes of adding to the collection.
            _isModel : function(model) {
                return model instanceof Model;
            },

            // Internal method to create a model's ties to a collection.
            _addReference : function(model, options) {
                this._byId[model.cid] = model;
                var id = this.modelId(model.attributes);
                if (id != null)
                    this._byId[id] = model;
                model.on('all', this._onModelEvent, this);
            },

            // Internal method to sever a model's ties to a collection.
            _removeReference : function(model, options) {
                if (this === model.collection)
                    delete model.collection;
                model.off('all', this._onModelEvent, this);
            },

            // Internal method called every time a model in the set fires an event.
            // Sets need to update their indexes when models change ids. All other
            // events simply proxy through. "add" and "remove" events that originate
            // in other collections are ignored.
            _onModelEvent : function(event, model, collection, options) {
                if ((event === 'add' || event === 'remove') && collection !== this)
                    return;
                if (event === 'destroy')
                    this.remove(model, options);
                if (event === 'change') {
                    var prevId = this.modelId(model.previousAttributes());
                    var id = this.modelId(model.attributes);
                    if (prevId !== id) {
                        if (prevId != null)
                            delete this._byId[prevId];
                        if (id != null)
                            this._byId[id] = model;
                    }
                }
                this.trigger.apply(this, arguments);
            }
        });

        // Underscore methods that we want to implement on the Collection.
        // 90% of the core usefulness of Backbone Collections is actually implemented
        // right here:
        var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl', 'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest', 'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'chain', 'sample', 'partition'];

        // Mix in each Underscore method as a proxy to `Collection#models`.
        _.each(methods, function(method) {
            if (!_[method])
                return;
            Collection.prototype[method] = function() {
                var args = slice.call(arguments);
                args.unshift(this.models);
                return _[method].apply(_, args);
            };
        });

        // Underscore methods that take a property name as an argument.
        var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

        // Use attributes instead of properties.
        _.each(attributeMethods, function(method) {
            if (!_[method])
                return;
            Collection.prototype[method] = function(value, context) {
                var iterator = _.isFunction(value) ? value : function(model) {
                    return model.get(value);
                };
                return _[method](this.models, iterator, context);
            };
        });

        // Backbone.View
        // -------------

        // Backbone Views are almost more convention than they are actual code. A View
        // is simply a JavaScript object that represents a logical chunk of UI in the
        // DOM. This might be a single item, an entire list, a sidebar or panel, or
        // even the surrounding frame which wraps your whole app. Defining a chunk of
        // UI as a **View** allows you to define your DOM events declaratively, without
        // having to worry about render order ... and makes it easy for the view to
        // react to specific changes in the state of your models.

        // Creating a Backbone.View creates its initial element outside of the DOM,
        // if an existing element is not provided...
        var View = Backbone.View = function(options) {
            this.cid = _.uniqueId('view');
            options || ( options = {});
            _.extend(this, _.pick(options, viewOptions));
            this._ensureElement();
            this.initialize.apply(this, arguments);
        };

        // Cached regex to split keys for `delegate`.
        var delegateEventSplitter = /^(\S+)\s*(.*)$/;

        // List of view options to be merged as properties.
        var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

        // Set up all inheritable **Backbone.View** properties and methods.
        _.extend(View.prototype, Events, {

            // The default `tagName` of a View's element is `"div"`.
            tagName : 'div',

            // jQuery delegate for element lookup, scoped to DOM elements within the
            // current view. This should be preferred to global lookups where possible.
            $ : function(selector) {
                return this.$el.find(selector);
            },

            // Initialize is an empty function by default. Override it with your own
            // initialization logic.
            initialize : function() {
            },

            // **render** is the core function that your view should override, in order
            // to populate its element (`this.el`), with the appropriate HTML. The
            // convention is for **render** to always return `this`.
            render : function() {
                return this;
            },

            // Remove this view by taking the element out of the DOM, and removing any
            // applicable Backbone.Events listeners.
            remove : function() {
                this._removeElement();
                this.stopListening();
                return this;
            },

            // Remove this view's element from the document and all event listeners
            // attached to it. Exposed for subclasses using an alternative DOM
            // manipulation API.
            _removeElement : function() {
                this.$el.remove();
            },

            // Change the view's element (`this.el` property) and re-delegate the
            // view's events on the new element.
            setElement : function(element) {
                this.undelegateEvents();
                this._setElement(element);
                this.delegateEvents();
                return this;
            },

            // Creates the `this.el` and `this.$el` references for this view using the
            // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
            // context or an element. Subclasses can override this to utilize an
            // alternative DOM manipulation API and are only required to set the
            // `this.el` property.
            _setElement : function(el) {
                this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
                this.el = this.$el[0];
            },

            // Set callbacks, where `this.events` is a hash of
            //
            // *{"event selector": "callback"}*
            //
            //     {
            //       'mousedown .title':  'edit',
            //       'click .button':     'save',
            //       'click .open':       function(e) { ... }
            //     }
            //
            // pairs. Callbacks will be bound to the view, with `this` set properly.
            // Uses event delegation for efficiency.
            // Omitting the selector binds the event to `this.el`.
            delegateEvents : function(events) {
                if (!(events || ( events = _.result(this, 'events'))))
                    return this;
                this.undelegateEvents();
                for (var key in events) {
                    var method = events[key];
                    if (!_.isFunction(method))
                        method = this[events[key]];
                    if (!method)
                        continue;
                    var match = key.match(delegateEventSplitter);
                    this.delegate(match[1], match[2], _.bind(method, this));
                }
                return this;
            },

            // Add a single event listener to the view's element (or a child element
            // using `selector`). This only works for delegate-able events: not `focus`,
            // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
            delegate : function(eventName, selector, listener) {
                this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
            },

            // Clears all callbacks previously bound to the view by `delegateEvents`.
            // You usually don't need to use this, but may wish to if you have multiple
            // Backbone views attached to the same DOM element.
            undelegateEvents : function() {
                if (this.$el)
                    this.$el.off('.delegateEvents' + this.cid);
                return this;
            },

            // A finer-grained `undelegateEvents` for removing a single delegated event.
            // `selector` and `listener` are both optional.
            undelegate : function(eventName, selector, listener) {
                this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
            },

            // Produces a DOM element to be assigned to your view. Exposed for
            // subclasses using an alternative DOM manipulation API.
            _createElement : function(tagName) {
                return document.createElement(tagName);
            },

            // Ensure that the View has a DOM element to render into.
            // If `this.el` is a string, pass it through `$()`, take the first
            // matching element, and re-assign it to `el`. Otherwise, create
            // an element from the `id`, `className` and `tagName` properties.
            _ensureElement : function() {
                if (!this.el) {
                    var attrs = _.extend({}, _.result(this, 'attributes'));
                    if (this.id)
                        attrs.id = _.result(this, 'id');
                    if (this.className)
                        attrs['class'] = _.result(this, 'className');
                    this.setElement(this._createElement(_.result(this, 'tagName')));
                    this._setAttributes(attrs);
                } else {
                    this.setElement(_.result(this, 'el'));
                }
            },

            // Set attributes from a hash on this view's element.  Exposed for
            // subclasses using an alternative DOM manipulation API.
            _setAttributes : function(attributes) {
                this.$el.attr(attributes);
            }
        });

        // Backbone.sync
        // -------------

        // Override this function to change the manner in which Backbone persists
        // models to the server. You will be passed the type of request, and the
        // model in question. By default, makes a RESTful Ajax request
        // to the model's `url()`. Some possible customizations could be:
        //
        // * Use `setTimeout` to batch rapid-fire updates into a single request.
        // * Send up the models as XML instead of JSON.
        // * Persist models via WebSockets instead of Ajax.
        //
        // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
        // as `POST`, with a `_method` parameter containing the true HTTP method,
        // as well as all requests with the body as `application/x-www-form-urlencoded`
        // instead of `application/json` with the model in a param named `model`.
        // Useful when interfacing with server-side languages like **PHP** that make
        // it difficult to read the body of `PUT` requests.
        Backbone.sync = function(method, model, options) {
            var type = methodMap[method];

            // Default options, unless specified.
            _.defaults(options || ( options = {}), {
                emulateHTTP : Backbone.emulateHTTP,
                emulateJSON : Backbone.emulateJSON
            });

            // Default JSON-request options.
            var params = {
                type : type,
                dataType : 'json'
            };

            // Ensure that we have a URL.
            if (!options.url) {
                params.url = _.result(model, 'url') || urlError();
            }

            // Ensure that we have the appropriate request data.
            if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
                params.contentType = 'application/json';
                params.data = JSON.stringify(options.attrs || model.toJSON(options));
            }

            // For older servers, emulate JSON by encoding the request into an HTML-form.
            if (options.emulateJSON) {
                params.contentType = 'application/x-www-form-urlencoded';
                params.data = params.data ? {
                    model : params.data
                } : {};
            }

            // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
            // And an `X-HTTP-Method-Override` header.
            if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
                params.type = 'POST';
                if (options.emulateJSON)
                    params.data._method = type;
                var beforeSend = options.beforeSend;
                options.beforeSend = function(xhr) {
                    xhr.setRequestHeader('X-HTTP-Method-Override', type);
                    if (beforeSend)
                        return beforeSend.apply(this, arguments);
                };
            }

            // Don't process data on a non-GET request.
            if (params.type !== 'GET' && !options.emulateJSON) {
                params.processData = false;
            }

            // Pass along `textStatus` and `errorThrown` from jQuery.
            var error = options.error;
            options.error = function(xhr, textStatus, errorThrown) {
                options.textStatus = textStatus;
                options.errorThrown = errorThrown;
                if (error)
                    error.apply(this, arguments);
            };

            // Make the request, allowing the user to override any Ajax options.
            var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
            model.trigger('request', model, xhr, options);
            return xhr;
        };

        // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
        var methodMap = {
            'create' : 'POST',
            'update' : 'PUT',
            'patch' : 'PATCH',
            'delete' : 'DELETE',
            'read' : 'GET'
        };

        // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
        // Override this if you'd like to use a different library.
        Backbone.ajax = function() {
            return Backbone.$.ajax.apply(Backbone.$, arguments);
        };

        // Backbone.Router
        // ---------------

        // Routers map faux-URLs to actions, and fire events when routes are
        // matched. Creating a new one sets its `routes` hash, if not set statically.
        var Router = Backbone.Router = function(options) {
            options || ( options = {});
            if (options.routes)
                this.routes = options.routes;
            this._bindRoutes();
            this.initialize.apply(this, arguments);
        };

        // Cached regular expressions for matching named param parts and splatted
        // parts of route strings.
        var optionalParam = /\((.*?)\)/g;
        var namedParam = /(\(\?)?:\w+/g;
        var splatParam = /\*\w+/g;
        var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

        // Set up all inheritable **Backbone.Router** properties and methods.
        _.extend(Router.prototype, Events, {

            // Initialize is an empty function by default. Override it with your own
            // initialization logic.
            initialize : function() {
            },

            // Manually bind a single named route to a callback. For example:
            //
            //     this.route('search/:query/p:num', 'search', function(query, num) {
            //       ...
            //     });
            //
            route : function(route, name, callback) {
                if (!_.isRegExp(route))
                    route = this._routeToRegExp(route);
                if (_.isFunction(name)) {
                    callback = name;
                    name = '';
                }
                if (!callback)
                    callback = this[name];
                var router = this;
                Backbone.history.route(route, function(fragment) {
                    var args = router._extractParameters(route, fragment);
                    if (router.execute(callback, args, name) !== false) {
                        router.trigger.apply(router, ['route:' + name].concat(args));
                        router.trigger('route', name, args);
                        Backbone.history.trigger('route', router, name, args);
                    }
                });
                return this;
            },

            // Execute a route handler with the provided parameters.  This is an
            // excellent place to do pre-route setup or post-route cleanup.
            execute : function(callback, args, name) {
                if (callback)
                    callback.apply(this, args);
            },

            // Simple proxy to `Backbone.history` to save a fragment into the history.
            navigate : function(fragment, options) {
                Backbone.history.navigate(fragment, options);
                return this;
            },

            // Bind all defined routes to `Backbone.history`. We have to reverse the
            // order of the routes here to support behavior where the most general
            // routes can be defined at the bottom of the route map.
            _bindRoutes : function() {
                if (!this.routes)
                    return;
                this.routes = _.result(this, 'routes');
                var route,
                    routes = _.keys(this.routes);
                while (( route = routes.pop()) != null) {
                    this.route(route, this.routes[route]);
                }
            },

            // Convert a route string into a regular expression, suitable for matching
            // against the current location hash.
            _routeToRegExp : function(route) {
                route = route.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam, function(match, optional) {
                    return optional ? match : '([^/?]+)';
                }).replace(splatParam, '([^?]*?)');
                return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
            },

            // Given a route, and a URL fragment that it matches, return the array of
            // extracted decoded parameters. Empty or unmatched parameters will be
            // treated as `null` to normalize cross-browser behavior.
            _extractParameters : function(route, fragment) {
                var params = route.exec(fragment).slice(1);
                return _.map(params, function(param, i) {
                    // Don't decode the search params.
                    if (i === params.length - 1)
                        return param || null;
                    return param ? decodeURIComponent(param) : null;
                });
            }
        });

        // Backbone.History
        // ----------------

        // Handles cross-browser history management, based on either
        // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
        // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
        // and URL fragments. If the browser supports neither (old IE, natch),
        // falls back to polling.
        var History = Backbone.History = function() {
            this.handlers = [];
            _.bindAll(this, 'checkUrl');

            // Ensure that `History` can be used outside of the browser.
            if ( typeof window !== 'undefined') {
                this.location = window.location;
                this.history = window.history;
            }
        };

        // Cached regex for stripping a leading hash/slash and trailing space.
        var routeStripper = /^[#\/]|\s+$/g;

        // Cached regex for stripping leading and trailing slashes.
        var rootStripper = /^\/+|\/+$/g;

        // Cached regex for stripping urls of hash.
        var pathStripper = /#.*$/;

        // Has the history handling already been started?
        History.started = false;

        // Set up all inheritable **Backbone.History** properties and methods.
        _.extend(History.prototype, Events, {

            // The default interval to poll for hash changes, if necessary, is
            // twenty times a second.
            interval : 50,

            // Are we at the app root?
            atRoot : function() {
                var path = this.location.pathname.replace(/[^\/]$/, '$&/');
                return path === this.root && !this.getSearch();
            },

            // In IE6, the hash fragment and search params are incorrect if the
            // fragment contains `?`.
            getSearch : function() {
                var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
                return match ? match[0] : '';
            },

            // Gets the true hash value. Cannot use location.hash directly due to bug
            // in Firefox where location.hash will always be decoded.
            getHash : function(window) {
                var match = (window || this).location.href.match(/#(.*)$/);
                return match ? match[1] : '';
            },

            // Get the pathname and search params, without the root.
            getPath : function() {
                var path = decodeURI(this.location.pathname + this.getSearch());
                var root = this.root.slice(0, -1);
                if (!path.indexOf(root))
                    path = path.slice(root.length);
                return path.slice(1);
            },

            // Get the cross-browser normalized URL fragment from the path or hash.
            getFragment : function(fragment) {
                if (fragment == null) {
                    if (this._hasPushState || !this._wantsHashChange) {
                        fragment = this.getPath();
                    } else {
                        fragment = this.getHash();
                    }
                }
                return fragment.replace(routeStripper, '');
            },

            // Start the hash change handling, returning `true` if the current URL matches
            // an existing route, and `false` otherwise.
            start : function(options) {
                if (History.started)
                    throw new Error('Backbone.history has already been started');
                History.started = true;

                // Figure out the initial configuration. Do we need an iframe?
                // Is pushState desired ... is it available?
                this.options = _.extend({
                    root : '/'
                }, this.options, options);
                this.root = this.options.root;
                this._wantsHashChange = this.options.hashChange !== false;
                this._hasHashChange = 'onhashchange' in window;
                this._wantsPushState = !!this.options.pushState;
                this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
                this.fragment = this.getFragment();

                // Add a cross-platform `addEventListener` shim for older browsers.
                var addEventListener = window.addEventListener ||
                function(eventName, listener) {
                    return attachEvent('on' + eventName, listener);
                };

                // Normalize root to always include a leading and trailing slash.
                this.root = ('/' + this.root + '/').replace(rootStripper, '/');

                // Proxy an iframe to handle location events if the browser doesn't
                // support the `hashchange` event, HTML5 history, or the user wants
                // `hashChange` but not `pushState`.
                if (!this._hasHashChange && this._wantsHashChange && (!this._wantsPushState || !this._hasPushState)) {
                    var iframe = document.createElement('iframe');
                    iframe.src = 'javascript:0';
                    iframe.style.display = 'none';
                    iframe.tabIndex = -1;
                    var body = document.body;
                    // Using `appendChild` will throw on IE < 9 if the document is not ready.
                    this.iframe = body.insertBefore(iframe, body.firstChild).contentWindow;
                    this.navigate(this.fragment);
                }

                // Depending on whether we're using pushState or hashes, and whether
                // 'onhashchange' is supported, determine how we check the URL state.
                if (this._hasPushState) {
                    addEventListener('popstate', this.checkUrl, false);
                } else if (this._wantsHashChange && this._hasHashChange && !this.iframe) {
                    addEventListener('hashchange', this.checkUrl, false);
                } else if (this._wantsHashChange) {
                    this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
                }

                // Transition from hashChange to pushState or vice versa if both are
                // requested.
                if (this._wantsHashChange && this._wantsPushState) {

                    // If we've started off with a route from a `pushState`-enabled
                    // browser, but we're currently in a browser that doesn't support it...
                    if (!this._hasPushState && !this.atRoot()) {
                        this.location.replace(this.root + '#' + this.getPath());
                        // Return immediately as browser will do redirect to new url
                        return true;

                        // Or if we've started out with a hash-based route, but we're currently
                        // in a browser where it could be `pushState`-based instead...
                    } else if (this._hasPushState && this.atRoot()) {
                        this.navigate(this.getHash(), {
                            replace : true
                        });
                    }

                }

                if (!this.options.silent)
                    return this.loadUrl();
            },

            // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
            // but possibly useful for unit testing Routers.
            stop : function() {
                // Add a cross-platform `removeEventListener` shim for older browsers.
                var removeEventListener = window.removeEventListener ||
                function(eventName, listener) {
                    return detachEvent('on' + eventName, listener);
                };

                // Remove window listeners.
                if (this._hasPushState) {
                    removeEventListener('popstate', this.checkUrl, false);
                } else if (this._wantsHashChange && this._hasHashChange && !this.iframe) {
                    removeEventListener('hashchange', this.checkUrl, false);
                }

                // Clean up the iframe if necessary.
                if (this.iframe) {
                    document.body.removeChild(this.iframe.frameElement);
                    this.iframe = null;
                }

                // Some environments will throw when clearing an undefined interval.
                if (this._checkUrlInterval)
                    clearInterval(this._checkUrlInterval);
                History.started = false;
            },

            // Add a route to be tested when the fragment changes. Routes added later
            // may override previous routes.
            route : function(route, callback) {
                this.handlers.unshift({
                    route : route,
                    callback : callback
                });
            },

            // Checks the current URL to see if it has changed, and if it has,
            // calls `loadUrl`, normalizing across the hidden iframe.
            checkUrl : function(e) {
                var current = this.getFragment();
                if (current === this.fragment && this.iframe) {
                    current = this.getHash(this.iframe);
                }
                if (current === this.fragment)
                    return false;
                if (this.iframe)
                    this.navigate(current);
                this.loadUrl();
            },

            // Attempt to load the current URL fragment. If a route succeeds with a
            // match, returns `true`. If no defined routes matches the fragment,
            // returns `false`.
            loadUrl : function(fragment) {
                fragment = this.fragment = this.getFragment(fragment);
                return _.any(this.handlers, function(handler) {
                    if (handler.route.test(fragment)) {
                        handler.callback(fragment);
                        return true;
                    }
                });
            },

            // Save a fragment into the hash history, or replace the URL state if the
            // 'replace' option is passed. You are responsible for properly URL-encoding
            // the fragment in advance.
            //
            // The options object can contain `trigger: true` if you wish to have the
            // route callback be fired (not usually desirable), or `replace: true`, if
            // you wish to modify the current URL without adding an entry to the history.
            navigate : function(fragment, options) {
                if (!History.started)
                    return false;
                if (!options || options === true)
                    options = {
                        trigger : !!options
                    };

                var url = this.root + ( fragment = this.getFragment(fragment || ''));

                // Strip the hash and decode for matching.
                fragment = decodeURI(fragment.replace(pathStripper, ''));

                if (this.fragment === fragment)
                    return;
                this.fragment = fragment;

                // Don't include a trailing slash on the root.
                if (fragment === '' && url !== '/')
                    url = url.slice(0, -1);

                // If pushState is available, we use it to set the fragment as a real URL.
                if (this._hasPushState) {
                    this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

                    // If hash changes haven't been explicitly disabled, update the hash
                    // fragment to store history.
                } else if (this._wantsHashChange) {
                    this._updateHash(this.location, fragment, options.replace);
                    if (this.iframe && (fragment !== this.getHash(this.iframe))) {
                        // Opening and closing the iframe tricks IE7 and earlier to push a
                        // history entry on hash-tag change.  When replace is true, we don't
                        // want this.
                        if (!options.replace)
                            this.iframe.document.open().close();
                        this._updateHash(this.iframe.location, fragment, options.replace);
                    }

                    // If you've told us that you explicitly don't want fallback hashchange-
                    // based history, then `navigate` becomes a page refresh.
                } else {
                    return this.location.assign(url);
                }
                if (options.trigger)
                    return this.loadUrl(fragment);
            },

            // Update the hash location, either replacing the current entry, or adding
            // a new one to the browser history.
            _updateHash : function(location, fragment, replace) {
                if (replace) {
                    var href = location.href.replace(/(javascript:|#).*$/, '');
                    location.replace(href + '#' + fragment);
                } else {
                    // Some browsers require that `hash` contains a leading #.
                    location.hash = '#' + fragment;
                }
            }
        });

        // Create the default Backbone.history.
        Backbone.history = new History;

        // Helpers
        // -------

        // Helper function to correctly set up the prototype chain, for subclasses.
        // Similar to `goog.inherits`, but uses a hash of prototype properties and
        // class properties to be extended.
        var extend = function(protoProps, staticProps) {
            var parent = this;
            var child;

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && _.has(protoProps, 'constructor')) {
                child = protoProps.constructor;
            } else {
                child = function() {
                    return parent.apply(this, arguments);
                };
            }

            // Add static properties to the constructor function, if supplied.
            _.extend(child, parent, staticProps);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function() {
                this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps)
                _.extend(child.prototype, protoProps);

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype;

            return child;
        };

        // Set up inheritance for the model, collection, router, view and history.
        Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

        // Throw an error when a URL is needed, and none is supplied.
        var urlError = function() {
            throw new Error('A "url" property or function must be specified');
        };

        // Wrap an optional error callback with a fallback error event.
        var wrapError = function(model, options) {
            var error = options.error;
            options.error = function(resp) {
                if (error)
                    error(model, resp, options);
                model.trigger('error', model, resp, options);
            };
        };

        return Backbone;

    }));
;

// Backbone.Epoxy

// (c) 2015 Greg MacWilliam
// Freely distributed under the MIT license
// For usage and documentation:
// http://epoxyjs.org

( function(root, factory) {

        if ( typeof exports !== 'undefined') {
            // Define as CommonJS export:
            module.exports = factory(require("underscore"), require("backbone"));
        } else if ( typeof define === 'function' && define.amd) {
            // Define as AMD:
            define(["underscore", "backbone"], factory);
        } else {
            // Just run it:
            factory(root._, root.Backbone);
        }

    }(this, function(_, Backbone) {

        // Epoxy namespace:
        var Epoxy = Backbone.Epoxy = {};

        // Object-type utils:
        var array = Array.prototype;
        var isUndefined = _.isUndefined;
        var isFunction = _.isFunction;
        var isObject = _.isObject;
        var isArray = _.isArray;
        var isModel = function(obj) {
            return obj instanceof Backbone.Model;
        };
        var isCollection = function(obj) {
            return obj instanceof Backbone.Collection;
        };
        var blankMethod = function() {
        };

        // Static mixins API:
        // added as a static member to Epoxy class objects (Model & View);
        // generates a set of class attributes for mixin with other objects.
        var mixins = {
            mixin : function(extend) {
                extend = extend || {};

                for (var i in this.prototype) {
                    // Skip override on pre-defined binding declarations:
                    if (i === 'bindings' && extend.bindings)
                        continue;

                    // Assimilate non-constructor Epoxy prototype properties onto extended object:
                    if (this.prototype.hasOwnProperty(i) && i !== 'constructor') {
                        extend[i] = this.prototype[i];
                    }
                }
                return extend;
            }
        };

        // Calls method implementations of a super-class object:
        function _super(instance, method, args) {
            return instance._super.prototype[method].apply(instance, args);
        }

        // Epoxy.Model
        // -----------
        var modelMap;
        var modelProps = ['computeds'];

        Epoxy.Model = Backbone.Model.extend({
            _super : Backbone.Model,

            // Backbone.Model constructor override:
            // configures computed model attributes around the underlying native Backbone model.
            constructor : function(attributes, options) {
                _.extend(this, _.pick(options || {}, modelProps));
                _super(this, 'constructor', arguments);
                this.initComputeds(this.attributes, options);
            },

            // Gets a copy of a model attribute value:
            // Array and Object values will return a shallow copy,
            // primitive values will be returned directly.
            getCopy : function(attribute) {
                return _.clone(this.get(attribute));
            },

            // Backbone.Model.get() override:
            // provides access to computed attributes,
            // and maps computed dependency references while establishing bindings.
            get : function(attribute) {

                // Automatically register bindings while building out computed dependency graphs:
                modelMap && modelMap.push(['change:' + attribute, this]);

                // Return a computed property value, if available:
                if (this.hasComputed(attribute)) {
                    return this.c()[attribute].get();
                }

                // Default to native Backbone.Model get operation:
                return _super(this, 'get', arguments);
            },

            // Backbone.Model.set() override:
            // will process any computed attribute setters,
            // and then pass along all results to the underlying model.
            set : function(key, value, options) {
                var params = key;

                // Convert key/value arguments into {key:value} format:
                if (params && !isObject(params)) {
                    params = {};
                    params[key] = value;
                } else {
                    options = value;
                }

                // Default options definition:
                options = options || {};

                // Create store for capturing computed change events:
                var computedEvents = this._setting = [];

                // Attempt to set computed attributes while not unsetting:
                if (!options.unset) {
                    // All param properties are tested against computed setters,
                    // properties set to computeds will be removed from the params table.
                    // Optionally, an computed setter may return key/value pairs to be merged into the set.
                    params = deepModelSet(this, params, {}, []);
                }

                // Remove computed change events store:
                delete this._setting;

                // Pass all resulting set params along to the underlying Backbone Model.
                var result = _super(this, 'set', [params, options]);

                // Dispatch all outstanding computed events:
                if (!options.silent) {
                    // Make sure computeds get a "change" event:
                    if (!this.hasChanged() && computedEvents.length) {
                        this.trigger('change', this);
                    }

                    // Trigger each individual computed attribute change:
                    // NOTE: computeds now officially fire AFTER basic "change"...
                    // We can't really fire them earlier without duplicating the Backbone "set" method here.
                    _.each(computedEvents, function(evt) {
                        this.trigger.apply(this, evt);
                    }, this);
                }
                return result;
            },

            // Backbone.Model.toJSON() override:
            // adds a 'computed' option, specifying to include computed attributes.
            toJSON : function(options) {
                var json = _super(this, 'toJSON', arguments);

                if (options && options.computed) {
                    _.each(this.c(), function(computed, attribute) {
                        json[attribute] = computed.value;
                    });
                }

                return json;
            },

            // Backbone.Model.destroy() override:
            // clears all computed attributes before destroying.
            destroy : function() {
                this.clearComputeds();
                return _super(this, 'destroy', arguments);
            },

            // Computed namespace manager:
            // Allows the model to operate as a mixin.
            c : function() {
                return this._c || (this._c = {});
            },

            // Initializes the Epoxy model:
            // called automatically by the native constructor,
            // or may be called manually when adding Epoxy as a mixin.
            initComputeds : function(attributes, options) {
                this.clearComputeds();

                // Resolve computeds hash, and extend it with any preset attribute keys:
                // TODO: write test.
                var computeds = _.result(this, 'computeds') || {};
                computeds = _.extend(computeds, _.pick(attributes || {}, _.keys(computeds)));

                // Add all computed attributes:
                _.each(computeds, function(params, attribute) {
                    params._init = 1;
                    this.addComputed(attribute, params);
                }, this);

                // Initialize all computed attributes:
                // all presets have been constructed and may reference each other now.
                _.invoke(this.c(), 'init');
            },

            // Adds a computed attribute to the model:
            // computed attribute will assemble and return customized values.
            // @param attribute (string)
            // @param getter (function) OR params (object)
            // @param [setter (function)]
            // @param [dependencies ...]
            addComputed : function(attribute, getter, setter) {
                this.removeComputed(attribute);

                var params = getter;
                var delayInit = params._init;

                // Test if getter and/or setter are provided:
                if (isFunction(getter)) {
                    var depsIndex = 2;

                    // Add getter param:
                    params = {};
                    params._get = getter;

                    // Test for setter param:
                    if (isFunction(setter)) {
                        params._set = setter;
                        depsIndex++;
                    }

                    // Collect all additional arguments as dependency definitions:
                    params.deps = array.slice.call(arguments, depsIndex);
                }

                // Create a new computed attribute:
                this.c()[attribute] = new EpoxyComputedModel(this, attribute, params, delayInit);
                return this;
            },

            // Tests the model for a computed attribute definition:
            hasComputed : function(attribute) {
                return this.c().hasOwnProperty(attribute);
            },

            // Removes an computed attribute from the model:
            removeComputed : function(attribute) {
                if (this.hasComputed(attribute)) {
                    this.c()[attribute].dispose();
                    delete this.c()[attribute];
                }
                return this;
            },

            // Removes all computed attributes:
            clearComputeds : function() {
                for (var attribute in this.c()) {
                    this.removeComputed(attribute);
                }
                return this;
            },

            // Internal array value modifier:
            // performs array ops on a stored array value, then fires change.
            // No action is taken if the specified attribute value is not an array.
            modifyArray : function(attribute, method, options) {
                var obj = this.get(attribute);

                if (isArray(obj) && isFunction(array[method])) {
                    var args = array.slice.call(arguments, 2);
                    var result = array[method].apply(obj, args);
                    options = options || {};

                    if (!options.silent) {
                        this.trigger('change:' + attribute + ' change', this, array, options);
                    }
                    return result;
                }
                return null;
            },

            // Internal object value modifier:
            // sets new property values on a stored object value, then fires change.
            // No action is taken if the specified attribute value is not an object.
            modifyObject : function(attribute, property, value, options) {
                var obj = this.get(attribute);
                var change = false;

                // If property is Object:
                if (isObject(obj)) {

                    options = options || {};

                    // Delete existing property in response to undefined values:
                    if (isUndefined(value) && obj.hasOwnProperty(property)) {
                        delete obj[property];
                        change = true;
                    }
                    // Set new and/or changed property values:
                    else if (obj[property] !== value) {
                        obj[property] = value;
                        change = true;
                    }

                    // Trigger model change:
                    if (change && !options.silent) {
                        this.trigger('change:' + attribute + ' change', this, obj, options);
                    }

                    // Return the modified object:
                    return obj;
                }
                return null;
            }
        }, mixins);

        // Epoxy.Model -> Private
        // ----------------------

        // Model deep-setter:
        // Attempts to set a collection of key/value attribute pairs to computed attributes.
        // Observable setters may digest values, and then return mutated key/value pairs for inclusion into the set operation.
        // Values returned from computed setters will be recursively deep-set, allowing computeds to set other computeds.
        // The final collection of resolved key/value pairs (after setting all computeds) will be returned to the native model.
        // @param model: target Epoxy model on which to operate.
        // @param toSet: an object of key/value pairs to attempt to set within the computed model.
        // @param toReturn: resolved non-ovservable attribute values to be returned back to the native model.
        // @param trace: property stack trace (prevents circular setter loops).
        function deepModelSet(model, toSet, toReturn, stack) {

            // Loop through all setter properties:
            for (var attribute in toSet) {
                if (toSet.hasOwnProperty(attribute)) {

                    // Pull each setter value:
                    var value = toSet[attribute];

                    if (model.hasComputed(attribute)) {

                        // Has a computed attribute:
                        // comfirm attribute does not already exist within the stack trace.
                        if (!stack.length || !_.contains(stack, attribute)) {

                            // Non-recursive:
                            // set and collect value from computed attribute.
                            value = model.c()[attribute].set(value);

                            // Recursively set new values for a returned params object:
                            // creates a new copy of the stack trace for each new search branch.
                            if (value && isObject(value)) {
                                toReturn = deepModelSet(model, value, toReturn, stack.concat(attribute));
                            }

                        } else {
                            // Recursive:
                            // Throw circular reference error.
                            throw ('Recursive setter: ' + stack.join(' > '));
                        }

                    } else {
                        // No computed attribute:
                        // set the value to the keeper values.
                        toReturn[attribute] = value;
                    }
                }
            }

            return toReturn;
        }

        // Epoxy.Model -> Computed
        // -----------------------
        // Computed objects store model values independently from the model's attributes table.
        // Computeds define custom getter/setter functions to manage their value.

        function EpoxyComputedModel(model, name, params, delayInit) {
            params = params || {};

            // Rewrite getter param:
            if (params.get && isFunction(params.get)) {
                params._get = params.get;
            }

            // Rewrite setter param:
            if (params.set && isFunction(params.set)) {
                params._set = params.set;
            }

            // Prohibit override of 'get()' and 'set()', then extend:
            delete params.get;
            delete params.set;
            _.extend(this, params);

            // Set model, name, and default dependencies array:
            this.model = model;
            this.name = name;
            this.deps = this.deps || [];

            // Skip init while parent model is initializing:
            // Model will initialize in two passes...
            // the first pass sets up all computed attributes,
            // then the second pass initializes all bindings.
            if (!delayInit)
                this.init();
        }


        _.extend(EpoxyComputedModel.prototype, Backbone.Events, {

            // Initializes the computed's value and bindings:
            // this method is called independently from the object constructor,
            // allowing computeds to build and initialize in two passes by the parent model.
            init : function() {

                // Configure dependency map, then update the computed's value:
                // All Epoxy.Model attributes accessed while getting the initial value
                // will automatically register themselves within the model bindings map.
                var bindings = {};
                var deps = modelMap = [];
                this.get(true);
                modelMap = null;

                // If the computed has dependencies, then proceed to binding it:
                if (deps.length) {

                    // Compile normalized bindings table:
                    // Ultimately, we want a table of event types, each with an array of their associated targets:
                    // {'change:name':[<model1>], 'change:status':[<model1>,<model2>]}

                    // Compile normalized bindings map:
                    _.each(deps, function(value) {
                        var attribute = value[0];
                        var target = value[1];

                        // Populate event target arrays:
                        if (!bindings[attribute]) {
                            bindings[attribute] = [target];

                        } else if (!_.contains(bindings[attribute], target)) {
                            bindings[attribute].push(target);
                        }
                    });

                    // Bind all event declarations to their respective targets:
                    _.each(bindings, function(targets, binding) {
                        for (var i = 0,
                            len = targets.length; i < len; i++) {
                            this.listenTo(targets[i], binding, _.bind(this.get, this, true));
                        }
                    }, this);
                }
            },

            // Gets an attribute value from the parent model.
            val : function(attribute) {
                return this.model.get(attribute);
            },

            // Gets the computed's current value:
            // Computed values flagged as dirty will need to regenerate themselves.
            // Note: 'update' is strongly checked as TRUE to prevent unintended arguments (handler events, etc) from qualifying.
            get : function(update) {
                if (update === true && this._get) {
                    var val = this._get.apply(this.model, _.map(this.deps, this.val, this));
                    this.change(val);
                }
                return this.value;
            },

            // Sets the computed's current value:
            // computed values (have a custom getter method) require a custom setter.
            // Custom setters should return an object of key/values pairs;
            // key/value pairs returned to the parent model will be merged into its main .set() operation.
            set : function(val) {
                if (this._get) {
                    if (this._set)
                        return this._set.apply(this.model, arguments);
                    else
                        throw ('Cannot set read-only computed attribute.');
                }
                this.change(val);
                return null;
            },

            // Changes the computed's value:
            // new values are cached, then fire an update event.
            change : function(value) {
                if (!_.isEqual(value, this.value)) {
                    this.value = value;
                    var evt = ['change:' + this.name, this.model, value];

                    if (this.model._setting) {
                        this.model._setting.push(evt);
                    } else {
                        evt[0] += ' change';
                        this.model.trigger.apply(this.model, evt);
                    }
                }
            },

            // Disposal:
            // cleans up events and releases references.
            dispose : function() {
                this.stopListening();
                this.off();
                this.model = this.value = null;
            }
        });

        // Epoxy.binding -> Binding API
        // ----------------------------

        var bindingSettings = {
            optionText : 'label',
            optionValue : 'value'
        };

        // Cache for storing binding parser functions:
        // Cuts down on redundancy when building repetitive binding views.
        var bindingCache = {};

        // Reads value from an accessor:
        // Accessors come in three potential forms:
        // => A function to call for the requested value.
        // => An object with a collection of attribute accessors.
        // => A primitive (string, number, boolean, etc).
        // This function unpacks an accessor and returns its underlying value(s).

        function readAccessor(accessor) {

            if (isFunction(accessor)) {
                // Accessor is function: return invoked value.
                return accessor();
            } else if (isObject(accessor)) {
                // Accessor is object/array: return copy with all attributes read.
                accessor = _.clone(accessor);

                _.each(accessor, function(value, key) {
                    accessor[key] = readAccessor(value);
                });
            }
            // return formatted value, or pass through primitives:
            return accessor;
        }

        // Binding Handlers
        // ----------------
        // Handlers define set/get methods for exchanging data with the DOM.

        // Formatting function for defining new handler objects:
        function makeHandler(handler) {
            return isFunction(handler) ? {
                set : handler
            } : handler;
        }

        var bindingHandlers = {
            // Attribute: write-only. Sets element attributes.
            attr : makeHandler(function($element, value) {
                $element.attr(value);
            }),

            // Checked: read-write. Toggles the checked status of a form element.
            checked : makeHandler({
                get : function($element, currentValue, evt) {
                    if ($element.length > 1) {
                        $element = $element.filter(evt.target);
                    }

                    var checked = !!$element.prop('checked');
                    var value = $element.val();

                    if (this.isRadio($element)) {
                        // Radio button: return value directly.
                        return value;

                    } else if (isArray(currentValue)) {
                        // Checkbox array: add/remove value from list.
                        currentValue = currentValue.slice();
                        var index = _.indexOf(currentValue, value);

                        if (checked && index < 0) {
                            currentValue.push(value);
                        } else if (!checked && index > -1) {
                            currentValue.splice(index, 1);
                        }
                        return currentValue;
                    }
                    // Checkbox: return boolean toggle.
                    return checked;
                },
                set : function($element, value) {
                    if ($element.length > 1) {
                        $element = $element.filter('[value="' + value + '"]');
                    }

                    // Default as loosely-typed boolean:
                    var checked = !!value;

                    if (this.isRadio($element)) {
                        // Radio button: match checked state to radio value.
                        checked = (value == $element.val());

                    } else if (isArray(value)) {
                        // Checkbox array: match checked state to checkbox value in array contents.
                        checked = _.contains(value, $element.val());
                    }

                    // Set checked property to element:
                    $element.prop('checked', checked);
                },
                // Is radio button: avoids '.is(":radio");' check for basic Zepto compatibility.
                isRadio : function($element) {
                    return $element.attr('type').toLowerCase() === 'radio';
                }
            }),

            // Class Name: write-only. Toggles a collection of class name definitions.
            classes : makeHandler(function($element, value) {
                _.each(value, function(enabled, className) {
                    $element.toggleClass(className, !!enabled);
                });
            }),

            // Collection: write-only. Manages a list of views bound to a Backbone.Collection.
            collection : makeHandler({
                init : function($element, collection, context, bindings) {
                    this.i = bindings.itemView ? this.view[bindings.itemView] : this.view.itemView;
                    if (!isCollection(collection))
                        throw ('Binding "collection" requires a Collection.');
                    if (!isFunction(this.i))
                        throw ('Binding "collection" requires an itemView.');
                    this.v = {};
                },
                set : function($element, collection, target) {

                    var view;
                    var views = this.v;
                    var ItemView = this.i;
                    var models = collection.models;

                    // Cache and reset the current dependency graph state:
                    // sub-views may be created (each with their own dependency graph),
                    // therefore we need to suspend the working graph map here before making children...
                    var mapCache = viewMap;
                    viewMap = null;

                    // Default target to the bound collection object:
                    // during init (or failure), the binding will reset.
                    target = target || collection;

                    if (isModel(target)) {

                        // ADD/REMOVE Event (from a Model):
                        // test if view exists within the binding...
                        if (!views.hasOwnProperty(target.cid)) {

                            // Add new view:
                            views[target.cid] = view = new ItemView({
                                model : target,
                                collectionView : this.view
                            });
                            var index = _.indexOf(models, target);
                            var $children = $element.children();

                            // Attempt to add at proper index,
                            // otherwise just append into the element.
                            if (index < $children.length) {
                                $children.eq(index).before(view.$el);
                            } else {
                                $element.append(view.$el);
                            }

                        } else {

                            // Remove existing view:
                            views[target.cid].remove();
                            delete views[target.cid];
                        }

                    } else if (isCollection(target)) {

                        // SORT/RESET Event (from a Collection):
                        // First test if we're sorting...
                        // (number of models has not changed and all their views are present)
                        var sort = models.length === _.size(views) && collection.every(function(model) {
                            return views.hasOwnProperty(model.cid);
                        });

                        // Hide element before manipulating:
                        $element.children().detach();
                        var frag = document.createDocumentFragment();

                        if (sort) {
                            // Sort existing views:
                            collection.each(function(model) {
                                frag.appendChild(views[model.cid].el);
                            });

                        } else {
                            // Reset with new views:
                            this.clean();
                            collection.each(function(model) {
                                views[model.cid] = view = new ItemView({
                                    model : model,
                                    collectionView : this.view
                                });
                                frag.appendChild(view.el);
                            }, this);
                        }

                        $element.append(frag);
                    }

                    // Restore cached dependency graph configuration:
                    viewMap = mapCache;
                },
                clean : function() {
                    for (var id in this.v) {
                        if (this.v.hasOwnProperty(id)) {
                            this.v[id].remove();
                            delete this.v[id];
                        }
                    }
                }
            }),

            // CSS: write-only. Sets a collection of CSS styles to an element.
            css : makeHandler(function($element, value) {
                $element.css(value);
            }),

            // Disabled: write-only. Sets the 'disabled' status of a form element (true :: disabled).
            disabled : makeHandler(function($element, value) {
                $element.prop('disabled', !!value);
            }),

            // Enabled: write-only. Sets the 'disabled' status of a form element (true :: !disabled).
            enabled : makeHandler(function($element, value) {
                $element.prop('disabled', !value);
            }),

            // HTML: write-only. Sets the inner HTML value of an element.
            html : makeHandler(function($element, value) {
                $element.html(value);
            }),

            // Options: write-only. Sets option items to a <select> element, then updates the value.
            options : makeHandler({
                init : function($element, value, context, bindings) {
                    this.e = bindings.optionsEmpty;
                    this.d = bindings.optionsDefault;
                    this.v = bindings.value;
                },
                set : function($element, value) {

                    // Pre-compile empty and default option values:
                    // both values MUST be accessed, for two reasons:
                    // 1) we need to need to guarentee that both values are reached for mapping purposes.
                    // 2) we'll need their values anyway to determine their defined/undefined status.
                    var self = this;
                    var optionsEmpty = readAccessor(self.e);
                    var optionsDefault = readAccessor(self.d);
                    var currentValue = readAccessor(self.v);
                    var options = isCollection(value) ? value.models : value;
                    var numOptions = options.length;
                    var enabled = true;
                    var html = '';

                    // No options or default, and has an empty options placeholder:
                    // display placeholder and disable select menu.
                    if (!numOptions && !optionsDefault && optionsEmpty) {

                        html += self.opt(optionsEmpty, numOptions);
                        enabled = false;

                    } else {
                        // Try to populate default option and options list:

                        // Configure list with a default first option, if defined:
                        if (optionsDefault) {
                            options = [optionsDefault].concat(options);
                        }

                        // Create all option items:
                        _.each(options, function(option, index) {
                            html += self.opt(option, numOptions);
                        });
                    }
                    // Set new HTML to the element and toggle disabled status:
                    $element.html(html).prop('disabled', !enabled).val(currentValue);

                    // Forcibly set default selection:
                    if ($element[0].selectedIndex < 0 && $element.children().length) {
                        $element[0].selectedIndex = 0;
                    }

                    // Pull revised value with new options selection state:
                    var revisedValue = $element.val();

                    // Test if the current value was successfully applied:
                    // if not, set the new selection state into the model.
                    if (self.v && !_.isEqual(currentValue, revisedValue)) {
                        self.v(revisedValue);
                    }
                },
                opt : function(option, numOptions) {
                    // Set both label and value as the raw option object by default:
                    var label = option;
                    var value = option;
                    var textAttr = bindingSettings.optionText;
                    var valueAttr = bindingSettings.optionValue;

                    // Dig deeper into label/value settings for non-primitive values:
                    if (isObject(option)) {
                        // Extract a label and value from each object:
                        // a model's 'get' method is used to access potential computed values.
                        label = isModel(option) ? option.get(textAttr) : option[textAttr];
                        value = isModel(option) ? option.get(valueAttr) : option[valueAttr];
                    }

                    return ['<option value="', value, '">', label, '</option>'].join('');
                },
                clean : function() {
                    this.d = this.e = this.v = 0;
                }
            }),

            // Template: write-only. Renders the bound element with an Underscore template.
            template : makeHandler({
                init : function($element, value, context) {
                    var raw = $element.find('script,template');
                    this.t = _.template(raw.length ? raw.html() : $element.html());

                    // If an array of template attributes was provided,
                    // then replace array with a compiled hash of attribute accessors:
                    if (isArray(value)) {
                        return _.pick(context, value);
                    }
                },
                set : function($element, value) {
                    value = isModel(value) ? value.toJSON({
                        computed : true
                    }) : value;
                    $element.html(this.t(value));
                },
                clean : function() {
                    this.t = null;
                }
            }),

            // Text: read-write. Gets and sets the text value of an element.
            text : makeHandler({
                get : function($element) {
                    return $element.text();
                },
                set : function($element, value) {
                    $element.text(value);
                }
            }),

            // Toggle: write-only. Toggles the visibility of an element.
            toggle : makeHandler(function($element, value) {
                $element.toggle(!!value);
            }),

            // Value: read-write. Gets and sets the value of a form element.
            value : makeHandler({
                get : function($element) {
                    return $element.val();
                },
                set : function($element, value) {
                    try {
                        if ($element.val() + '' != value + '')
                            $element.val(value);
                    } catch (error) {
                        // Error setting value: IGNORE.
                        // This occurs in IE6 while attempting to set an undefined multi-select option.
                        // unfortuantely, jQuery doesn't gracefully handle this error for us.
                        // remove this try/catch block when IE6 is officially deprecated.
                    }
                }
            })
        };

        // Binding Filters
        // ---------------
        // Filters are special binding handlers that may be invoked while binding;
        // they will return a wrapper function used to modify how accessors are read.

        // Partial application wrapper for creating binding filters:
        function makeFilter(handler) {
            return function() {
                var params = arguments;
                var read = isFunction(handler) ? handler : handler.get;
                var write = handler.set;
                return function(value) {
                    return isUndefined(value) ? read.apply(this, _.map(params, readAccessor)) : params[0](( write ? write : read).call(this, value));
                };
            };
        }

        var bindingFilters = {
            // Positive collection assessment [read-only]:
            // Tests if all of the provided accessors are truthy (and).
            all : makeFilter(function() {
                var params = arguments;
                for (var i = 0,
                    len = params.length; i < len; i++) {
                    if (!params[i])
                        return false;
                }
                return true;
            }),

            // Partial collection assessment [read-only]:
            // tests if any of the provided accessors are truthy (or).
            any : makeFilter(function() {
                var params = arguments;
                for (var i = 0,
                    len = params.length; i < len; i++) {
                    if (params[i])
                        return true;
                }
                return false;
            }),

            // Collection length accessor [read-only]:
            // assumes accessor value to be an Array or Collection; defaults to 0.
            length : makeFilter(function(value) {
                return value.length || 0;
            }),

            // Negative collection assessment [read-only]:
            // tests if none of the provided accessors are truthy (and not).
            none : makeFilter(function() {
                var params = arguments;
                for (var i = 0,
                    len = params.length; i < len; i++) {
                    if (params[i])
                        return false;
                }
                return true;
            }),

            // Negation [read-only]:
            not : makeFilter(function(value) {
                return !value;
            }),

            // Formats one or more accessors into a text string:
            // ('$1 $2 did $3', firstName, lastName, action)
            format : makeFilter(function(str) {
                var params = arguments;

                for (var i = 1,
                    len = params.length; i < len; i++) {
                    // TODO: need to make something like this work: (?<!\\)\$1
                    str = str.replace(new RegExp('\\$' + i, 'g'), params[i]);
                }
                return str;
            }),

            // Provides one of two values based on a ternary condition:
            // uses first param (a) as condition, and returns either b (truthy) or c (falsey).
            select : makeFilter(function(condition, truthy, falsey) {
                return condition ? truthy : falsey;
            }),

            // CSV array formatting [read-write]:
            csv : makeFilter({
                get : function(value) {
                    value = String(value);
                    return value ? value.split(',') : [];
                },
                set : function(value) {
                    return isArray(value) ? value.join(',') : value;
                }
            }),

            // Integer formatting [read-write]:
            integer : makeFilter(function(value) {
                return value ? parseInt(value, 10) : 0;
            }),

            // Float formatting [read-write]:
            decimal : makeFilter(function(value) {
                return value ? parseFloat(value) : 0;
            })
        };

        // Define allowed binding parameters:
        // These params may be included in binding handlers without throwing errors.
        var allowedParams = {
            events : 1,
            itemView : 1,
            optionsDefault : 1,
            optionsEmpty : 1
        };

        // Define binding API:
        Epoxy.binding = {
            allowedParams : allowedParams,
            addHandler : function(name, handler) {
                bindingHandlers[name] = makeHandler(handler);
            },
            addFilter : function(name, handler) {
                bindingFilters[name] = makeFilter(handler);
            },
            config : function(settings) {
                _.extend(bindingSettings, settings);
            },
            emptyCache : function() {
                bindingCache = {};
            }
        };

        // Epoxy.View
        // ----------
        var viewMap;
        var viewProps = ['viewModel', 'bindings', 'bindingFilters', 'bindingHandlers', 'bindingSources', 'computeds'];

        Epoxy.View = Backbone.View.extend({
            _super : Backbone.View,

            // Backbone.View constructor override:
            // sets up binding controls around call to super.
            constructor : function(options) {
                _.extend(this, _.pick(options || {}, viewProps));
                _super(this, 'constructor', arguments);
                this.applyBindings();
            },

            // Bindings list accessor:
            b : function() {
                return this._b || (this._b = []);
            },

            // Bindings definition:
            // this setting defines a DOM attribute name used to query for bindings.
            // Alternatively, this be replaced with a hash table of key/value pairs,
            // where 'key' is a DOM query and 'value' is its binding declaration.
            bindings : 'data-bind',

            // Setter options:
            // Defines an optional hashtable of options to be passed to setter operations.
            // Accepts a custom option '{save:true}' that will write to the model via ".save()".
            setterOptions : null,

            // Compiles a model context, then applies bindings to the view:
            // All Model->View relationships will be baked at the time of applying bindings;
            // changes in configuration to source attributes or view bindings will require a complete re-bind.
            applyBindings : function() {
                this.removeBindings();

                var self = this;
                var sources = _.clone(_.result(self, 'bindingSources'));
                var declarations = self.bindings;
                var options = self.setterOptions;
                var handlers = _.clone(bindingHandlers);
                var filters = _.clone(bindingFilters);
                var context = self._c = {};

                // Compile a complete set of binding handlers for the view:
                // mixes all custom handlers into a copy of default handlers.
                // Custom handlers defined as plain functions are registered as read-only setters.
                _.each(_.result(self, 'bindingHandlers') || {}, function(handler, name) {
                    handlers[name] = makeHandler(handler);
                });

                // Compile a complete set of binding filters for the view:
                // mixes all custom filters into a copy of default filters.
                _.each(_.result(self, 'bindingFilters') || {}, function(filter, name) {
                    filters[name] = makeFilter(filter);
                });

                // Add native 'model' and 'collection' data sources:
                self.model = addSourceToViewContext(self, context, options, 'model');
                self.viewModel = addSourceToViewContext(self, context, options, 'viewModel');
                self.collection = addSourceToViewContext(self, context, options, 'collection');

                // Support legacy "collection.view" API for rendering list items:
                // **Deprecated: will be removed after next release*.*
                if (self.collection && self.collection.view) {
                    self.itemView = self.collection.view;
                }

                // Add all additional data sources:
                if (sources) {
                    _.each(sources, function(source, sourceName) {
                        sources[sourceName] = addSourceToViewContext(sources, context, options, sourceName, sourceName);
                    });

                    // Reapply resulting sources to view instance.
                    self.bindingSources = sources;
                }

                // Add all computed view properties:
                _.each(_.result(self, 'computeds') || {}, function(computed, name) {
                    var getter = isFunction(computed) ? computed : computed.get;
                    var setter = computed.set;
                    var deps = computed.deps;

                    context[name] = function(value) {
                        return (!isUndefined(value) && setter) ? setter.call(self, value) : getter.apply(self, getDepsFromViewContext(self._c, deps));
                    };
                });

                // Create all bindings:
                // bindings are created from an object hash of query/binding declarations,
                // OR based on queried DOM attributes.
                if (isObject(declarations)) {

                    // Object declaration method:
                    // {'span.my-element': 'text:attribute'}

                    _.each(declarations, function(elementDecs, selector) {
                        // Get DOM jQuery reference:
                        var $element = queryViewForSelector(self, selector);

                        // flattern object notated binding declaration
                        if (isObject(elementDecs)) {
                            elementDecs = flattenBindingDeclaration(elementDecs);
                        }

                        // Ignore empty DOM queries (without errors):
                        if ($element.length) {
                            bindElementToView(self, $element, elementDecs, context, handlers, filters);
                        }
                    });

                } else {

                    // DOM attributes declaration method:
                    // <span data-bind='text:attribute'></span>

                    // Create bindings for each matched element:
                    queryViewForSelector(self, '[' + declarations + ']').each(function() {
                        var $element = Backbone.$(this);
                        bindElementToView(self, $element, $element.attr(declarations), context, handlers, filters);
                    });
                }
            },

            // Gets a value from the binding context:
            getBinding : function(attribute) {
                return accessViewContext(this._c, attribute);
            },

            // Sets a value to the binding context:
            setBinding : function(attribute, value) {
                return accessViewContext(this._c, attribute, value);
            },

            // Disposes of all view bindings:
            removeBindings : function() {
                this._c = null;

                if (this._b) {
                    while (this._b.length) {
                        this._b.pop().dispose();
                    }
                }
            },

            // Backbone.View.remove() override:
            // unbinds the view before performing native removal tasks.
            remove : function() {
                this.removeBindings();
                _super(this, 'remove', arguments);
            }
        }, mixins);

        // Epoxy.View -> Private
        // ---------------------

        // Adds a data source to a view:
        // Data sources are Backbone.Model and Backbone.Collection instances.
        // @param source: a source instance, or a function that returns a source.
        // @param context: the working binding context. All bindings in a view share a context.
        function addSourceToViewContext(source, context, options, name, prefix) {

            // Resolve source instance:
            source = _.result(source, name);

            // Ignore missing sources, and invoke non-instances:
            if (!source)
                return;

            // Add Backbone.Model source instance:
            if (isModel(source)) {

                // Establish source prefix:
                prefix = prefix ? prefix + '_' : '';

                // Create a read-only accessor for the model instance:
                context['$' + name] = function() {
                    viewMap && viewMap.push([source, 'change']);
                    return source;
                };

                // Compile all model attributes as accessors within the context:
                var modelAttributes = _.extend({}, source.attributes, _.isFunction(source.c) ? source.c() : {});
                _.each(modelAttributes, function(value, attribute) {

                    // Create named accessor functions:
                    // -> Attributes from 'view.model' use their normal names.
                    // -> Attributes from additional sources are named as 'source_attribute'.
                    context[prefix + attribute] = function(value) {
                        return accessViewDataAttribute(source, attribute, value, options);
                    };
                });
            }
            // Add Backbone.Collection source instance:
            else if (isCollection(source)) {

                // Create a read-only accessor for the collection instance:
                context['$' + name] = function() {
                    viewMap && viewMap.push([source, 'reset add remove sort update']);
                    return source;
                };
            }

            // Return original object, or newly constructed data source:
            return source;
        }

        // Attribute data accessor:
        // exchanges individual attribute values with model sources.
        // This function is separated out from the accessor creation process for performance.
        // @param source: the model data source to interact with.
        // @param attribute: the model attribute to read/write.
        // @param value: the value to set, or 'undefined' to get the current value.
        function accessViewDataAttribute(source, attribute, value, options) {
            // Register the attribute to the bindings map, if enabled:
            viewMap && viewMap.push([source, 'change:' + attribute]);

            // Set attribute value when accessor is invoked with an argument:
            if (!isUndefined(value)) {

                // Set Object (non-null, non-array) hashtable value:
                if (!isObject(value) || isArray(value) || _.isDate(value)) {
                    var val = value;
                    value = {};
                    value[attribute] = val;
                }

                // Set value:
                return options && options.save ? source.save(value, options) : source.set(value, options);
            }

            // Get the attribute value by default:
            return source.get(attribute);
        }

        // Queries element selectors within a view:
        // matches elements within the view, and the view's container element.
        function queryViewForSelector(view, selector) {
            if (selector === ':el' || selector === ':scope')
                return view.$el;
            var $elements = view.$(selector);

            // Include top-level view in bindings search:
            if (view.$el.is(selector)) {
                $elements = $elements.add(view.$el);
            }

            return $elements;
        }

        // Binds an element into a view:
        // The element's declarations are parsed, then a binding is created for each declared handler.
        // @param view: the parent View to bind into.
        // @param $element: the target element (as jQuery) to bind.
        // @param declarations: the string of binding declarations provided for the element.
        // @param context: a compiled binding context with all availabe view data.
        // @param handlers: a compiled handlers table with all native/custom handlers.
        function bindElementToView(view, $element, declarations, context, handlers, filters) {

            // Parse localized binding context:
            // parsing function is invoked with 'filters' and 'context' properties made available,
            // yeilds a native context object with element-specific bindings defined.
            try {
                var parserFunct = bindingCache[declarations] || (bindingCache[declarations] = new Function('$f', '$c', 'with($f){with($c){return{' + declarations + '}}}'));
                var bindings = parserFunct(filters, context);
            } catch (error) {
                throw ('Error parsing bindings: "' + declarations + '"\n>> ' + error);
            }

            // Format the 'events' option:
            // include events from the binding declaration along with a default 'change' trigger,
            // then format all event names with a '.epoxy' namespace.
            var events = _.map(_.union(bindings.events || [], ['change']), function(name) {
                return name + '.epoxy';
            }).join(' ');

            // Apply bindings from native context:
            _.each(bindings, function(accessor, handlerName) {

                // Validate that each defined handler method exists before binding:
                if (handlers.hasOwnProperty(handlerName)) {
                    // Create and add binding to the view's list of handlers:
                    view.b().push(new EpoxyBinding(view, $element, handlers[handlerName], accessor, events, context, bindings));
                } else if (!allowedParams.hasOwnProperty(handlerName)) {
                    throw ('binding handler "' + handlerName + '" is not defined.');
                }
            });
        }

        // Gets and sets view context data attributes:
        // used by the implementations of "getBinding" and "setBinding".
        function accessViewContext(context, attribute, value) {
            if (context && context.hasOwnProperty(attribute)) {
                return isUndefined(value) ? readAccessor(context[attribute]) : context[attribute](value);
            }
        }

        // Accesses an array of dependency properties from a view context:
        // used for mapping view dependencies by manual declaration.
        function getDepsFromViewContext(context, attributes) {
            var values = [];
            if (attributes && context) {
                for (var i = 0,
                    len = attributes.length; i < len; i++) {
                    values.push(attributes[i] in context ? context[ attributes[i] ]() : null);
                }
            }
            return values;
        }

        var identifierRegex = /^[a-z_$][a-z0-9_$]*$/i;
        var quotedStringRegex = /^\s*(["']).*\1\s*$/;

        // Converts a binding declaration object into a flattened string.
        // Input: {text: 'firstName', attr: {title: '"hello"'}}
        // Output: 'text:firstName,attr:{title:"hello"}'
        function flattenBindingDeclaration(declaration) {
            var result = [];

            for (var key in declaration) {
                var value = declaration[key];

                if (isObject(value)) {
                    value = '{' + flattenBindingDeclaration(value) + '}';
                }

                // non-identifier keys that aren't already quoted need to be quoted
                if (!identifierRegex.test(key) && !quotedStringRegex.test(key)) {
                    key = '"' + key + '"';
                }

                result.push(key + ':' + value);
            }

            return result.join(',');
        }

        // Epoxy.View -> Binding
        // ---------------------
        // The binding object connects an element to a bound handler.
        // @param view: the view object this binding is attached to.
        // @param $element: the target element (as jQuery) to bind.
        // @param handler: the handler object to apply (include all handler methods).
        // @param accessor: an accessor method from the binding context that exchanges data with the model.
        // @param events:
        // @param context:
        // @param bindings:
        function EpoxyBinding(view, $element, handler, accessor, events, context, bindings) {

            var self = this;
            var tag = ($element[0].tagName).toLowerCase();
            var changable = (tag == 'input' || tag == 'select' || tag == 'textarea' || $element.prop('contenteditable') == 'true');
            var triggers = [];
            var reset = function(target) {
                self.$el && self.set(self.$el, readAccessor(accessor), target);
            };

            self.view = view;
            self.$el = $element;
            self.evt = events;
            _.extend(self, handler);

            // Initialize the binding:
            // allow the initializer to redefine/modify the attribute accessor if needed.
            accessor = self.init(self.$el, readAccessor(accessor), context, bindings) || accessor;

            // Set default binding, then initialize & map bindings:
            // each binding handler is invoked to populate its initial value.
            // While running a handler, all accessed attributes will be added to the handler's dependency map.
            viewMap = triggers;
            reset();
            viewMap = null;

            // Configure READ/GET-able binding. Requires:
            // => Form element.
            // => Binding handler has a getter method.
            // => Value accessor is a function.
            if (changable && handler.get && isFunction(accessor)) {
                self.$el.on(events, function(evt) {
                    accessor(self.get(self.$el, readAccessor(accessor), evt));
                });
            }

            // Configure WRITE/SET-able binding. Requires:
            // => One or more events triggers.
            if (triggers.length) {
                for (var i = 0,
                    len = triggers.length; i < len; i++) {
                    self.listenTo(triggers[i][0], triggers[i][1], reset);
                }
            }
        }


        _.extend(EpoxyBinding.prototype, Backbone.Events, {

            // Pass-through binding methods:
            // for override by actual implementations.
            init : blankMethod,
            get : blankMethod,
            set : blankMethod,
            clean : blankMethod,

            // Destroys the binding:
            // all events and managed sub-views are killed.
            dispose : function() {
                this.clean();
                this.stopListening();
                this.$el.off(this.evt);
                this.$el = this.view = null;
            }
        });

        return Epoxy;
    }));
(function() {
    'use strict';
    var Service = Backbone.Service = function(options) {
        options || ( options = {});
        this.cid = _.uniqueId('service');
        //if (options.ajaxCall)
        _.extend(this, options);
        this.ajaxCall = options.ajaxCall;
        this.initialize.apply(this, arguments);
    };
    _.extend(Service.prototype, Backbone.Events, {
        /**
         *获取请求锁
         * @param {Object} string
         */
        lock : {},
        initialize : function() {
        },
        getLockKey : function(string) {
            if (string) {
                //有option对象，把它变成字符串
                string = encodeURI(string);
                //有时候string可能有特殊字符，所以变化转换下，避免md5异常
                var md5 = appcan.crypto.md5(string);
                return md5;
            }
        },
        /**
         *封装的请求，可以写入header等通用的信息
         * @param {Object} data
         * @param {Object} options
         */
        _wrap : function(data, options, lockKey) {
            var self = this;
            var success = options.success;
            options.success = function(data) {
                delete self.lock[lockKey];
                if (success)
                    success(data);
            }
            var error = options.error;
            options.error = function(data) {
                delete self.lock[lockKey];
                if (error)
                    error(data);
            }
        },
        request : function(data, options) {
            var self = this;
            var lockKey = self.getLockKey(JSON.stringify(data));
            self._wrap(data, options, lockKey);
            if (self.lock[lockKey]) {
                //如果锁定请求的话，不再提交
                self.trigger("error", "Request alreay running. Please wait");
                options.error({
                    status : -100000,
                    msg : "Request alreay running. Please wait"
                });
                return;
            }
            //加请求锁
            self.lock[lockKey] = true;
            if (this.ajaxCall)
                this.ajaxCall(data, options);
        }
    });
    Service.extend = Backbone.Model.extend;
})();
var MVVM = {
    ViewModel : Backbone.Epoxy.View,
    Model : Backbone.Epoxy.Model,
    Collection : Backbone.Collection,
    Service : Backbone.Service,
    Binding : Backbone.Epoxy.binding
}; 