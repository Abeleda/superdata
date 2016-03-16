# superdata

## Overview
 - what is superdata yo.
  - extjs' datalayer motivated
  - changable yo
  - can work together with any client side frameworks.

  - Store -> Model -> Proxy

## Store

The store should be used by other modules which are related to listing somehow. Think about paged lists (lists with paginations), infinite scrolling, lists with filtering and sorting.

You can add new entries to your store or you can trigger the store to load by setting one of (or all of) its following properties:
 - find
 - sort
 - skip
 - limit

It will load the elements into the items array. You hook to the store's load functionality in the following way.

```javascript
var store = superData.store.store({
	model: model //let's assume we have a model already
});

store.load.before.add(function() {
	console.log("pre hook");
});

store.load.after.add(function() {
	console.log(store.items);
});
```

If you throw an exception in the before hook, then you can prevent the store from loading.

## Model
 - model
 - modelObject

## Proxy
Proxies are responsible for reading and writing data. You could as where they write and from where they read. Well, it's totally dependent on the proxy, it can send the data to a server or just read it from the memory. It's dependent on the implemantation of the actual prody. The common thing in proxies that they implement the following functions:

function name | params
---|---
read | query, callback
createOne | data, callback
readOneById | id, callback
updateOneById | id, data, callback
destroyOneById | id, callback

As you can see, these functions are responsible for CRUD operations, their functionality is quite self-explanatory. The callback functions will be passed two parameters on every invocation, the first is an error string or object, the second is the returned data. The id is always the identifier of the resource and the data is a json object. (Although there will be proxies later where it can be multipart data...)

### Memory proxy

The memory proxy simply stores everything in the memory. You can use it on both the server and the client side.

### Ajax proxy

The ajax proxy makes HTTP calls to certain urls based on its configuration. You can define query mappings, namely you can define the way how the find, sort, skip and limit properties should be mapped to the query string of the request. You can also define custom query string properties, which will be added to the query string of all of the HTTP calls.

### REST proxy

!!! REST proxy should be refactored to be a wrapper around ajax proxy !!!

## Example

```javascript
var superData = require("superdata");

var createProxy = superData.proxy.ajax;
var createModel = superData.model.model;
var createStore = superData.store.store;

var proxy = createProxy({
	operations: {
		read: {
			route: "http://localhost:7357/user",
			method: "GET"
		},
		createOne: {
			route: "http://localhost:7357/user",
			method: "POST"
		},
		readOneById: {
			route: "http://localhost:7357/user/:id",
			method: "GET"
		},
		updateOneById: {
			route: "http://localhost:7357/user/:id",
			method: "PUT"
		},
		destroyOneById: {
			route: "http://localhost:7357/user/:id",
			method: "DELETE"
		}
	}
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
	idField: "id",
	proxy: proxy
});
var store = createStore({
	model: model
});

//* seed
store.load.after.add(function() {
	console.log(store.items);
});

var seed = true;
function handleResponse() {
	console.log(err, result);
}
if (seed) {
	var names = ["Bob", "Rob", "Olga", "Helga"];
	var titles = ["CEO", "CTO", "Ninja"];
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

store.find = {email: /bob/gi};
store.sort = {name: -1};
store.skip = 0;
store.limit = 10; //by setting this, you will trigger a load on the store.
```

For easier testing, you can change the proxy in the example above to a memory proxy, so you won't need any server side code. That is one of the coolest things in superdata's that you can change the proxy any time, since proxies give the very same interface to you.



## Further developments
 - cached store (caches in memory), cached store (in localStorage)
 - model validation
 - localStorage proxy
 - server side:
 	- mongodb proxy
 	- file proxy
 	- s3 proxy
 	- azure proxy
 	- rest route generator for nodejs.
 - model unification for client & server
