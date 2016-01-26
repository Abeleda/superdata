(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var createProxy = require("../../../src/proxy/rest");
var createModel = require("../../../src/model/model");
var createStore = require("../../../src/store/store");

var proxy = createProxy({
	idProperty: "id",
	route: "/user"
});
var model = createModel({
	fields: {
		id: {
			type: "number"
		},
		email: {
			type: "string"
		},
		name: {
			type: "string"
		},
		title: {
			type: "string"
		}
	},
	proxy: proxy
});
var store = createStore({
	model: model
});

//*
//seed
//atom
var seed = true;
function handleResponse(err, result) {
	//console.log(err, result);
}
if (seed) {
	var names = ["Bob", "Rob", "Olga", "Helga"];
	var titles = ["CEO", "CTO", "Slave"];
	for (var idx = 0; idx < 100; idx += 1) {
		var actName = names[idx % 4];
		store.add({
			id: idx,
			email: actName.toLowerCase() + "_" + idx + "@supercorp.com",
			name: actName,
			title: titles[idx % 3]
		}, handleResponse);
	}
}
//*/


var createInfiniteLoader = require("../../../src/ko-components/lists/infiniteList.js");
var createPagedList = require("../../../src/ko-components/lists/pagedList.js");


/*
var list = createInfiniteLoader({
	store: store,

	fields: ["id", "email", "name", "title"],

	labels: {
		email: "E-mail",
		name: "Név",
		title: "Beosztás"
	},

	sorters: {
		id: 1,
		email: 0,
		name: 0
	},

	numOfItems: 10,
	numOfItemsToLoad: 10
});
//*/

///*
var list = createPagedList({
	store: store,

	fields: ["id", "email", "name", "title"],

	labels: {
		email: "E-mail",
		name: "Name",
		title: "Very title"
	},

	sorters: {
		id: 1,
		email: 0
	},

	pagination: {
		currentPage: 0,
		itemsPerPage: 5,

		afterHead: 1,
		beforeTail: 1,
		afterCurrent: 1,
		beforeCurrent: 1
	}
});
//*/




ko.applyBindings(list);


},{"../../../src/ko-components/lists/infiniteList.js":5,"../../../src/ko-components/lists/pagedList.js":7,"../../../src/model/model":11,"../../../src/proxy/rest":14,"../../../src/store/store":15}],2:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],3:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],4:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  root = this;
}

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pushEncodedKeyValuePair(pairs, key, obj[key]);
        }
      }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (Array.isArray(val)) {
    return val.forEach(function(v) {
      pushEncodedKeyValuePair(pairs, key, v);
    });
  }
  pairs.push(encodeURIComponent(key)
    + '=' + encodeURIComponent(val));
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = this.statusCode = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
      return self.callback(err);
    }

    self.emit('response', res);

    if (err) {
      return self.callback(err, res);
    }

    if (res.status >= 200 && res.status < 300) {
      return self.callback(err, res);
    }

    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
    new_err.original = err;
    new_err.response = res;
    new_err.status = res.status;

    self.callback(new_err, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Force given parser
 *
 * Sets the body parser no matter type.
 *
 * @param {Function}
 * @api public
 */

Request.prototype.parse = function(fn){
  this._parser = fn;
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.field = function(name, val){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(name, val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(field, file, filename);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || isHost(data)) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self.timeoutError();
      if (self.aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(e){
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    xhr.onprogress = handleProgress;
  }
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = handleProgress;
    }
  } catch(e) {
    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
    // Reported here:
    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var contentType = this.getHeader('Content-Type');
    var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * Faux promise support
 *
 * @param {Function} fulfill
 * @param {Function} reject
 * @return {Request}
 */

Request.prototype.then = function (fulfill, reject) {
  return this.end(function(err, res) {
    err ? reject(err) : fulfill(res);
  });
}

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

function del(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

request.del = del;
request.delete = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":2,"reduce":3}],5:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var createList = require("./list");

module.exports = function createInfiniteList(config) {
	var store = config.store;
	var originalNumOfItems = config.numOfItems || 10;
	var numOfItems = originalNumOfItems;
	var numOfItemsToLoad = config.numOfItemsToLoad || 10;
	var skip = 0;


	var list = createList(config);
	//+sorters & filters

	var loadMoreCalled = false;

	store.load.before.add(function(err, result) {
		if (!loadMoreCalled) {
			list.items([]);
		}
	});

	//this should be in list.js
	store.load.after.add(function(err, result) {
		numOfItems += numOfItemsToLoad;
		loadMoreCalled = false;
	});

	load(0, numOfItems);
	function load(skip, limit) {
		store.skip = skip;
		store.limit = limit;
	}

	function loadMore() {
		loadMoreCalled = true;
		load(numOfItems, numOfItemsToLoad);
	}

	list.loadMore = loadMore;

	return list;
};

},{"./list":6}],6:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var sortersHandler = require("./sortersHandler.js");


module.exports = function createList(config) {
	var store = config.store;

	var fields = config.fields;
	var labels = config.labels;

	var filters = null;
	var sorters = sortersHandler(config);

	var skip = ko.observable(0);
	var limit = ko.observable(10);


	var items = ko.observableArray([]);
	var itemVm = config.itemVm;

	var count = ko.observable(0); //should be read-only

	var loading = ko.observable(false); //should be read-only
	var error = ko.observable(false); //should be read-only?



	ko.computed(function() {
		//var filtersVal = filters();
		var sortersVal = sorters();
		var skipVal = skip();
		var limitVal = limit();

		//store.find = filtersVal;
		store.sort = sortersVal;
		store.skip = skipVal;
		store.limit = limitVal;
	}).extend({throttle: 0});

	function beforeLoad() {
		if (loading()) {
			console.log("List is already loading..."); //this might be problematic if there are no good timeout settings.
		}

		loading(true);
	}

	function afterLoad(err) {
		loading(false);
		if (err) {
			return error(err);
		}
		error(null);

		store.items.forEach(function(item) { //store === this
			if (typeof itemVm === "function") {
				item = itemVm(item);
			}
			items.push(item);
		});

		count(store.count);
	}

	function readOnlyComputed(observable) {
		return ko.computed({
			read: function() {
				return observable();
			},
			write: function() {
				throw "This computed variable should not be written.";
			}
		});
	}


	store.load.before.add(beforeLoad);
	store.load.after.add(afterLoad);

	return {
		fields: fields, //should filter to the fields. (select)
		labels: labels,

		filters: filters,
		sorters: sorters,
		skip: skip,
		limit: limit,

		items: items,
		count: readOnlyComputed(count),

		loading: readOnlyComputed(loading),
		error: readOnlyComputed(error)
	};
};

},{"./sortersHandler.js":10}],7:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);
var createList = require("./list");
var createPagination = require("./pagination");

module.exports = function createPagedList(config) {
	config = config || {};
	config.pagination = config.pagination || {};
	config.pagination.currentPage = config.pagination.currentPage || 0;
	config.pagination.itemsPerPage = config.pagination.itemsPerPage || 0;

	var store = config.store;

	store.load.after.add(afterLoad);

	var list = createList(config);
	var pagination = createPagination(config.pagination);
	list.pagination = pagination;

	function setSkipAndLimit() {
		var currentPage = pagination.currentPage();
		var itemsPerPage = pagination.itemsPerPage();
		list.skip(currentPage * itemsPerPage);
		list.limit(itemsPerPage);
	}

	//setSkipAndLimit();

	ko.computed(function() {
		setSkipAndLimit();
	});

	ko.computed(function() {
		var count = list.count();
		list.pagination.numOfItems(count);
	});

	function afterLoad() {
		list.items([]);
	}


	return list;
};

},{"./list":6,"./pagination":8}],8:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createPagination(config) {
	config = config || {};
	var numOfItems = ko.observable(config.numOfItems || 0);
	var itemsPerPage = ko.observable(config.itemsPerPage || 10);

	var numOfPages = ko.computed(function() {
		var numOfItemsVal = numOfItems();
		var itemsPerPageVal = itemsPerPage();

		if (!itemsPerPageVal) {
			return 0;
		}

		return Math.ceil(numOfItemsVal / itemsPerPageVal);
	});

	var currentPage = (function() {
		var currentPage = ko.observable(/*normalize*/(config.currentPage || 0)); //normalization might be problematic when we want to load the nth page right after loading.

		function normalize(value) {
			if (value < 0) {
				value = 0;
			}

			var pagesNum = numOfPages();
			if (value >= pagesNum) {
				value = pagesNum - 1;
			}

			return value;
		}

		return ko.computed({
			read: function() {
				return currentPage();
			},
			write: function(value) {
				currentPage(normalize(value));
			}
		});
	}());


	function next() {
		currentPage(currentPage() + 1);
	}

	function prev() {
		currentPage(currentPage() - 1);
	}


	var pageSelectors = (function(config) {
		var afterHead = config.afterHead || 2;
		var beforeTail = config.beforeTail || 2;
		var beforeCurrent = config.beforeCurrent || 2;
		var afterCurrent = config.afterCurrent || 2;

		function createPageSelector(idx, isCurrentPage) {
			return {
				label: idx + 1,
				selectPage: function() {
					currentPage(idx);
				}
			};
		}

		function createNonClickableSelector(label) {
			return {
				label: label,
				selectPage: function() {}
			};
		}

		return ko.computed(function() {
			var elements = [];

			var numOfPagesVal = numOfPages();
			var currentPageVal = currentPage();

			var nonClickableInserted = false;
			for (var idx = 0; idx < numOfPagesVal; idx += 1) {
				if (idx <= afterHead || idx >= numOfPagesVal - beforeTail -1 || (idx >= currentPageVal - beforeCurrent && idx <= currentPageVal + afterCurrent)) {
					var pageSelector;

					if (idx === currentPageVal) {
						pageSelector = createNonClickableSelector(idx + 1);
					} else {
						pageSelector = createPageSelector(idx);
					}

					elements.push(pageSelector);
					nonClickableInserted = false;
				} else {
					if (!nonClickableInserted) {
						elements.push(createNonClickableSelector("..."));
					}
					nonClickableInserted = true;
				}
			}

			return elements;
		});
	}(config));

	return {
		pageSelectors: pageSelectors,

		next: next,
		prev: prev,

		currentPage: currentPage,

		numOfItems: numOfItems,
		itemsPerPage: itemsPerPage,
		numOfPages: numOfPages
	};
};

},{}],9:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createSorter(config) {
	var sortBy = config.sortBy;
	var direction = ko.observable(config.direction || 0);

	var callback = config.callback;


	function asc() {
		direction(1);
		callback(sortBy, direction());
	}

	function desc() {
		direction(-1);
		callback(sortBy, direction());
	}

	function reset() {
		direction(0);
		callback(sortBy, direction());
	}

	return Object.freeze({
		sortBy: sortBy,

		direction: direction,

		asc: asc,
		desc: desc,

		reset: reset
	});
};

},{}],10:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);
var createSorter = require("./sorter");

module.exports = function createSortersHandler(config) {
	var sorters = {};

	//filtersHandler can be implemented in a very similar way

	for (var prop in config.sorters) {
		sorters[prop] = createSorter({
			sortBy: prop,
			direction: config.sorters[prop],
			callback: setOthersToZero
		});
	}


	function setOthersToZero(sortBy, direction) {
		for (var prop in sorters) {
			if (prop === sortBy) {
				continue;
			}
			sorters[prop].direction(0);
		}
	}

	//enek kívülre kéne kerülnie, a listbe...
	// a sorterst kell it publikálni.
	var sortersComputed = ko.computed(function() {
		var sortersObj = {};
		for (var prop in sorters) {
			var actDir = sorters[prop].direction();

			if (actDir !== 0) {
				sortersObj[prop] = actDir;
			}
		}

		return sortersObj;
	}).extend({throttle: 1});

	return sortersComputed;
};

},{"./sorter":9}],11:[function(require,module,exports){
/*jslint node: true */
"use strict";

var createModelObject = require("./modelObject");

module.exports = function createModel(options) {
	var fields = options.fields;

	//options.fields should be an array of objects
	//the objects should describe the fields:
	// - name
	// - type
	// - validators
	// - mapping
	// - defaultValue
	// - beforeChange
	// - afterChange

	var proxy = options.proxy;
	var idField = options.idField;

	function list(options, callback) {
		proxy.read(options, function(err, result) {
			if (err) {
				return callback(err);
			}

			var data = [];

			result.items.forEach(function(item) {
				data.push(createModelObject({
					fields: fields,
					proxy: proxy,
					idField: idField,

					data: item
				}));
			});

			var resultObj = {
				items: data,
				count: result.count
			};

			callback(null, resultObj);
		});
	}

	function load(id, callback) {
		proxy.readOneById(id, function(err, result) {
			if (err) {
				return callback(err);
			}

			var modelObject = createModelObject({
				fields: fields,
				proxy: proxy,
				idField: idField,

				data: result
			});
			callback(null, modelObject);
		});
	}

	function create(modelValues, callback) {
		proxy.createOne(modelValues, function(err, result) {
			if (err) {
				return callback(err);
			}

			callback(null, createModelObject({
				fields: fields,
				proxy: proxy,
				idField: idField,

				data: result
			}));
		});
	}

	return Object.freeze({
		fields: fields,
		proxy: proxy,
		idField: idField,

		list: list,
		load: load,
		create: create
	});
};
},{"./modelObject":12}],12:[function(require,module,exports){
/*jslint node: true */
"use strict";

var createProp = require("./prop");

module.exports = function createModelObject(options) {
	var fields = options.fields;
	var idField = options.idField;
	var proxy = options.proxy;

	var data = {};

	for (var prop in fields) {
		var actField = fields[prop];
		var actValue = options.data.hasOwnProperty(prop) ? options.data[prop] : actField.defaultValue;

		createProp(data, prop, {
			value: actValue,
			beforeChange: createBeforeChangeFunction(prop),
			afterChange: createAfterChangeFunction(prop)
		});
	}

	var obj = {
		data: data,

		save: save,
		destroy: destroy
	};

	function createBeforeChangeFunction(propName) {
		return function beforeChange(values) {
			validate(propName, values);

			var field = fields[propName];

			if (field.beforeChange) {
				if (typeof field.beforeChange === "function") {

				}
			}
		};
	}

	function createAfterChangeFunction(propName) {
		return function afterChange(values) {
			//call the onChange listeners
		};
	}


	function validate(propName, values) {
		var field = fields[propName];

		if (!field) {
			return;
		}

		if (!field.validators) {
			return;
		}
	}


	function save(callback) {
		var id = data[idField];
		proxy.updateOneById(id, data, function(err, result) {
			if (err) {
				return callback(err);
			}

			for (var prop in result) {
				data[prop] = result[prop];
			}

			callback(null, obj);
		});
	}

	//deleted flag?
	function destroy(callback) {
		var id = fields[idField].get();
		proxy.destroyOneById(id, data, function(err, result) {
			if (err) {
				return callback(err);
			}

			callback(null, obj);
		});
	}

	return obj;
};

},{"./prop":13}],13:[function(require,module,exports){
/*jslint node: true */
"use strict";

module.exports = function createProp(obj, name, config) {
	//should be called field
	config = config || {};

	var initialValue = config.value;
	var value = initialValue;
	var lastValue = value;

	Object.defineProperty(obj, name, {
		enumerable: true,
		configurable: false,

		set: set,
		get: get
	});

	function set(newVal) {
		if (newVal === value) {
			return;
		}

		if (typeof config.beforeChange === "function") {
			config.beforeChange({lastValue: lastValue, value: value, newValue: newVal, initialValue: initialValue});
		}

		lastValue = value;
		value = newVal;

		if (typeof config.afterChange === "function") {
			config.afterChange({lastValue: lastValue, value: value, newValue: newVal, initialValue: initialValue});
		}
	}

	function get() {
		return value;
	}

	return obj;
};

},{}],14:[function(require,module,exports){
var request = require("superagent");

var timeout = 10000;

module.exports = function createRestProxy(config) {
	var idProperty = config.idProperty;
	var generateId = config.generateId;
	var route = config.route;

	function read(options, callback) {
		if (options.find) {
			options.find = JSON.stringify(options.find);
		}
		if (options.sort) {
			options.sort = JSON.stringify(options.sort);
		}
		request
			.get(route)
			.query(options)
			.type("application/json")
			.accept("application/json")
			.timeout(timeout)
			.end(function(err, result) {
				if (err) {
					return callback(err);
				}
				callback(null, result.body);
			});
	}

	function createOne(data, callback) {
		request
			.post(route)
			.send(data)
			.type("application/json")
			.accept("application/json")
			.timeout(timeout)
			.end(function(err, result) {
				if (err) {
					return callback(err);
				}
				callback(null, result.body);
			});
	}

	function readOneById(id, callback) {
		request
			.get(route + id)
			.type("application/json")
			.accept("application/json")
			.timeout(timeout)
			.end(function(err, result) {
				if (err) {
					return callback(err);
				}
				callback(null, result.body);
			});
	}

	function updateOneById(id, newData, callback) {
		request
			.put(route + id)
			.send(newData)
			.type("application/json")
			.accept("application/json")
			.timeout(timeout)
			.end(function(err, result) {
				if (err) {
					return callback(err);
				}
				callback(null, result.body);
			});
	}

	function destroyOneById(id, callback) {
		request
			.del(route + id)
			.type("application/json")
			.accept("application/json")
			.timeout(timeout)
			.end(function(err, result) {
				if (err) {
					return callback(err);
				}
				callback(null, result.body);
			});
	}


	return Object.freeze({
		idProperty: idProperty,
		generateId: generateId,


		read: read,

		createOne: createOne,

		readOneById: readOneById,
		updateOneById: updateOneById,
		destroyOneById: destroyOneById
	});
};

},{"superagent":4}],15:[function(require,module,exports){
/*jslint node: true */
"use strict";

var createProp = require("../model/prop");

module.exports = function createStore(options) {
	var model = options.model;
	var proxy = model.proxy;

	//var autoLoad;
	//var autoSync;


	var store = {
		//data: data,
		model: model,
		proxy: proxy,

		items: [],
		count: 0, 

		query: query,
		load: load,
		add: add
	};

	var triggerQueryChanged = (function() {
		var queryChanged = null;
		return function triggerQueryChanged() {
			if (queryChanged) {
				return;
			}

			queryChanged = setTimeout(function() {
				load();
				queryChanged = null;
			}, 0);
		};
	}());

	//maybe these should be on a separate query object.
	createProp(store, "find", {
		//lastValue, value, newValue, initialValue
		value: options.find || {},
		beforeChange: function(values) {

		},
		afterChange: triggerQueryChanged
	});

	//also, find and sort properties are not very good as simple props... They should be "propObjects" or something...
	//that way their fields' changes would be triggered as well.
	createProp(store, "sort", {
		value: options.sort || {id: -1},
		beforeChange: function(values) {
		},
		afterChange: triggerQueryChanged
	});

	createProp(store, "skip", {
		value: options.skip || 0,
		beforeChange: function(values) {

		},
		afterChange: triggerQueryChanged
	});

	createProp(store, "limit", {
		value: options.limit || 10,
		beforeChange: function(values) {

		},
		afterChange: triggerQueryChanged
	});



	//var group = "?good question?";

	//var buffered;

	//var remoteFilter;
	//var remoteGroup;
	//var remoteSort;


	//var actPage = options.actPage || 0;
	//var numOfItems = 0;
	//var numOfPages = 0;

	//model instances should be stored somewhere by id as well.
	//in the data array, there should be references to those instances... although it would be complicated when loaded from localStorage.
	//maybe we should store only the id-s of the elements in the data array...
	//var prefetchedData = {
	//	"{sorters: {id: 1}, filters: {}": [{skip: 0, ids: []}]
	//};
	//var prefetchedDataStorage = [];

	//function getData() {
	//	return prefetchedData[currentPage].data;
	//}


	//skip and limit should be properties as well
	//if skip, limit, find or sort changes, then the load method should be called automatically.


	//every load call should have an id.
	//this way we can set up
	function query(queryObj, callback) {
		model.list(queryObj, function(err, result) {
			callback(err, result);
		});
	}

	function load() {
		var queryObj = {
			find: store.find,
			sort: store.sort,
			skip: store.skip,
			limit: store.limit
		};

		load.before(queryObj);

		query(queryObj, function(err, result) {
			if (err) {
				return load.after(err);
			}

			store.items.length = 0;
			store.items.length = result.items.length;
			for (var idx = 0; idx < result.items.length; idx += 1) {
				store.items[idx] = result.items[idx];
			}
			store.count = result.count;

			load.after(null, result);
		});
	}

	load.before = createCallbackArrayCaller(store, []); //later we can add default callbacks
	load.after = createCallbackArrayCaller(store, []);

	function createCallbackArrayCaller(thisArg, array) {
		function callbackArrayCaller(err) {
			array.forEach(function(actFunction) {
				actFunction.call(thisArg, err);
			});
		}

		callbackArrayCaller.add = function(func) {
			if (typeof func !== "function") {
				return;
			}

			array.push(func);
		};

		return callbackArrayCaller;
	}


	function add(data, callback) {
		model.create(data, callback);
	}


	

	return store;
};

},{"../model/prop":13}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9TZXJ2ZXJXaXRoTWVtb3J5UHJveHkvcHVibGljL21haW4uanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVkdWNlLWNvbXBvbmVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9jbGllbnQuanMiLCJzcmMva28tY29tcG9uZW50cy9saXN0cy9pbmZpbml0ZUxpc3QuanMiLCJzcmMva28tY29tcG9uZW50cy9saXN0cy9saXN0LmpzIiwic3JjL2tvLWNvbXBvbmVudHMvbGlzdHMvcGFnZWRMaXN0LmpzIiwic3JjL2tvLWNvbXBvbmVudHMvbGlzdHMvcGFnaW5hdGlvbi5qcyIsInNyYy9rby1jb21wb25lbnRzL2xpc3RzL3NvcnRlci5qcyIsInNyYy9rby1jb21wb25lbnRzL2xpc3RzL3NvcnRlcnNIYW5kbGVyLmpzIiwic3JjL21vZGVsL21vZGVsLmpzIiwic3JjL21vZGVsL21vZGVsT2JqZWN0LmpzIiwic3JjL21vZGVsL3Byb3AuanMiLCJzcmMvcHJveHkvcmVzdC5qcyIsInNyYy9zdG9yZS9zdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBjcmVhdGVQcm94eSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9zcmMvcHJveHkvcmVzdFwiKTtcbnZhciBjcmVhdGVNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi8uLi9zcmMvbW9kZWwvbW9kZWxcIik7XG52YXIgY3JlYXRlU3RvcmUgPSByZXF1aXJlKFwiLi4vLi4vLi4vc3JjL3N0b3JlL3N0b3JlXCIpO1xuXG52YXIgcHJveHkgPSBjcmVhdGVQcm94eSh7XG5cdGlkUHJvcGVydHk6IFwiaWRcIixcblx0cm91dGU6IFwiL3VzZXJcIlxufSk7XG52YXIgbW9kZWwgPSBjcmVhdGVNb2RlbCh7XG5cdGZpZWxkczoge1xuXHRcdGlkOiB7XG5cdFx0XHR0eXBlOiBcIm51bWJlclwiXG5cdFx0fSxcblx0XHRlbWFpbDoge1xuXHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdH0sXG5cdFx0bmFtZToge1xuXHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdH0sXG5cdFx0dGl0bGU6IHtcblx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHR9XG5cdH0sXG5cdHByb3h5OiBwcm94eVxufSk7XG52YXIgc3RvcmUgPSBjcmVhdGVTdG9yZSh7XG5cdG1vZGVsOiBtb2RlbFxufSk7XG5cbi8vKlxuLy9zZWVkXG4vL2F0b21cbnZhciBzZWVkID0gdHJ1ZTtcbmZ1bmN0aW9uIGhhbmRsZVJlc3BvbnNlKGVyciwgcmVzdWx0KSB7XG5cdC8vY29uc29sZS5sb2coZXJyLCByZXN1bHQpO1xufVxuaWYgKHNlZWQpIHtcblx0dmFyIG5hbWVzID0gW1wiQm9iXCIsIFwiUm9iXCIsIFwiT2xnYVwiLCBcIkhlbGdhXCJdO1xuXHR2YXIgdGl0bGVzID0gW1wiQ0VPXCIsIFwiQ1RPXCIsIFwiU2xhdmVcIl07XG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IDEwMDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0TmFtZSA9IG5hbWVzW2lkeCAlIDRdO1xuXHRcdHN0b3JlLmFkZCh7XG5cdFx0XHRpZDogaWR4LFxuXHRcdFx0ZW1haWw6IGFjdE5hbWUudG9Mb3dlckNhc2UoKSArIFwiX1wiICsgaWR4ICsgXCJAc3VwZXJjb3JwLmNvbVwiLFxuXHRcdFx0bmFtZTogYWN0TmFtZSxcblx0XHRcdHRpdGxlOiB0aXRsZXNbaWR4ICUgM11cblx0XHR9LCBoYW5kbGVSZXNwb25zZSk7XG5cdH1cbn1cbi8vKi9cblxuXG52YXIgY3JlYXRlSW5maW5pdGVMb2FkZXIgPSByZXF1aXJlKFwiLi4vLi4vLi4vc3JjL2tvLWNvbXBvbmVudHMvbGlzdHMvaW5maW5pdGVMaXN0LmpzXCIpO1xudmFyIGNyZWF0ZVBhZ2VkTGlzdCA9IHJlcXVpcmUoXCIuLi8uLi8uLi9zcmMva28tY29tcG9uZW50cy9saXN0cy9wYWdlZExpc3QuanNcIik7XG5cblxuLypcbnZhciBsaXN0ID0gY3JlYXRlSW5maW5pdGVMb2FkZXIoe1xuXHRzdG9yZTogc3RvcmUsXG5cblx0ZmllbGRzOiBbXCJpZFwiLCBcImVtYWlsXCIsIFwibmFtZVwiLCBcInRpdGxlXCJdLFxuXG5cdGxhYmVsczoge1xuXHRcdGVtYWlsOiBcIkUtbWFpbFwiLFxuXHRcdG5hbWU6IFwiTsOpdlwiLFxuXHRcdHRpdGxlOiBcIkJlb3N6dMOhc1wiXG5cdH0sXG5cblx0c29ydGVyczoge1xuXHRcdGlkOiAxLFxuXHRcdGVtYWlsOiAwLFxuXHRcdG5hbWU6IDBcblx0fSxcblxuXHRudW1PZkl0ZW1zOiAxMCxcblx0bnVtT2ZJdGVtc1RvTG9hZDogMTBcbn0pO1xuLy8qL1xuXG4vLy8qXG52YXIgbGlzdCA9IGNyZWF0ZVBhZ2VkTGlzdCh7XG5cdHN0b3JlOiBzdG9yZSxcblxuXHRmaWVsZHM6IFtcImlkXCIsIFwiZW1haWxcIiwgXCJuYW1lXCIsIFwidGl0bGVcIl0sXG5cblx0bGFiZWxzOiB7XG5cdFx0ZW1haWw6IFwiRS1tYWlsXCIsXG5cdFx0bmFtZTogXCJOYW1lXCIsXG5cdFx0dGl0bGU6IFwiVmVyeSB0aXRsZVwiXG5cdH0sXG5cblx0c29ydGVyczoge1xuXHRcdGlkOiAxLFxuXHRcdGVtYWlsOiAwXG5cdH0sXG5cblx0cGFnaW5hdGlvbjoge1xuXHRcdGN1cnJlbnRQYWdlOiAwLFxuXHRcdGl0ZW1zUGVyUGFnZTogNSxcblxuXHRcdGFmdGVySGVhZDogMSxcblx0XHRiZWZvcmVUYWlsOiAxLFxuXHRcdGFmdGVyQ3VycmVudDogMSxcblx0XHRiZWZvcmVDdXJyZW50OiAxXG5cdH1cbn0pO1xuLy8qL1xuXG5cblxuXG5rby5hcHBseUJpbmRpbmdzKGxpc3QpO1xuXG4iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJcbi8qKlxuICogUmVkdWNlIGBhcnJgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge01peGVkfSBpbml0aWFsXG4gKlxuICogVE9ETzogY29tYmF0aWJsZSBlcnJvciBoYW5kbGluZz9cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFyciwgZm4sIGluaXRpYWwpeyAgXG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgdmFyIGN1cnIgPSBhcmd1bWVudHMubGVuZ3RoID09IDNcbiAgICA/IGluaXRpYWxcbiAgICA6IGFycltpZHgrK107XG5cbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIGN1cnIgPSBmbi5jYWxsKG51bGwsIGN1cnIsIGFycltpZHhdLCArK2lkeCwgYXJyKTtcbiAgfVxuICBcbiAgcmV0dXJuIGN1cnI7XG59OyIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJ2VtaXR0ZXInKTtcbnZhciByZWR1Y2UgPSByZXF1aXJlKCdyZWR1Y2UnKTtcblxuLyoqXG4gKiBSb290IHJlZmVyZW5jZSBmb3IgaWZyYW1lcy5cbiAqL1xuXG52YXIgcm9vdDtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgeyAvLyBCcm93c2VyIHdpbmRvd1xuICByb290ID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gV2ViIFdvcmtlclxuICByb290ID0gc2VsZjtcbn0gZWxzZSB7IC8vIE90aGVyIGVudmlyb25tZW50c1xuICByb290ID0gdGhpcztcbn1cblxuLyoqXG4gKiBOb29wLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgaG9zdCBvYmplY3QsXG4gKiB3ZSBkb24ndCB3YW50IHRvIHNlcmlhbGl6ZSB0aGVzZSA6KVxuICpcbiAqIFRPRE86IGZ1dHVyZSBwcm9vZiwgbW92ZSB0byBjb21wb2VudCBsYW5kXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzSG9zdChvYmopIHtcbiAgdmFyIHN0ciA9IHt9LnRvU3RyaW5nLmNhbGwob2JqKTtcblxuICBzd2l0Y2ggKHN0cikge1xuICAgIGNhc2UgJ1tvYmplY3QgRmlsZV0nOlxuICAgIGNhc2UgJ1tvYmplY3QgQmxvYl0nOlxuICAgIGNhc2UgJ1tvYmplY3QgRm9ybURhdGFdJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgWEhSLlxuICovXG5cbnJlcXVlc3QuZ2V0WEhSID0gZnVuY3Rpb24gKCkge1xuICBpZiAocm9vdC5YTUxIdHRwUmVxdWVzdFxuICAgICAgJiYgKCFyb290LmxvY2F0aW9uIHx8ICdmaWxlOicgIT0gcm9vdC5sb2NhdGlvbi5wcm90b2NvbFxuICAgICAgICAgIHx8ICFyb290LkFjdGl2ZVhPYmplY3QpKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgfSBlbHNlIHtcbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjYuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC4zLjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLCBhZGRlZCB0byBzdXBwb3J0IElFLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgdHJpbSA9ICcnLnRyaW1cbiAgPyBmdW5jdGlvbihzKSB7IHJldHVybiBzLnRyaW0oKTsgfVxuICA6IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMucmVwbGFjZSgvKF5cXHMqfFxccyokKS9nLCAnJyk7IH07XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBnaXZlbiBgb2JqYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZXJpYWxpemUob2JqKSB7XG4gIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgdmFyIHBhaXJzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAobnVsbCAhPSBvYmpba2V5XSkge1xuICAgICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogSGVscHMgJ3NlcmlhbGl6ZScgd2l0aCBzZXJpYWxpemluZyBhcnJheXMuXG4gKiBNdXRhdGVzIHRoZSBwYWlycyBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYWlyc1xuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKi9cblxuZnVuY3Rpb24gcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgdmFsKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICByZXR1cm4gdmFsLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgdik7XG4gICAgfSk7XG4gIH1cbiAgcGFpcnMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KVxuICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkpO1xufVxuXG4vKipcbiAqIEV4cG9zZSBzZXJpYWxpemF0aW9uIG1ldGhvZC5cbiAqL1xuXG4gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QgPSBzZXJpYWxpemU7XG5cbiAvKipcbiAgKiBQYXJzZSB0aGUgZ2l2ZW4geC13d3ctZm9ybS11cmxlbmNvZGVkIGBzdHJgLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAqIEByZXR1cm4ge09iamVjdH1cbiAgKiBAYXBpIHByaXZhdGVcbiAgKi9cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcoc3RyKSB7XG4gIHZhciBvYmogPSB7fTtcbiAgdmFyIHBhaXJzID0gc3RyLnNwbGl0KCcmJyk7XG4gIHZhciBwYXJ0cztcbiAgdmFyIHBhaXI7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgcGFpciA9IHBhaXJzW2ldO1xuICAgIHBhcnRzID0gcGFpci5zcGxpdCgnPScpO1xuICAgIG9ialtkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIEV4cG9zZSBwYXJzZXIuXG4gKi9cblxucmVxdWVzdC5wYXJzZVN0cmluZyA9IHBhcnNlU3RyaW5nO1xuXG4vKipcbiAqIERlZmF1bHQgTUlNRSB0eXBlIG1hcC5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKi9cblxucmVxdWVzdC50eXBlcyA9IHtcbiAgaHRtbDogJ3RleHQvaHRtbCcsXG4gIGpzb246ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgeG1sOiAnYXBwbGljYXRpb24veG1sJyxcbiAgdXJsZW5jb2RlZDogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICdmb3JtJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICdmb3JtLWRhdGEnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IHNlcmlhbGl6YXRpb24gbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnNlcmlhbGl6ZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihvYmope1xuICogICAgICAgcmV0dXJuICdnZW5lcmF0ZWQgeG1sIGhlcmUnO1xuICogICAgIH07XG4gKlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZSA9IHtcbiAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBzZXJpYWxpemUsXG4gICAnYXBwbGljYXRpb24vanNvbic6IEpTT04uc3RyaW5naWZ5XG4gfTtcblxuIC8qKlxuICAqIERlZmF1bHQgcGFyc2Vycy5cbiAgKlxuICAqICAgICBzdXBlcmFnZW50LnBhcnNlWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKHN0cil7XG4gICogICAgICAgcmV0dXJuIHsgb2JqZWN0IHBhcnNlZCBmcm9tIHN0ciB9O1xuICAqICAgICB9O1xuICAqXG4gICovXG5cbnJlcXVlc3QucGFyc2UgPSB7XG4gICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBwYXJzZVN0cmluZyxcbiAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnBhcnNlXG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBoZWFkZXIgYHN0cmAgaW50b1xuICogYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1hcHBlZCBmaWVsZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXIoc3RyKSB7XG4gIHZhciBsaW5lcyA9IHN0ci5zcGxpdCgvXFxyP1xcbi8pO1xuICB2YXIgZmllbGRzID0ge307XG4gIHZhciBpbmRleDtcbiAgdmFyIGxpbmU7XG4gIHZhciBmaWVsZDtcbiAgdmFyIHZhbDtcblxuICBsaW5lcy5wb3AoKTsgLy8gdHJhaWxpbmcgQ1JMRlxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGxpbmUgPSBsaW5lc1tpXTtcbiAgICBpbmRleCA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGZpZWxkID0gbGluZS5zbGljZSgwLCBpbmRleCkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB0cmltKGxpbmUuc2xpY2UoaW5kZXggKyAxKSk7XG4gICAgZmllbGRzW2ZpZWxkXSA9IHZhbDtcbiAgfVxuXG4gIHJldHVybiBmaWVsZHM7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYG1pbWVgIGlzIGpzb24gb3IgaGFzICtqc29uIHN0cnVjdHVyZWQgc3ludGF4IHN1ZmZpeC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWltZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzSlNPTihtaW1lKSB7XG4gIHJldHVybiAvW1xcLytdanNvblxcYi8udGVzdChtaW1lKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG1pbWUgdHlwZSBmb3IgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHR5cGUoc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5zaGlmdCgpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaGVhZGVyIGZpZWxkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyYW1zKHN0cil7XG4gIHJldHVybiByZWR1Y2Uoc3RyLnNwbGl0KC8gKjsgKi8pLCBmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKj0gKi8pXG4gICAgICAsIGtleSA9IHBhcnRzLnNoaWZ0KClcbiAgICAgICwgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgLy8gcmVzcG9uc2VUZXh0IGlzIGFjY2Vzc2libGUgb25seSBpZiByZXNwb25zZVR5cGUgaXMgJycgb3IgJ3RleHQnIGFuZCBvbiBvbGRlciBicm93c2Vyc1xuICB0aGlzLnRleHQgPSAoKHRoaXMucmVxLm1ldGhvZCAhPSdIRUFEJyAmJiAodGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAnJyB8fCB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JykpIHx8IHR5cGVvZiB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd1bmRlZmluZWQnKVxuICAgICA/IHRoaXMueGhyLnJlc3BvbnNlVGV4dFxuICAgICA6IG51bGw7XG4gIHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMucmVxLnhoci5zdGF0dXNUZXh0O1xuICB0aGlzLnNldFN0YXR1c1Byb3BlcnRpZXModGhpcy54aHIuc3RhdHVzKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnMgPSBwYXJzZUhlYWRlcih0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLnNldEhlYWRlclByb3BlcnRpZXModGhpcy5oZWFkZXIpO1xuICB0aGlzLmJvZHkgPSB0aGlzLnJlcS5tZXRob2QgIT0gJ0hFQUQnXG4gICAgPyB0aGlzLnBhcnNlQm9keSh0aGlzLnRleHQgPyB0aGlzLnRleHQgOiB0aGlzLnhoci5yZXNwb25zZSlcbiAgICA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuaGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIHJlbGF0ZWQgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYC50eXBlYCB0aGUgY29udGVudCB0eXBlIHdpdGhvdXQgcGFyYW1zXG4gKlxuICogQSByZXNwb25zZSBvZiBcIkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOFwiXG4gKiB3aWxsIHByb3ZpZGUgeW91IHdpdGggYSBgLnR5cGVgIG9mIFwidGV4dC9wbGFpblwiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRIZWFkZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24oaGVhZGVyKXtcbiAgLy8gY29udGVudC10eXBlXG4gIHZhciBjdCA9IHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgdGhpcy50eXBlID0gdHlwZShjdCk7XG5cbiAgLy8gcGFyYW1zXG4gIHZhciBvYmogPSBwYXJhbXMoY3QpO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB0aGlzW2tleV0gPSBvYmpba2V5XTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGJvZHkgYHN0cmAuXG4gKlxuICogVXNlZCBmb3IgYXV0by1wYXJzaW5nIG9mIGJvZGllcy4gUGFyc2Vyc1xuICogYXJlIGRlZmluZWQgb24gdGhlIGBzdXBlcmFnZW50LnBhcnNlYCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUucGFyc2VCb2R5ID0gZnVuY3Rpb24oc3RyKXtcbiAgdmFyIHBhcnNlID0gcmVxdWVzdC5wYXJzZVt0aGlzLnR5cGVdO1xuICByZXR1cm4gcGFyc2UgJiYgc3RyICYmIChzdHIubGVuZ3RoIHx8IHN0ciBpbnN0YW5jZW9mIE9iamVjdClcbiAgICA/IHBhcnNlKHN0cilcbiAgICA6IG51bGw7XG59O1xuXG4vKipcbiAqIFNldCBmbGFncyBzdWNoIGFzIGAub2tgIGJhc2VkIG9uIGBzdGF0dXNgLlxuICpcbiAqIEZvciBleGFtcGxlIGEgMnh4IHJlc3BvbnNlIHdpbGwgZ2l2ZSB5b3UgYSBgLm9rYCBvZiBfX3RydWVfX1xuICogd2hlcmVhcyA1eHggd2lsbCBiZSBfX2ZhbHNlX18gYW5kIGAuZXJyb3JgIHdpbGwgYmUgX190cnVlX18uIFRoZVxuICogYC5jbGllbnRFcnJvcmAgYW5kIGAuc2VydmVyRXJyb3JgIGFyZSBhbHNvIGF2YWlsYWJsZSB0byBiZSBtb3JlXG4gKiBzcGVjaWZpYywgYW5kIGAuc3RhdHVzVHlwZWAgaXMgdGhlIGNsYXNzIG9mIGVycm9yIHJhbmdpbmcgZnJvbSAxLi41XG4gKiBzb21ldGltZXMgdXNlZnVsIGZvciBtYXBwaW5nIHJlc3BvbmQgY29sb3JzIGV0Yy5cbiAqXG4gKiBcInN1Z2FyXCIgcHJvcGVydGllcyBhcmUgYWxzbyBkZWZpbmVkIGZvciBjb21tb24gY2FzZXMuIEN1cnJlbnRseSBwcm92aWRpbmc6XG4gKlxuICogICAtIC5ub0NvbnRlbnRcbiAqICAgLSAuYmFkUmVxdWVzdFxuICogICAtIC51bmF1dGhvcml6ZWRcbiAqICAgLSAubm90QWNjZXB0YWJsZVxuICogICAtIC5ub3RGb3VuZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgLy8gaGFuZGxlIElFOSBidWc6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICBpZiAoc3RhdHVzID09PSAxMjIzKSB7XG4gICAgc3RhdHVzID0gMjA0O1xuICB9XG5cbiAgdmFyIHR5cGUgPSBzdGF0dXMgLyAxMDAgfCAwO1xuXG4gIC8vIHN0YXR1cyAvIGNsYXNzXG4gIHRoaXMuc3RhdHVzID0gdGhpcy5zdGF0dXNDb2RlID0gc3RhdHVzO1xuICB0aGlzLnN0YXR1c1R5cGUgPSB0eXBlO1xuXG4gIC8vIGJhc2ljc1xuICB0aGlzLmluZm8gPSAxID09IHR5cGU7XG4gIHRoaXMub2sgPSAyID09IHR5cGU7XG4gIHRoaXMuY2xpZW50RXJyb3IgPSA0ID09IHR5cGU7XG4gIHRoaXMuc2VydmVyRXJyb3IgPSA1ID09IHR5cGU7XG4gIHRoaXMuZXJyb3IgPSAoNCA9PSB0eXBlIHx8IDUgPT0gdHlwZSlcbiAgICA/IHRoaXMudG9FcnJvcigpXG4gICAgOiBmYWxzZTtcblxuICAvLyBzdWdhclxuICB0aGlzLmFjY2VwdGVkID0gMjAyID09IHN0YXR1cztcbiAgdGhpcy5ub0NvbnRlbnQgPSAyMDQgPT0gc3RhdHVzO1xuICB0aGlzLmJhZFJlcXVlc3QgPSA0MDAgPT0gc3RhdHVzO1xuICB0aGlzLnVuYXV0aG9yaXplZCA9IDQwMSA9PSBzdGF0dXM7XG4gIHRoaXMubm90QWNjZXB0YWJsZSA9IDQwNiA9PSBzdGF0dXM7XG4gIHRoaXMubm90Rm91bmQgPSA0MDQgPT0gc3RhdHVzO1xuICB0aGlzLmZvcmJpZGRlbiA9IDQwMyA9PSBzdGF0dXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBgRXJyb3JgIHJlcHJlc2VudGF0aXZlIG9mIHRoaXMgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybiB7RXJyb3J9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS50b0Vycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHJlcSA9IHRoaXMucmVxO1xuICB2YXIgbWV0aG9kID0gcmVxLm1ldGhvZDtcbiAgdmFyIHVybCA9IHJlcS51cmw7XG5cbiAgdmFyIG1zZyA9ICdjYW5ub3QgJyArIG1ldGhvZCArICcgJyArIHVybCArICcgKCcgKyB0aGlzLnN0YXR1cyArICcpJztcbiAgdmFyIGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSBtZXRob2Q7XG4gIGVyci51cmwgPSB1cmw7XG5cbiAgcmV0dXJuIGVycjtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxucmVxdWVzdC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RgIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgIGFuZCBgdXJsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBFbWl0dGVyLmNhbGwodGhpcyk7XG4gIHRoaXMuX3F1ZXJ5ID0gdGhpcy5fcXVlcnkgfHwgW107XG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICB0aGlzLnVybCA9IHVybDtcbiAgdGhpcy5oZWFkZXIgPSB7fTtcbiAgdGhpcy5faGVhZGVyID0ge307XG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIHJlcyA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgcmVzID0gbmV3IFJlc3BvbnNlKHNlbGYpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKCdQYXJzZXIgaXMgdW5hYmxlIHRvIHBhcnNlIHRoZSByZXNwb25zZScpO1xuICAgICAgZXJyLnBhcnNlID0gdHJ1ZTtcbiAgICAgIGVyci5vcmlnaW5hbCA9IGU7XG4gICAgICAvLyBpc3N1ZSAjNjc1OiByZXR1cm4gdGhlIHJhdyByZXNwb25zZSBpZiB0aGUgcmVzcG9uc2UgcGFyc2luZyBmYWlsc1xuICAgICAgZXJyLnJhd1Jlc3BvbnNlID0gc2VsZi54aHIgJiYgc2VsZi54aHIucmVzcG9uc2VUZXh0ID8gc2VsZi54aHIucmVzcG9uc2VUZXh0IDogbnVsbDtcbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVycik7XG4gICAgfVxuXG4gICAgc2VsZi5lbWl0KCdyZXNwb25zZScsIHJlcyk7XG5cbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgfVxuXG4gICAgaWYgKHJlcy5zdGF0dXMgPj0gMjAwICYmIHJlcy5zdGF0dXMgPCAzMDApIHtcbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICB9XG5cbiAgICB2YXIgbmV3X2VyciA9IG5ldyBFcnJvcihyZXMuc3RhdHVzVGV4dCB8fCAnVW5zdWNjZXNzZnVsIEhUVFAgcmVzcG9uc2UnKTtcbiAgICBuZXdfZXJyLm9yaWdpbmFsID0gZXJyO1xuICAgIG5ld19lcnIucmVzcG9uc2UgPSByZXM7XG4gICAgbmV3X2Vyci5zdGF0dXMgPSByZXMuc3RhdHVzO1xuXG4gICAgc2VsZi5jYWxsYmFjayhuZXdfZXJyLCByZXMpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBNaXhpbiBgRW1pdHRlcmAuXG4gKi9cblxuRW1pdHRlcihSZXF1ZXN0LnByb3RvdHlwZSk7XG5cbi8qKlxuICogQWxsb3cgZm9yIGV4dGVuc2lvblxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKGZuKSB7XG4gIGZuKHRoaXMpO1xuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBTZXQgdGltZW91dCB0byBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnRpbWVvdXQgPSBmdW5jdGlvbihtcyl7XG4gIHRoaXMuX3RpbWVvdXQgPSBtcztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENsZWFyIHByZXZpb3VzIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNsZWFyVGltZW91dCA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuX3RpbWVvdXQgPSAwO1xuICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWJvcnQgdGhlIHJlcXVlc3QsIGFuZCBjbGVhciBwb3RlbnRpYWwgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCl7XG4gIGlmICh0aGlzLmFib3J0ZWQpIHJldHVybjtcbiAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgdGhpcy54aHIuYWJvcnQoKTtcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgdGhpcy5lbWl0KCdhYm9ydCcpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IGhlYWRlciBgZmllbGRgIHRvIGB2YWxgLCBvciBtdWx0aXBsZSBmaWVsZHMgd2l0aCBvbmUgb2JqZWN0LlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5zZXQoJ1gtQVBJLUtleScsICdmb29iYXInKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCh7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLCAnWC1BUEktS2V5JzogJ2Zvb2JhcicgfSlcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGZpZWxkXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oZmllbGQsIHZhbCl7XG4gIGlmIChpc09iamVjdChmaWVsZCkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZmllbGQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgZmllbGRba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXSA9IHZhbDtcbiAgdGhpcy5oZWFkZXJbZmllbGRdID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGhlYWRlciBgZmllbGRgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAudW5zZXQoJ1VzZXItQWdlbnQnKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnVuc2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICBkZWxldGUgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xuICBkZWxldGUgdGhpcy5oZWFkZXJbZmllbGRdO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgaGVhZGVyIGBmaWVsZGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5nZXRIZWFkZXIgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIFNldCBDb250ZW50LVR5cGUgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCd4bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ2FwcGxpY2F0aW9uL3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudHlwZSA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQ29udGVudC1UeXBlJywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEZvcmNlIGdpdmVuIHBhcnNlclxuICpcbiAqIFNldHMgdGhlIGJvZHkgcGFyc2VyIG5vIG1hdHRlciB0eXBlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oZm4pe1xuICB0aGlzLl9wYXJzZXIgPSBmbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBY2NlcHQgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMuanNvbiA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjY2VwdFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQWNjZXB0JywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBdXRob3JpemF0aW9uIGZpZWxkIHZhbHVlIHdpdGggYHVzZXJgIGFuZCBgcGFzc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXV0aCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3Mpe1xuICB2YXIgc3RyID0gYnRvYSh1c2VyICsgJzonICsgcGFzcyk7XG4gIHRoaXMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0Jhc2ljICcgKyBzdHIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuKiBBZGQgcXVlcnktc3RyaW5nIGB2YWxgLlxuKlxuKiBFeGFtcGxlczpcbipcbiogICByZXF1ZXN0LmdldCgnL3Nob2VzJylcbiogICAgIC5xdWVyeSgnc2l6ZT0xMCcpXG4qICAgICAucXVlcnkoeyBjb2xvcjogJ2JsdWUnIH0pXG4qXG4qIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gdmFsXG4qIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuKiBAYXBpIHB1YmxpY1xuKi9cblxuUmVxdWVzdC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbih2YWwpe1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkgdmFsID0gc2VyaWFsaXplKHZhbCk7XG4gIGlmICh2YWwpIHRoaXMuX3F1ZXJ5LnB1c2godmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdyaXRlIHRoZSBmaWVsZCBgbmFtZWAgYW5kIGB2YWxgIGZvciBcIm11bHRpcGFydC9mb3JtLWRhdGFcIlxuICogcmVxdWVzdCBib2RpZXMuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuZmllbGQoJ2ZvbycsICdiYXInKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ3xCbG9ifEZpbGV9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsKXtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB0aGlzLl9mb3JtRGF0YS5hcHBlbmQobmFtZSwgdmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFF1ZXVlIHRoZSBnaXZlbiBgZmlsZWAgYXMgYW4gYXR0YWNobWVudCB0byB0aGUgc3BlY2lmaWVkIGBmaWVsZGAsXG4gKiB3aXRoIG9wdGlvbmFsIGBmaWxlbmFtZWAuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuYXR0YWNoKG5ldyBCbG9iKFsnPGEgaWQ9XCJhXCI+PGIgaWQ9XCJiXCI+aGV5ITwvYj48L2E+J10sIHsgdHlwZTogXCJ0ZXh0L2h0bWxcIn0pKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHBhcmFtIHtCbG9ifEZpbGV9IGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSl7XG4gIGlmICghdGhpcy5fZm9ybURhdGEpIHRoaXMuX2Zvcm1EYXRhID0gbmV3IHJvb3QuRm9ybURhdGEoKTtcbiAgdGhpcy5fZm9ybURhdGEuYXBwZW5kKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZW5kIGBkYXRhYCwgZGVmYXVsdGluZyB0aGUgYC50eXBlKClgIHRvIFwianNvblwiIHdoZW5cbiAqIGFuIG9iamVjdCBpcyBnaXZlbi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgICAvLyBxdWVyeXN0cmluZ1xuICogICAgICAgcmVxdWVzdC5nZXQoJy9zZWFyY2gnKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG11bHRpcGxlIGRhdGEgXCJ3cml0ZXNcIlxuICogICAgICAgcmVxdWVzdC5nZXQoJy9zZWFyY2gnKVxuICogICAgICAgICAuc2VuZCh7IHNlYXJjaDogJ3F1ZXJ5JyB9KVxuICogICAgICAgICAuc2VuZCh7IHJhbmdlOiAnMS4uNScgfSlcbiAqICAgICAgICAgLnNlbmQoeyBvcmRlcjogJ2Rlc2MnIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnanNvbicpXG4gKiAgICAgICAgIC5zZW5kKCd7XCJuYW1lXCI6XCJ0alwifScpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoJ25hbWU9dGonKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBkZWZhdWx0cyB0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgKiAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICAqICAgICAgICAuc2VuZCgnbmFtZT10b2JpJylcbiAgKiAgICAgICAgLnNlbmQoJ3NwZWNpZXM9ZmVycmV0JylcbiAgKiAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24oZGF0YSl7XG4gIHZhciBvYmogPSBpc09iamVjdChkYXRhKTtcbiAgdmFyIHR5cGUgPSB0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyk7XG5cbiAgLy8gbWVyZ2VcbiAgaWYgKG9iaiAmJiBpc09iamVjdCh0aGlzLl9kYXRhKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhW2tleV0gPSBkYXRhW2tleV07XG4gICAgfVxuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBkYXRhKSB7XG4gICAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2Zvcm0nKTtcbiAgICB0eXBlID0gdGhpcy5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmICgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyA9PSB0eXBlKSB7XG4gICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YVxuICAgICAgICA/IHRoaXMuX2RhdGEgKyAnJicgKyBkYXRhXG4gICAgICAgIDogZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGF0YSA9ICh0aGlzLl9kYXRhIHx8ICcnKSArIGRhdGE7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9XG5cbiAgaWYgKCFvYmogfHwgaXNIb3N0KGRhdGEpKSByZXR1cm4gdGhpcztcbiAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2pzb24nKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEludm9rZSB0aGUgY2FsbGJhY2sgd2l0aCBgZXJyYCBhbmQgYHJlc2BcbiAqIGFuZCBoYW5kbGUgYXJpdHkgY2hlY2suXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNhbGxiYWNrID0gZnVuY3Rpb24oZXJyLCByZXMpe1xuICB2YXIgZm4gPSB0aGlzLl9jYWxsYmFjaztcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgZm4oZXJyLCByZXMpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB4LWRvbWFpbiBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jcm9zc0RvbWFpbkVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcignUmVxdWVzdCBoYXMgYmVlbiB0ZXJtaW5hdGVkXFxuUG9zc2libGUgY2F1c2VzOiB0aGUgbmV0d29yayBpcyBvZmZsaW5lLCBPcmlnaW4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luLCB0aGUgcGFnZSBpcyBiZWluZyB1bmxvYWRlZCwgZXRjLicpO1xuICBlcnIuY3Jvc3NEb21haW4gPSB0cnVlO1xuXG4gIGVyci5zdGF0dXMgPSB0aGlzLnN0YXR1cztcbiAgZXJyLm1ldGhvZCA9IHRoaXMubWV0aG9kO1xuICBlcnIudXJsID0gdGhpcy51cmw7XG5cbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB0aW1lb3V0IGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnRpbWVvdXRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigndGltZW91dCBvZiAnICsgdGltZW91dCArICdtcyBleGNlZWRlZCcpO1xuICBlcnIudGltZW91dCA9IHRpbWVvdXQ7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogRW5hYmxlIHRyYW5zbWlzc2lvbiBvZiBjb29raWVzIHdpdGggeC1kb21haW4gcmVxdWVzdHMuXG4gKlxuICogTm90ZSB0aGF0IGZvciB0aGlzIHRvIHdvcmsgdGhlIG9yaWdpbiBtdXN0IG5vdCBiZVxuICogdXNpbmcgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiB3aXRoIGEgd2lsZGNhcmQsXG4gKiBhbmQgYWxzbyBtdXN0IHNldCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCJcbiAqIHRvIFwidHJ1ZVwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUud2l0aENyZWRlbnRpYWxzID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fd2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEluaXRpYXRlIHJlcXVlc3QsIGludm9raW5nIGNhbGxiYWNrIGBmbihyZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHhociA9IHRoaXMueGhyID0gcmVxdWVzdC5nZXRYSFIoKTtcbiAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBkYXRhID0gdGhpcy5fZm9ybURhdGEgfHwgdGhpcy5fZGF0YTtcblxuICAvLyBzdG9yZSBjYWxsYmFja1xuICB0aGlzLl9jYWxsYmFjayA9IGZuIHx8IG5vb3A7XG5cbiAgLy8gc3RhdGUgY2hhbmdlXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIGlmICg0ICE9IHhoci5yZWFkeVN0YXRlKSByZXR1cm47XG5cbiAgICAvLyBJbiBJRTksIHJlYWRzIHRvIGFueSBwcm9wZXJ0eSAoZS5nLiBzdGF0dXMpIG9mZiBvZiBhbiBhYm9ydGVkIFhIUiB3aWxsXG4gICAgLy8gcmVzdWx0IGluIHRoZSBlcnJvciBcIkNvdWxkIG5vdCBjb21wbGV0ZSB0aGUgb3BlcmF0aW9uIGR1ZSB0byBlcnJvciBjMDBjMDIzZlwiXG4gICAgdmFyIHN0YXR1cztcbiAgICB0cnkgeyBzdGF0dXMgPSB4aHIuc3RhdHVzIH0gY2F0Y2goZSkgeyBzdGF0dXMgPSAwOyB9XG5cbiAgICBpZiAoMCA9PSBzdGF0dXMpIHtcbiAgICAgIGlmIChzZWxmLnRpbWVkb3V0KSByZXR1cm4gc2VsZi50aW1lb3V0RXJyb3IoKTtcbiAgICAgIGlmIChzZWxmLmFib3J0ZWQpIHJldHVybjtcbiAgICAgIHJldHVybiBzZWxmLmNyb3NzRG9tYWluRXJyb3IoKTtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdlbmQnKTtcbiAgfTtcblxuICAvLyBwcm9ncmVzc1xuICB2YXIgaGFuZGxlUHJvZ3Jlc3MgPSBmdW5jdGlvbihlKXtcbiAgICBpZiAoZS50b3RhbCA+IDApIHtcbiAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICB9O1xuICBpZiAodGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICB4aHIub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICB9XG4gIHRyeSB7XG4gICAgaWYgKHhoci51cGxvYWQgJiYgdGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgLy8gQWNjZXNzaW5nIHhoci51cGxvYWQgZmFpbHMgaW4gSUUgZnJvbSBhIHdlYiB3b3JrZXIsIHNvIGp1c3QgcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxuICAgIC8vIFJlcG9ydGVkIGhlcmU6XG4gICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MzcyNDUveG1saHR0cHJlcXVlc3QtdXBsb2FkLXRocm93cy1pbnZhbGlkLWFyZ3VtZW50LXdoZW4tdXNlZC1mcm9tLXdlYi13b3JrZXItY29udGV4dFxuICB9XG5cbiAgLy8gdGltZW91dFxuICBpZiAodGltZW91dCAmJiAhdGhpcy5fdGltZXIpIHtcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYudGltZWRvdXQgPSB0cnVlO1xuICAgICAgc2VsZi5hYm9ydCgpO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gcXVlcnlzdHJpbmdcbiAgaWYgKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdChxdWVyeSk7XG4gICAgdGhpcy51cmwgKz0gfnRoaXMudXJsLmluZGV4T2YoJz8nKVxuICAgICAgPyAnJicgKyBxdWVyeVxuICAgICAgOiAnPycgKyBxdWVyeTtcbiAgfVxuXG4gIC8vIGluaXRpYXRlIHJlcXVlc3RcbiAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlKTtcblxuICAvLyBDT1JTXG4gIGlmICh0aGlzLl93aXRoQ3JlZGVudGlhbHMpIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gIC8vIGJvZHlcbiAgaWYgKCdHRVQnICE9IHRoaXMubWV0aG9kICYmICdIRUFEJyAhPSB0aGlzLm1ldGhvZCAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgZGF0YSAmJiAhaXNIb3N0KGRhdGEpKSB7XG4gICAgLy8gc2VyaWFsaXplIHN0dWZmXG4gICAgdmFyIGNvbnRlbnRUeXBlID0gdGhpcy5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgIHZhciBzZXJpYWxpemUgPSB0aGlzLl9wYXJzZXIgfHwgcmVxdWVzdC5zZXJpYWxpemVbY29udGVudFR5cGUgPyBjb250ZW50VHlwZS5zcGxpdCgnOycpWzBdIDogJyddO1xuICAgIGlmICghc2VyaWFsaXplICYmIGlzSlNPTihjb250ZW50VHlwZSkpIHNlcmlhbGl6ZSA9IHJlcXVlc3Quc2VyaWFsaXplWydhcHBsaWNhdGlvbi9qc29uJ107XG4gICAgaWYgKHNlcmlhbGl6ZSkgZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcbiAgfVxuXG4gIC8vIHNldCBoZWFkZXIgZmllbGRzXG4gIGZvciAodmFyIGZpZWxkIGluIHRoaXMuaGVhZGVyKSB7XG4gICAgaWYgKG51bGwgPT0gdGhpcy5oZWFkZXJbZmllbGRdKSBjb250aW51ZTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgdGhpcy5oZWFkZXJbZmllbGRdKTtcbiAgfVxuXG4gIC8vIHNlbmQgc3R1ZmZcbiAgdGhpcy5lbWl0KCdyZXF1ZXN0JywgdGhpcyk7XG5cbiAgLy8gSUUxMSB4aHIuc2VuZCh1bmRlZmluZWQpIHNlbmRzICd1bmRlZmluZWQnIHN0cmluZyBhcyBQT1NUIHBheWxvYWQgKGluc3RlYWQgb2Ygbm90aGluZylcbiAgLy8gV2UgbmVlZCBudWxsIGhlcmUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgeGhyLnNlbmQodHlwZW9mIGRhdGEgIT09ICd1bmRlZmluZWQnID8gZGF0YSA6IG51bGwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRmF1eCBwcm9taXNlIHN1cHBvcnRcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChmdWxmaWxsLCByZWplY3QpIHtcbiAgcmV0dXJuIHRoaXMuZW5kKGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgZXJyID8gcmVqZWN0KGVycikgOiBmdWxmaWxsKHJlcyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEV4cG9zZSBgUmVxdWVzdGAuXG4gKi9cblxucmVxdWVzdC5SZXF1ZXN0ID0gUmVxdWVzdDtcblxuLyoqXG4gKiBJc3N1ZSBhIHJlcXVlc3Q6XG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgcmVxdWVzdCgnR0VUJywgJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycsIGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSB1cmwgb3IgY2FsbGJhY2tcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHVybCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCgnR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KCdHRVQnLCBtZXRob2QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KG1ldGhvZCwgdXJsKTtcbn1cblxuLyoqXG4gKiBHRVQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZ2V0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdHRVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5xdWVyeShkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogSEVBRCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5oZWFkID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdIRUFEJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogREVMRVRFIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZWwodXJsLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdERUxFVEUnLCB1cmwpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxucmVxdWVzdC5kZWwgPSBkZWw7XG5yZXF1ZXN0LmRlbGV0ZSA9IGRlbDtcblxuLyoqXG4gKiBQQVRDSCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBhdGNoID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQQVRDSCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBPU1QgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wb3N0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQT1NUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUFVUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucHV0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQVVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYHJlcXVlc3RgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdDtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGNyZWF0ZUxpc3QgPSByZXF1aXJlKFwiLi9saXN0XCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUluZmluaXRlTGlzdChjb25maWcpIHtcblx0dmFyIHN0b3JlID0gY29uZmlnLnN0b3JlO1xuXHR2YXIgb3JpZ2luYWxOdW1PZkl0ZW1zID0gY29uZmlnLm51bU9mSXRlbXMgfHwgMTA7XG5cdHZhciBudW1PZkl0ZW1zID0gb3JpZ2luYWxOdW1PZkl0ZW1zO1xuXHR2YXIgbnVtT2ZJdGVtc1RvTG9hZCA9IGNvbmZpZy5udW1PZkl0ZW1zVG9Mb2FkIHx8IDEwO1xuXHR2YXIgc2tpcCA9IDA7XG5cblxuXHR2YXIgbGlzdCA9IGNyZWF0ZUxpc3QoY29uZmlnKTtcblx0Ly8rc29ydGVycyAmIGZpbHRlcnNcblxuXHR2YXIgbG9hZE1vcmVDYWxsZWQgPSBmYWxzZTtcblxuXHRzdG9yZS5sb2FkLmJlZm9yZS5hZGQoZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcblx0XHRpZiAoIWxvYWRNb3JlQ2FsbGVkKSB7XG5cdFx0XHRsaXN0Lml0ZW1zKFtdKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vdGhpcyBzaG91bGQgYmUgaW4gbGlzdC5qc1xuXHRzdG9yZS5sb2FkLmFmdGVyLmFkZChmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuXHRcdG51bU9mSXRlbXMgKz0gbnVtT2ZJdGVtc1RvTG9hZDtcblx0XHRsb2FkTW9yZUNhbGxlZCA9IGZhbHNlO1xuXHR9KTtcblxuXHRsb2FkKDAsIG51bU9mSXRlbXMpO1xuXHRmdW5jdGlvbiBsb2FkKHNraXAsIGxpbWl0KSB7XG5cdFx0c3RvcmUuc2tpcCA9IHNraXA7XG5cdFx0c3RvcmUubGltaXQgPSBsaW1pdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGxvYWRNb3JlKCkge1xuXHRcdGxvYWRNb3JlQ2FsbGVkID0gdHJ1ZTtcblx0XHRsb2FkKG51bU9mSXRlbXMsIG51bU9mSXRlbXNUb0xvYWQpO1xuXHR9XG5cblx0bGlzdC5sb2FkTW9yZSA9IGxvYWRNb3JlO1xuXG5cdHJldHVybiBsaXN0O1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIHNvcnRlcnNIYW5kbGVyID0gcmVxdWlyZShcIi4vc29ydGVyc0hhbmRsZXIuanNcIik7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMaXN0KGNvbmZpZykge1xuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XG5cblx0dmFyIGZpZWxkcyA9IGNvbmZpZy5maWVsZHM7XG5cdHZhciBsYWJlbHMgPSBjb25maWcubGFiZWxzO1xuXG5cdHZhciBmaWx0ZXJzID0gbnVsbDtcblx0dmFyIHNvcnRlcnMgPSBzb3J0ZXJzSGFuZGxlcihjb25maWcpO1xuXG5cdHZhciBza2lwID0ga28ub2JzZXJ2YWJsZSgwKTtcblx0dmFyIGxpbWl0ID0ga28ub2JzZXJ2YWJsZSgxMCk7XG5cblxuXHR2YXIgaXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuXHR2YXIgaXRlbVZtID0gY29uZmlnLml0ZW1WbTtcblxuXHR2YXIgY291bnQgPSBrby5vYnNlcnZhYmxlKDApOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblxuXHR2YXIgbG9hZGluZyA9IGtvLm9ic2VydmFibGUoZmFsc2UpOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblx0dmFyIGVycm9yID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seT9cblxuXG5cblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0Ly92YXIgZmlsdGVyc1ZhbCA9IGZpbHRlcnMoKTtcblx0XHR2YXIgc29ydGVyc1ZhbCA9IHNvcnRlcnMoKTtcblx0XHR2YXIgc2tpcFZhbCA9IHNraXAoKTtcblx0XHR2YXIgbGltaXRWYWwgPSBsaW1pdCgpO1xuXG5cdFx0Ly9zdG9yZS5maW5kID0gZmlsdGVyc1ZhbDtcblx0XHRzdG9yZS5zb3J0ID0gc29ydGVyc1ZhbDtcblx0XHRzdG9yZS5za2lwID0gc2tpcFZhbDtcblx0XHRzdG9yZS5saW1pdCA9IGxpbWl0VmFsO1xuXHR9KS5leHRlbmQoe3Rocm90dGxlOiAwfSk7XG5cblx0ZnVuY3Rpb24gYmVmb3JlTG9hZCgpIHtcblx0XHRpZiAobG9hZGluZygpKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkxpc3QgaXMgYWxyZWFkeSBsb2FkaW5nLi4uXCIpOyAvL3RoaXMgbWlnaHQgYmUgcHJvYmxlbWF0aWMgaWYgdGhlcmUgYXJlIG5vIGdvb2QgdGltZW91dCBzZXR0aW5ncy5cblx0XHR9XG5cblx0XHRsb2FkaW5nKHRydWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWZ0ZXJMb2FkKGVycikge1xuXHRcdGxvYWRpbmcoZmFsc2UpO1xuXHRcdGlmIChlcnIpIHtcblx0XHRcdHJldHVybiBlcnJvcihlcnIpO1xuXHRcdH1cblx0XHRlcnJvcihudWxsKTtcblxuXHRcdHN0b3JlLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyAvL3N0b3JlID09PSB0aGlzXG5cdFx0XHRpZiAodHlwZW9mIGl0ZW1WbSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdGl0ZW0gPSBpdGVtVm0oaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdH0pO1xuXG5cdFx0Y291bnQoc3RvcmUuY291bnQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVhZE9ubHlDb21wdXRlZChvYnNlcnZhYmxlKSB7XG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gb2JzZXJ2YWJsZSgpO1xuXHRcdFx0fSxcblx0XHRcdHdyaXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhyb3cgXCJUaGlzIGNvbXB1dGVkIHZhcmlhYmxlIHNob3VsZCBub3QgYmUgd3JpdHRlbi5cIjtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGJlZm9yZUxvYWQpO1xuXHRzdG9yZS5sb2FkLmFmdGVyLmFkZChhZnRlckxvYWQpO1xuXG5cdHJldHVybiB7XG5cdFx0ZmllbGRzOiBmaWVsZHMsIC8vc2hvdWxkIGZpbHRlciB0byB0aGUgZmllbGRzLiAoc2VsZWN0KVxuXHRcdGxhYmVsczogbGFiZWxzLFxuXG5cdFx0ZmlsdGVyczogZmlsdGVycyxcblx0XHRzb3J0ZXJzOiBzb3J0ZXJzLFxuXHRcdHNraXA6IHNraXAsXG5cdFx0bGltaXQ6IGxpbWl0LFxuXG5cdFx0aXRlbXM6IGl0ZW1zLFxuXHRcdGNvdW50OiByZWFkT25seUNvbXB1dGVkKGNvdW50KSxcblxuXHRcdGxvYWRpbmc6IHJlYWRPbmx5Q29tcHV0ZWQobG9hZGluZyksXG5cdFx0ZXJyb3I6IHJlYWRPbmx5Q29tcHV0ZWQoZXJyb3IpXG5cdH07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xudmFyIGNyZWF0ZUxpc3QgPSByZXF1aXJlKFwiLi9saXN0XCIpO1xudmFyIGNyZWF0ZVBhZ2luYXRpb24gPSByZXF1aXJlKFwiLi9wYWdpbmF0aW9uXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2VkTGlzdChjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHRjb25maWcucGFnaW5hdGlvbiA9IGNvbmZpZy5wYWdpbmF0aW9uIHx8IHt9O1xuXHRjb25maWcucGFnaW5hdGlvbi5jdXJyZW50UGFnZSA9IGNvbmZpZy5wYWdpbmF0aW9uLmN1cnJlbnRQYWdlIHx8IDA7XG5cdGNvbmZpZy5wYWdpbmF0aW9uLml0ZW1zUGVyUGFnZSA9IGNvbmZpZy5wYWdpbmF0aW9uLml0ZW1zUGVyUGFnZSB8fCAwO1xuXG5cdHZhciBzdG9yZSA9IGNvbmZpZy5zdG9yZTtcblxuXHRzdG9yZS5sb2FkLmFmdGVyLmFkZChhZnRlckxvYWQpO1xuXG5cdHZhciBsaXN0ID0gY3JlYXRlTGlzdChjb25maWcpO1xuXHR2YXIgcGFnaW5hdGlvbiA9IGNyZWF0ZVBhZ2luYXRpb24oY29uZmlnLnBhZ2luYXRpb24pO1xuXHRsaXN0LnBhZ2luYXRpb24gPSBwYWdpbmF0aW9uO1xuXG5cdGZ1bmN0aW9uIHNldFNraXBBbmRMaW1pdCgpIHtcblx0XHR2YXIgY3VycmVudFBhZ2UgPSBwYWdpbmF0aW9uLmN1cnJlbnRQYWdlKCk7XG5cdFx0dmFyIGl0ZW1zUGVyUGFnZSA9IHBhZ2luYXRpb24uaXRlbXNQZXJQYWdlKCk7XG5cdFx0bGlzdC5za2lwKGN1cnJlbnRQYWdlICogaXRlbXNQZXJQYWdlKTtcblx0XHRsaXN0LmxpbWl0KGl0ZW1zUGVyUGFnZSk7XG5cdH1cblxuXHQvL3NldFNraXBBbmRMaW1pdCgpO1xuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHNldFNraXBBbmRMaW1pdCgpO1xuXHR9KTtcblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgY291bnQgPSBsaXN0LmNvdW50KCk7XG5cdFx0bGlzdC5wYWdpbmF0aW9uLm51bU9mSXRlbXMoY291bnQpO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBhZnRlckxvYWQoKSB7XG5cdFx0bGlzdC5pdGVtcyhbXSk7XG5cdH1cblxuXG5cdHJldHVybiBsaXN0O1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cdHZhciBudW1PZkl0ZW1zID0ga28ub2JzZXJ2YWJsZShjb25maWcubnVtT2ZJdGVtcyB8fCAwKTtcblx0dmFyIGl0ZW1zUGVyUGFnZSA9IGtvLm9ic2VydmFibGUoY29uZmlnLml0ZW1zUGVyUGFnZSB8fCAxMCk7XG5cblx0dmFyIG51bU9mUGFnZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgbnVtT2ZJdGVtc1ZhbCA9IG51bU9mSXRlbXMoKTtcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XG5cblx0XHRpZiAoIWl0ZW1zUGVyUGFnZVZhbCkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIE1hdGguY2VpbChudW1PZkl0ZW1zVmFsIC8gaXRlbXNQZXJQYWdlVmFsKTtcblx0fSk7XG5cblx0dmFyIGN1cnJlbnRQYWdlID0gKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUoLypub3JtYWxpemUqLyhjb25maWcuY3VycmVudFBhZ2UgfHwgMCkpOyAvL25vcm1hbGl6YXRpb24gbWlnaHQgYmUgcHJvYmxlbWF0aWMgd2hlbiB3ZSB3YW50IHRvIGxvYWQgdGhlIG50aCBwYWdlIHJpZ2h0IGFmdGVyIGxvYWRpbmcuXG5cblx0XHRmdW5jdGlvbiBub3JtYWxpemUodmFsdWUpIHtcblx0XHRcdGlmICh2YWx1ZSA8IDApIHtcblx0XHRcdFx0dmFsdWUgPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgcGFnZXNOdW0gPSBudW1PZlBhZ2VzKCk7XG5cdFx0XHRpZiAodmFsdWUgPj0gcGFnZXNOdW0pIHtcblx0XHRcdFx0dmFsdWUgPSBwYWdlc051bSAtIDE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoe1xuXHRcdFx0cmVhZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50UGFnZSgpO1xuXHRcdFx0fSxcblx0XHRcdHdyaXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRjdXJyZW50UGFnZShub3JtYWxpemUodmFsdWUpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSgpKTtcblxuXG5cdGZ1bmN0aW9uIG5leHQoKSB7XG5cdFx0Y3VycmVudFBhZ2UoY3VycmVudFBhZ2UoKSArIDEpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJldigpIHtcblx0XHRjdXJyZW50UGFnZShjdXJyZW50UGFnZSgpIC0gMSk7XG5cdH1cblxuXG5cdHZhciBwYWdlU2VsZWN0b3JzID0gKGZ1bmN0aW9uKGNvbmZpZykge1xuXHRcdHZhciBhZnRlckhlYWQgPSBjb25maWcuYWZ0ZXJIZWFkIHx8IDI7XG5cdFx0dmFyIGJlZm9yZVRhaWwgPSBjb25maWcuYmVmb3JlVGFpbCB8fCAyO1xuXHRcdHZhciBiZWZvcmVDdXJyZW50ID0gY29uZmlnLmJlZm9yZUN1cnJlbnQgfHwgMjtcblx0XHR2YXIgYWZ0ZXJDdXJyZW50ID0gY29uZmlnLmFmdGVyQ3VycmVudCB8fCAyO1xuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCwgaXNDdXJyZW50UGFnZSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGlkeCArIDEsXG5cdFx0XHRcdHNlbGVjdFBhZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGN1cnJlbnRQYWdlKGlkeCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlTm9uQ2xpY2thYmxlU2VsZWN0b3IobGFiZWwpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxhYmVsOiBsYWJlbCxcblx0XHRcdFx0c2VsZWN0UGFnZTogZnVuY3Rpb24oKSB7fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZWxlbWVudHMgPSBbXTtcblxuXHRcdFx0dmFyIG51bU9mUGFnZXNWYWwgPSBudW1PZlBhZ2VzKCk7XG5cdFx0XHR2YXIgY3VycmVudFBhZ2VWYWwgPSBjdXJyZW50UGFnZSgpO1xuXG5cdFx0XHR2YXIgbm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSBmYWxzZTtcblx0XHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG51bU9mUGFnZXNWYWw7IGlkeCArPSAxKSB7XG5cdFx0XHRcdGlmIChpZHggPD0gYWZ0ZXJIZWFkIHx8IGlkeCA+PSBudW1PZlBhZ2VzVmFsIC0gYmVmb3JlVGFpbCAtMSB8fCAoaWR4ID49IGN1cnJlbnRQYWdlVmFsIC0gYmVmb3JlQ3VycmVudCAmJiBpZHggPD0gY3VycmVudFBhZ2VWYWwgKyBhZnRlckN1cnJlbnQpKSB7XG5cdFx0XHRcdFx0dmFyIHBhZ2VTZWxlY3RvcjtcblxuXHRcdFx0XHRcdGlmIChpZHggPT09IGN1cnJlbnRQYWdlVmFsKSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihpZHggKyAxKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGFnZVNlbGVjdG9yID0gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZWxlbWVudHMucHVzaChwYWdlU2VsZWN0b3IpO1xuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCFub25DbGlja2FibGVJbnNlcnRlZCkge1xuXHRcdFx0XHRcdFx0ZWxlbWVudHMucHVzaChjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihcIi4uLlwiKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdFx0fSk7XG5cdH0oY29uZmlnKSk7XG5cblx0cmV0dXJuIHtcblx0XHRwYWdlU2VsZWN0b3JzOiBwYWdlU2VsZWN0b3JzLFxuXG5cdFx0bmV4dDogbmV4dCxcblx0XHRwcmV2OiBwcmV2LFxuXG5cdFx0Y3VycmVudFBhZ2U6IGN1cnJlbnRQYWdlLFxuXG5cdFx0bnVtT2ZJdGVtczogbnVtT2ZJdGVtcyxcblx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZSxcblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzXG5cdH07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVNvcnRlcihjb25maWcpIHtcblx0dmFyIHNvcnRCeSA9IGNvbmZpZy5zb3J0Qnk7XG5cdHZhciBkaXJlY3Rpb24gPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5kaXJlY3Rpb24gfHwgMCk7XG5cblx0dmFyIGNhbGxiYWNrID0gY29uZmlnLmNhbGxiYWNrO1xuXG5cblx0ZnVuY3Rpb24gYXNjKCkge1xuXHRcdGRpcmVjdGlvbigxKTtcblx0XHRjYWxsYmFjayhzb3J0QnksIGRpcmVjdGlvbigpKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRlc2MoKSB7XG5cdFx0ZGlyZWN0aW9uKC0xKTtcblx0XHRjYWxsYmFjayhzb3J0QnksIGRpcmVjdGlvbigpKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlc2V0KCkge1xuXHRcdGRpcmVjdGlvbigwKTtcblx0XHRjYWxsYmFjayhzb3J0QnksIGRpcmVjdGlvbigpKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QuZnJlZXplKHtcblx0XHRzb3J0Qnk6IHNvcnRCeSxcblxuXHRcdGRpcmVjdGlvbjogZGlyZWN0aW9uLFxuXG5cdFx0YXNjOiBhc2MsXG5cdFx0ZGVzYzogZGVzYyxcblxuXHRcdHJlc2V0OiByZXNldFxuXHR9KTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG52YXIgY3JlYXRlU29ydGVyID0gcmVxdWlyZShcIi4vc29ydGVyXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVNvcnRlcnNIYW5kbGVyKGNvbmZpZykge1xuXHR2YXIgc29ydGVycyA9IHt9O1xuXG5cdC8vZmlsdGVyc0hhbmRsZXIgY2FuIGJlIGltcGxlbWVudGVkIGluIGEgdmVyeSBzaW1pbGFyIHdheVxuXG5cdGZvciAodmFyIHByb3AgaW4gY29uZmlnLnNvcnRlcnMpIHtcblx0XHRzb3J0ZXJzW3Byb3BdID0gY3JlYXRlU29ydGVyKHtcblx0XHRcdHNvcnRCeTogcHJvcCxcblx0XHRcdGRpcmVjdGlvbjogY29uZmlnLnNvcnRlcnNbcHJvcF0sXG5cdFx0XHRjYWxsYmFjazogc2V0T3RoZXJzVG9aZXJvXG5cdFx0fSk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldE90aGVyc1RvWmVybyhzb3J0QnksIGRpcmVjdGlvbikge1xuXHRcdGZvciAodmFyIHByb3AgaW4gc29ydGVycykge1xuXHRcdFx0aWYgKHByb3AgPT09IHNvcnRCeSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdHNvcnRlcnNbcHJvcF0uZGlyZWN0aW9uKDApO1xuXHRcdH1cblx0fVxuXG5cdC8vZW5layBrw612w7xscmUga8OpbmUga2Vyw7xsbmllLCBhIGxpc3RiZS4uLlxuXHQvLyBhIHNvcnRlcnN0IGtlbGwgaXQgcHVibGlrw6FsbmkuXG5cdHZhciBzb3J0ZXJzQ29tcHV0ZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgc29ydGVyc09iaiA9IHt9O1xuXHRcdGZvciAodmFyIHByb3AgaW4gc29ydGVycykge1xuXHRcdFx0dmFyIGFjdERpciA9IHNvcnRlcnNbcHJvcF0uZGlyZWN0aW9uKCk7XG5cblx0XHRcdGlmIChhY3REaXIgIT09IDApIHtcblx0XHRcdFx0c29ydGVyc09ialtwcm9wXSA9IGFjdERpcjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gc29ydGVyc09iajtcblx0fSkuZXh0ZW5kKHt0aHJvdHRsZTogMX0pO1xuXG5cdHJldHVybiBzb3J0ZXJzQ29tcHV0ZWQ7XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjcmVhdGVNb2RlbE9iamVjdCA9IHJlcXVpcmUoXCIuL21vZGVsT2JqZWN0XCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZU1vZGVsKG9wdGlvbnMpIHtcblx0dmFyIGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuXG5cdC8vb3B0aW9ucy5maWVsZHMgc2hvdWxkIGJlIGFuIGFycmF5IG9mIG9iamVjdHNcblx0Ly90aGUgb2JqZWN0cyBzaG91bGQgZGVzY3JpYmUgdGhlIGZpZWxkczpcblx0Ly8gLSBuYW1lXG5cdC8vIC0gdHlwZVxuXHQvLyAtIHZhbGlkYXRvcnNcblx0Ly8gLSBtYXBwaW5nXG5cdC8vIC0gZGVmYXVsdFZhbHVlXG5cdC8vIC0gYmVmb3JlQ2hhbmdlXG5cdC8vIC0gYWZ0ZXJDaGFuZ2VcblxuXHR2YXIgcHJveHkgPSBvcHRpb25zLnByb3h5O1xuXHR2YXIgaWRGaWVsZCA9IG9wdGlvbnMuaWRGaWVsZDtcblxuXHRmdW5jdGlvbiBsaXN0KG9wdGlvbnMsIGNhbGxiYWNrKSB7XG5cdFx0cHJveHkucmVhZChvcHRpb25zLCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuXHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGRhdGEgPSBbXTtcblxuXHRcdFx0cmVzdWx0Lml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRkYXRhLnB1c2goY3JlYXRlTW9kZWxPYmplY3Qoe1xuXHRcdFx0XHRcdGZpZWxkczogZmllbGRzLFxuXHRcdFx0XHRcdHByb3h5OiBwcm94eSxcblx0XHRcdFx0XHRpZEZpZWxkOiBpZEZpZWxkLFxuXG5cdFx0XHRcdFx0ZGF0YTogaXRlbVxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dmFyIHJlc3VsdE9iaiA9IHtcblx0XHRcdFx0aXRlbXM6IGRhdGEsXG5cdFx0XHRcdGNvdW50OiByZXN1bHQuY291bnRcblx0XHRcdH07XG5cblx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdE9iaik7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBsb2FkKGlkLCBjYWxsYmFjaykge1xuXHRcdHByb3h5LnJlYWRPbmVCeUlkKGlkLCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuXHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIG1vZGVsT2JqZWN0ID0gY3JlYXRlTW9kZWxPYmplY3Qoe1xuXHRcdFx0XHRmaWVsZHM6IGZpZWxkcyxcblx0XHRcdFx0cHJveHk6IHByb3h5LFxuXHRcdFx0XHRpZEZpZWxkOiBpZEZpZWxkLFxuXG5cdFx0XHRcdGRhdGE6IHJlc3VsdFxuXHRcdFx0fSk7XG5cdFx0XHRjYWxsYmFjayhudWxsLCBtb2RlbE9iamVjdCk7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGUobW9kZWxWYWx1ZXMsIGNhbGxiYWNrKSB7XG5cdFx0cHJveHkuY3JlYXRlT25lKG1vZGVsVmFsdWVzLCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuXHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyKTtcblx0XHRcdH1cblxuXHRcdFx0Y2FsbGJhY2sobnVsbCwgY3JlYXRlTW9kZWxPYmplY3Qoe1xuXHRcdFx0XHRmaWVsZHM6IGZpZWxkcyxcblx0XHRcdFx0cHJveHk6IHByb3h5LFxuXHRcdFx0XHRpZEZpZWxkOiBpZEZpZWxkLFxuXG5cdFx0XHRcdGRhdGE6IHJlc3VsdFxuXHRcdFx0fSkpO1xuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdC5mcmVlemUoe1xuXHRcdGZpZWxkczogZmllbGRzLFxuXHRcdHByb3h5OiBwcm94eSxcblx0XHRpZEZpZWxkOiBpZEZpZWxkLFxuXG5cdFx0bGlzdDogbGlzdCxcblx0XHRsb2FkOiBsb2FkLFxuXHRcdGNyZWF0ZTogY3JlYXRlXG5cdH0pO1xufTsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGNyZWF0ZVByb3AgPSByZXF1aXJlKFwiLi9wcm9wXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZU1vZGVsT2JqZWN0KG9wdGlvbnMpIHtcblx0dmFyIGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuXHR2YXIgaWRGaWVsZCA9IG9wdGlvbnMuaWRGaWVsZDtcblx0dmFyIHByb3h5ID0gb3B0aW9ucy5wcm94eTtcblxuXHR2YXIgZGF0YSA9IHt9O1xuXG5cdGZvciAodmFyIHByb3AgaW4gZmllbGRzKSB7XG5cdFx0dmFyIGFjdEZpZWxkID0gZmllbGRzW3Byb3BdO1xuXHRcdHZhciBhY3RWYWx1ZSA9IG9wdGlvbnMuZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wKSA/IG9wdGlvbnMuZGF0YVtwcm9wXSA6IGFjdEZpZWxkLmRlZmF1bHRWYWx1ZTtcblxuXHRcdGNyZWF0ZVByb3AoZGF0YSwgcHJvcCwge1xuXHRcdFx0dmFsdWU6IGFjdFZhbHVlLFxuXHRcdFx0YmVmb3JlQ2hhbmdlOiBjcmVhdGVCZWZvcmVDaGFuZ2VGdW5jdGlvbihwcm9wKSxcblx0XHRcdGFmdGVyQ2hhbmdlOiBjcmVhdGVBZnRlckNoYW5nZUZ1bmN0aW9uKHByb3ApXG5cdFx0fSk7XG5cdH1cblxuXHR2YXIgb2JqID0ge1xuXHRcdGRhdGE6IGRhdGEsXG5cblx0XHRzYXZlOiBzYXZlLFxuXHRcdGRlc3Ryb3k6IGRlc3Ryb3lcblx0fTtcblxuXHRmdW5jdGlvbiBjcmVhdGVCZWZvcmVDaGFuZ2VGdW5jdGlvbihwcm9wTmFtZSkge1xuXHRcdHJldHVybiBmdW5jdGlvbiBiZWZvcmVDaGFuZ2UodmFsdWVzKSB7XG5cdFx0XHR2YWxpZGF0ZShwcm9wTmFtZSwgdmFsdWVzKTtcblxuXHRcdFx0dmFyIGZpZWxkID0gZmllbGRzW3Byb3BOYW1lXTtcblxuXHRcdFx0aWYgKGZpZWxkLmJlZm9yZUNoYW5nZSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIGZpZWxkLmJlZm9yZUNoYW5nZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVBZnRlckNoYW5nZUZ1bmN0aW9uKHByb3BOYW1lKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGFmdGVyQ2hhbmdlKHZhbHVlcykge1xuXHRcdFx0Ly9jYWxsIHRoZSBvbkNoYW5nZSBsaXN0ZW5lcnNcblx0XHR9O1xuXHR9XG5cblxuXHRmdW5jdGlvbiB2YWxpZGF0ZShwcm9wTmFtZSwgdmFsdWVzKSB7XG5cdFx0dmFyIGZpZWxkID0gZmllbGRzW3Byb3BOYW1lXTtcblxuXHRcdGlmICghZmllbGQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIWZpZWxkLnZhbGlkYXRvcnMpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNhdmUoY2FsbGJhY2spIHtcblx0XHR2YXIgaWQgPSBkYXRhW2lkRmllbGRdO1xuXHRcdHByb3h5LnVwZGF0ZU9uZUJ5SWQoaWQsIGRhdGEsIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiBjYWxsYmFjayhlcnIpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKHZhciBwcm9wIGluIHJlc3VsdCkge1xuXHRcdFx0XHRkYXRhW3Byb3BdID0gcmVzdWx0W3Byb3BdO1xuXHRcdFx0fVxuXG5cdFx0XHRjYWxsYmFjayhudWxsLCBvYmopO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly9kZWxldGVkIGZsYWc/XG5cdGZ1bmN0aW9uIGRlc3Ryb3koY2FsbGJhY2spIHtcblx0XHR2YXIgaWQgPSBmaWVsZHNbaWRGaWVsZF0uZ2V0KCk7XG5cdFx0cHJveHkuZGVzdHJveU9uZUJ5SWQoaWQsIGRhdGEsIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiBjYWxsYmFjayhlcnIpO1xuXHRcdFx0fVxuXG5cdFx0XHRjYWxsYmFjayhudWxsLCBvYmopO1xuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIG9iajtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQcm9wKG9iaiwgbmFtZSwgY29uZmlnKSB7XG5cdC8vc2hvdWxkIGJlIGNhbGxlZCBmaWVsZFxuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0dmFyIGluaXRpYWxWYWx1ZSA9IGNvbmZpZy52YWx1ZTtcblx0dmFyIHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuXHR2YXIgbGFzdFZhbHVlID0gdmFsdWU7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcblxuXHRcdHNldDogc2V0LFxuXHRcdGdldDogZ2V0XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHNldChuZXdWYWwpIHtcblx0XHRpZiAobmV3VmFsID09PSB2YWx1ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgY29uZmlnLmJlZm9yZUNoYW5nZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRjb25maWcuYmVmb3JlQ2hhbmdlKHtsYXN0VmFsdWU6IGxhc3RWYWx1ZSwgdmFsdWU6IHZhbHVlLCBuZXdWYWx1ZTogbmV3VmFsLCBpbml0aWFsVmFsdWU6IGluaXRpYWxWYWx1ZX0pO1xuXHRcdH1cblxuXHRcdGxhc3RWYWx1ZSA9IHZhbHVlO1xuXHRcdHZhbHVlID0gbmV3VmFsO1xuXG5cdFx0aWYgKHR5cGVvZiBjb25maWcuYWZ0ZXJDaGFuZ2UgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uZmlnLmFmdGVyQ2hhbmdlKHtsYXN0VmFsdWU6IGxhc3RWYWx1ZSwgdmFsdWU6IHZhbHVlLCBuZXdWYWx1ZTogbmV3VmFsLCBpbml0aWFsVmFsdWU6IGluaXRpYWxWYWx1ZX0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGdldCgpIHtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHRyZXR1cm4gb2JqO1xufTtcbiIsInZhciByZXF1ZXN0ID0gcmVxdWlyZShcInN1cGVyYWdlbnRcIik7XG5cbnZhciB0aW1lb3V0ID0gMTAwMDA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUmVzdFByb3h5KGNvbmZpZykge1xuXHR2YXIgaWRQcm9wZXJ0eSA9IGNvbmZpZy5pZFByb3BlcnR5O1xuXHR2YXIgZ2VuZXJhdGVJZCA9IGNvbmZpZy5nZW5lcmF0ZUlkO1xuXHR2YXIgcm91dGUgPSBjb25maWcucm91dGU7XG5cblx0ZnVuY3Rpb24gcmVhZChvcHRpb25zLCBjYWxsYmFjaykge1xuXHRcdGlmIChvcHRpb25zLmZpbmQpIHtcblx0XHRcdG9wdGlvbnMuZmluZCA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZmluZCk7XG5cdFx0fVxuXHRcdGlmIChvcHRpb25zLnNvcnQpIHtcblx0XHRcdG9wdGlvbnMuc29ydCA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuc29ydCk7XG5cdFx0fVxuXHRcdHJlcXVlc3Rcblx0XHRcdC5nZXQocm91dGUpXG5cdFx0XHQucXVlcnkob3B0aW9ucylcblx0XHRcdC50eXBlKFwiYXBwbGljYXRpb24vanNvblwiKVxuXHRcdFx0LmFjY2VwdChcImFwcGxpY2F0aW9uL2pzb25cIilcblx0XHRcdC50aW1lb3V0KHRpbWVvdXQpXG5cdFx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHQuYm9keSk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZU9uZShkYXRhLCBjYWxsYmFjaykge1xuXHRcdHJlcXVlc3Rcblx0XHRcdC5wb3N0KHJvdXRlKVxuXHRcdFx0LnNlbmQoZGF0YSlcblx0XHRcdC50eXBlKFwiYXBwbGljYXRpb24vanNvblwiKVxuXHRcdFx0LmFjY2VwdChcImFwcGxpY2F0aW9uL2pzb25cIilcblx0XHRcdC50aW1lb3V0KHRpbWVvdXQpXG5cdFx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHQuYm9keSk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlYWRPbmVCeUlkKGlkLCBjYWxsYmFjaykge1xuXHRcdHJlcXVlc3Rcblx0XHRcdC5nZXQocm91dGUgKyBpZClcblx0XHRcdC50eXBlKFwiYXBwbGljYXRpb24vanNvblwiKVxuXHRcdFx0LmFjY2VwdChcImFwcGxpY2F0aW9uL2pzb25cIilcblx0XHRcdC50aW1lb3V0KHRpbWVvdXQpXG5cdFx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHQuYm9keSk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZU9uZUJ5SWQoaWQsIG5ld0RhdGEsIGNhbGxiYWNrKSB7XG5cdFx0cmVxdWVzdFxuXHRcdFx0LnB1dChyb3V0ZSArIGlkKVxuXHRcdFx0LnNlbmQobmV3RGF0YSlcblx0XHRcdC50eXBlKFwiYXBwbGljYXRpb24vanNvblwiKVxuXHRcdFx0LmFjY2VwdChcImFwcGxpY2F0aW9uL2pzb25cIilcblx0XHRcdC50aW1lb3V0KHRpbWVvdXQpXG5cdFx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHQuYm9keSk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRlc3Ryb3lPbmVCeUlkKGlkLCBjYWxsYmFjaykge1xuXHRcdHJlcXVlc3Rcblx0XHRcdC5kZWwocm91dGUgKyBpZClcblx0XHRcdC50eXBlKFwiYXBwbGljYXRpb24vanNvblwiKVxuXHRcdFx0LmFjY2VwdChcImFwcGxpY2F0aW9uL2pzb25cIilcblx0XHRcdC50aW1lb3V0KHRpbWVvdXQpXG5cdFx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soZXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHQuYm9keSk7XG5cdFx0XHR9KTtcblx0fVxuXG5cblx0cmV0dXJuIE9iamVjdC5mcmVlemUoe1xuXHRcdGlkUHJvcGVydHk6IGlkUHJvcGVydHksXG5cdFx0Z2VuZXJhdGVJZDogZ2VuZXJhdGVJZCxcblxuXG5cdFx0cmVhZDogcmVhZCxcblxuXHRcdGNyZWF0ZU9uZTogY3JlYXRlT25lLFxuXG5cdFx0cmVhZE9uZUJ5SWQ6IHJlYWRPbmVCeUlkLFxuXHRcdHVwZGF0ZU9uZUJ5SWQ6IHVwZGF0ZU9uZUJ5SWQsXG5cdFx0ZGVzdHJveU9uZUJ5SWQ6IGRlc3Ryb3lPbmVCeUlkXG5cdH0pO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgY3JlYXRlUHJvcCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9wcm9wXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0b3JlKG9wdGlvbnMpIHtcblx0dmFyIG1vZGVsID0gb3B0aW9ucy5tb2RlbDtcblx0dmFyIHByb3h5ID0gbW9kZWwucHJveHk7XG5cblx0Ly92YXIgYXV0b0xvYWQ7XG5cdC8vdmFyIGF1dG9TeW5jO1xuXG5cblx0dmFyIHN0b3JlID0ge1xuXHRcdC8vZGF0YTogZGF0YSxcblx0XHRtb2RlbDogbW9kZWwsXG5cdFx0cHJveHk6IHByb3h5LFxuXG5cdFx0aXRlbXM6IFtdLFxuXHRcdGNvdW50OiAwLCBcblxuXHRcdHF1ZXJ5OiBxdWVyeSxcblx0XHRsb2FkOiBsb2FkLFxuXHRcdGFkZDogYWRkXG5cdH07XG5cblx0dmFyIHRyaWdnZXJRdWVyeUNoYW5nZWQgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHF1ZXJ5Q2hhbmdlZCA9IG51bGw7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIHRyaWdnZXJRdWVyeUNoYW5nZWQoKSB7XG5cdFx0XHRpZiAocXVlcnlDaGFuZ2VkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0cXVlcnlDaGFuZ2VkID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0bG9hZCgpO1xuXHRcdFx0XHRxdWVyeUNoYW5nZWQgPSBudWxsO1xuXHRcdFx0fSwgMCk7XG5cdFx0fTtcblx0fSgpKTtcblxuXHQvL21heWJlIHRoZXNlIHNob3VsZCBiZSBvbiBhIHNlcGFyYXRlIHF1ZXJ5IG9iamVjdC5cblx0Y3JlYXRlUHJvcChzdG9yZSwgXCJmaW5kXCIsIHtcblx0XHQvL2xhc3RWYWx1ZSwgdmFsdWUsIG5ld1ZhbHVlLCBpbml0aWFsVmFsdWVcblx0XHR2YWx1ZTogb3B0aW9ucy5maW5kIHx8IHt9LFxuXHRcdGJlZm9yZUNoYW5nZTogZnVuY3Rpb24odmFsdWVzKSB7XG5cblx0XHR9LFxuXHRcdGFmdGVyQ2hhbmdlOiB0cmlnZ2VyUXVlcnlDaGFuZ2VkXG5cdH0pO1xuXG5cdC8vYWxzbywgZmluZCBhbmQgc29ydCBwcm9wZXJ0aWVzIGFyZSBub3QgdmVyeSBnb29kIGFzIHNpbXBsZSBwcm9wcy4uLiBUaGV5IHNob3VsZCBiZSBcInByb3BPYmplY3RzXCIgb3Igc29tZXRoaW5nLi4uXG5cdC8vdGhhdCB3YXkgdGhlaXIgZmllbGRzJyBjaGFuZ2VzIHdvdWxkIGJlIHRyaWdnZXJlZCBhcyB3ZWxsLlxuXHRjcmVhdGVQcm9wKHN0b3JlLCBcInNvcnRcIiwge1xuXHRcdHZhbHVlOiBvcHRpb25zLnNvcnQgfHwge2lkOiAtMX0sXG5cdFx0YmVmb3JlQ2hhbmdlOiBmdW5jdGlvbih2YWx1ZXMpIHtcblx0XHR9LFxuXHRcdGFmdGVyQ2hhbmdlOiB0cmlnZ2VyUXVlcnlDaGFuZ2VkXG5cdH0pO1xuXG5cdGNyZWF0ZVByb3Aoc3RvcmUsIFwic2tpcFwiLCB7XG5cdFx0dmFsdWU6IG9wdGlvbnMuc2tpcCB8fCAwLFxuXHRcdGJlZm9yZUNoYW5nZTogZnVuY3Rpb24odmFsdWVzKSB7XG5cblx0XHR9LFxuXHRcdGFmdGVyQ2hhbmdlOiB0cmlnZ2VyUXVlcnlDaGFuZ2VkXG5cdH0pO1xuXG5cdGNyZWF0ZVByb3Aoc3RvcmUsIFwibGltaXRcIiwge1xuXHRcdHZhbHVlOiBvcHRpb25zLmxpbWl0IHx8IDEwLFxuXHRcdGJlZm9yZUNoYW5nZTogZnVuY3Rpb24odmFsdWVzKSB7XG5cblx0XHR9LFxuXHRcdGFmdGVyQ2hhbmdlOiB0cmlnZ2VyUXVlcnlDaGFuZ2VkXG5cdH0pO1xuXG5cblxuXHQvL3ZhciBncm91cCA9IFwiP2dvb2QgcXVlc3Rpb24/XCI7XG5cblx0Ly92YXIgYnVmZmVyZWQ7XG5cblx0Ly92YXIgcmVtb3RlRmlsdGVyO1xuXHQvL3ZhciByZW1vdGVHcm91cDtcblx0Ly92YXIgcmVtb3RlU29ydDtcblxuXG5cdC8vdmFyIGFjdFBhZ2UgPSBvcHRpb25zLmFjdFBhZ2UgfHwgMDtcblx0Ly92YXIgbnVtT2ZJdGVtcyA9IDA7XG5cdC8vdmFyIG51bU9mUGFnZXMgPSAwO1xuXG5cdC8vbW9kZWwgaW5zdGFuY2VzIHNob3VsZCBiZSBzdG9yZWQgc29tZXdoZXJlIGJ5IGlkIGFzIHdlbGwuXG5cdC8vaW4gdGhlIGRhdGEgYXJyYXksIHRoZXJlIHNob3VsZCBiZSByZWZlcmVuY2VzIHRvIHRob3NlIGluc3RhbmNlcy4uLiBhbHRob3VnaCBpdCB3b3VsZCBiZSBjb21wbGljYXRlZCB3aGVuIGxvYWRlZCBmcm9tIGxvY2FsU3RvcmFnZS5cblx0Ly9tYXliZSB3ZSBzaG91bGQgc3RvcmUgb25seSB0aGUgaWQtcyBvZiB0aGUgZWxlbWVudHMgaW4gdGhlIGRhdGEgYXJyYXkuLi5cblx0Ly92YXIgcHJlZmV0Y2hlZERhdGEgPSB7XG5cdC8vXHRcIntzb3J0ZXJzOiB7aWQ6IDF9LCBmaWx0ZXJzOiB7fVwiOiBbe3NraXA6IDAsIGlkczogW119XVxuXHQvL307XG5cdC8vdmFyIHByZWZldGNoZWREYXRhU3RvcmFnZSA9IFtdO1xuXG5cdC8vZnVuY3Rpb24gZ2V0RGF0YSgpIHtcblx0Ly9cdHJldHVybiBwcmVmZXRjaGVkRGF0YVtjdXJyZW50UGFnZV0uZGF0YTtcblx0Ly99XG5cblxuXHQvL3NraXAgYW5kIGxpbWl0IHNob3VsZCBiZSBwcm9wZXJ0aWVzIGFzIHdlbGxcblx0Ly9pZiBza2lwLCBsaW1pdCwgZmluZCBvciBzb3J0IGNoYW5nZXMsIHRoZW4gdGhlIGxvYWQgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgYXV0b21hdGljYWxseS5cblxuXG5cdC8vZXZlcnkgbG9hZCBjYWxsIHNob3VsZCBoYXZlIGFuIGlkLlxuXHQvL3RoaXMgd2F5IHdlIGNhbiBzZXQgdXBcblx0ZnVuY3Rpb24gcXVlcnkocXVlcnlPYmosIGNhbGxiYWNrKSB7XG5cdFx0bW9kZWwubGlzdChxdWVyeU9iaiwgZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcblx0XHRcdGNhbGxiYWNrKGVyciwgcmVzdWx0KTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGxvYWQoKSB7XG5cdFx0dmFyIHF1ZXJ5T2JqID0ge1xuXHRcdFx0ZmluZDogc3RvcmUuZmluZCxcblx0XHRcdHNvcnQ6IHN0b3JlLnNvcnQsXG5cdFx0XHRza2lwOiBzdG9yZS5za2lwLFxuXHRcdFx0bGltaXQ6IHN0b3JlLmxpbWl0XG5cdFx0fTtcblxuXHRcdGxvYWQuYmVmb3JlKHF1ZXJ5T2JqKTtcblxuXHRcdHF1ZXJ5KHF1ZXJ5T2JqLCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuXHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRyZXR1cm4gbG9hZC5hZnRlcihlcnIpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdG9yZS5pdGVtcy5sZW5ndGggPSAwO1xuXHRcdFx0c3RvcmUuaXRlbXMubGVuZ3RoID0gcmVzdWx0Lml0ZW1zLmxlbmd0aDtcblx0XHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHJlc3VsdC5pdGVtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0XHRcdHN0b3JlLml0ZW1zW2lkeF0gPSByZXN1bHQuaXRlbXNbaWR4XTtcblx0XHRcdH1cblx0XHRcdHN0b3JlLmNvdW50ID0gcmVzdWx0LmNvdW50O1xuXG5cdFx0XHRsb2FkLmFmdGVyKG51bGwsIHJlc3VsdCk7XG5cdFx0fSk7XG5cdH1cblxuXHRsb2FkLmJlZm9yZSA9IGNyZWF0ZUNhbGxiYWNrQXJyYXlDYWxsZXIoc3RvcmUsIFtdKTsgLy9sYXRlciB3ZSBjYW4gYWRkIGRlZmF1bHQgY2FsbGJhY2tzXG5cdGxvYWQuYWZ0ZXIgPSBjcmVhdGVDYWxsYmFja0FycmF5Q2FsbGVyKHN0b3JlLCBbXSk7XG5cblx0ZnVuY3Rpb24gY3JlYXRlQ2FsbGJhY2tBcnJheUNhbGxlcih0aGlzQXJnLCBhcnJheSkge1xuXHRcdGZ1bmN0aW9uIGNhbGxiYWNrQXJyYXlDYWxsZXIoZXJyKSB7XG5cdFx0XHRhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGFjdEZ1bmN0aW9uKSB7XG5cdFx0XHRcdGFjdEZ1bmN0aW9uLmNhbGwodGhpc0FyZywgZXJyKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGNhbGxiYWNrQXJyYXlDYWxsZXIuYWRkID0gZnVuY3Rpb24oZnVuYykge1xuXHRcdFx0aWYgKHR5cGVvZiBmdW5jICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRhcnJheS5wdXNoKGZ1bmMpO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gY2FsbGJhY2tBcnJheUNhbGxlcjtcblx0fVxuXG5cblx0ZnVuY3Rpb24gYWRkKGRhdGEsIGNhbGxiYWNrKSB7XG5cdFx0bW9kZWwuY3JlYXRlKGRhdGEsIGNhbGxiYWNrKTtcblx0fVxuXG5cblx0XG5cblx0cmV0dXJuIHN0b3JlO1xufTtcbiJdfQ==
