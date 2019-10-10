# @medley/router

[![npm Version](https://img.shields.io/npm/v/@medley/router.svg)](https://www.npmjs.com/package/@medley/router)
[![Build Status](https://travis-ci.org/medleyjs/router.svg?branch=master)](https://travis-ci.org/medleyjs/router)
[![Coverage Status](https://coveralls.io/repos/github/medleyjs/router/badge.svg?branch=master)](https://coveralls.io/github/medleyjs/router?branch=master)
[![dependencies Status](https://img.shields.io/david/medleyjs/router.svg)](https://david-dm.org/medleyjs/router)

A high-performance URL router for JavaScript/Node.js.

### Features

+ Currently the fastest JavaScript router implementations out there ([see benchmarks](https://github.com/medleyjs/router-benchmark))
+ Supports multiple routes with the same prefix as dynamic routes ([see here for details](#path-match-order))
+ Only handles routing the URL, so it’s very flexible for building features on top of it
  + e.g. This makes it easy to support `405 Method Not Allowed` responses

## Installation

```sh
npm install @medley/router
# or
yarn add @medley/router
```

## API

### `new Router([options])`

+ `options` (*object*) - Optional object that may have any of the following options:
  + `storeFactory` (*function*) - Called when a new route is registered to create the route store.
    + Default: `() => Object.create(null)`

Constructs a new router instance.

```js
const Router = require('@medley/router');
const router = new Router();
```

Use the `storeFactory` option to customize the route store object.

```js
const Router = require('@medley/router');

const router = new Router({
  storeFactory() {
    return { handlers: new Map(), middlewares: [] };
  }
});

const store = router.register('/');
console.log(store); // { handlers: Map {}, middlewares: [] }
```

### `router.register(path)`

+ `path` (*string*) - The route path.
+ Returns: *object* - The route store.

Registers a route and returns the route store object.<br>
If the route path has already been registered, the route store is simply returned.

```js
const Router = require('@medley/router');
const router = new Router();

const store = router.register('/users/:id');
console.log(store); // [Object: null prototype] {}
```

HTTP example:

```js
const Router = require('@medley/router');
const router = new Router();

function addRoute(method, path, handler) {
  const store = router.register(path);
  store[method] = handler;
}

addRoute('GET', '/', () => { /* ... */});
addRoute('GET', '/users', () => { /* ... */});
addRoute('POST', '/users', () => { /* ... */});
```

#### Path Formats

##### 1. Static

Static routes match exactly the path provided.

```
/
/about
/api/login
```

##### 2. Parametric

Path segments that begin with a `:` denote a parameter and will match anything
up to the next `/` or to the end of the path.

```
/users/:userID
/users/:userID/posts
/users/:userID/posts/:postID
```

Everything after the `:` character will be the name of the parameter in the
route `params` object.

```js
router.register('/users/:userID');

const route = router.find('/users/100');
console.log(route.params); // { userID: '100' }
```

If multiple routes have a parameter in the same part of the route, the
parameter names must be the same. For example, registering the following two
routes would be an error because the `:id` and `:userID` parameters conflict
with each other:

```
/users/:id
/users/:userID/posts
```

Parameters may start anywhere in the path. For example, the following are valid routes:

```js
'/api/v:version' // Matches '/api/v1'
'/on-:event'     // Matches '/on-click'
```

##### 3. Wildcard

Routes that end with a `*` are wildcard routes. The `*` will match any
characters in the rest of the path, including `/` characters or no characters.

For example, the following route:

```
/static/*
```

will match all of these URLs:

```
/static/
/static/favicon.ico
/static/js/main.js
/static/css/vendor/bootstrap.css
```

The wildcard value will be set in the route `params` object with `'*'` as the key.

```js
router.register('/static/*');

let route = router.find('/static/favicon.ico');
console.log(route.params); // { '*': 'favicon.ico' }

route = router.find('/static/');
console.log(route.params); // { '*': '' }
```

### `router.find(url)`

+ `url` (*string*) - The URL used to find a matching route.
+ Returns: (*{store: object, params: object}* | *null*) - The route store and matching parameters, or `null` if the URL did not match any registered routes.

Finds a route that matches the provided URL. Returns `null` if no route matches the URL.

```js
const Router = require('@medley/router');
const router = new Router();

function addRoute(method, path, handler) {
  const store = router.register(path);
  store[method] = handler;
}

addRoute('GET', '/', () => {});
addRoute('GET', '/users', () => {});
addRoute('POST', '/users', () => {});
addRoute('GET', '/users/:id', () => {});
addRoute('GET', '/static/*', () => {});

router.find('/');
// {
//   store: { GET: [Function] },
//   params: {}
// }

router.find('/users');
// {
//   store: { GET: [Function], POST: [Function] },
//   params: {}
// }

router.find('/users/100');
// {
//   store: { GET: [Function] },
//   params: { id: '100'}
// }

router.find('/static/js/common.js');
// {
//   store: { GET: [Function] },
//   params: { '*': 'js/common.js' }
// }

router.find('/not-defined');
// null
```

#### Path Match Order

This router allows different types of routes with the same prefix to overlap.
Overlapping routes will match in the following order:

1. Static
2. Parametric
3. Wildcard

For example, with the following routes defined:

```
/static/favicon.ico
/static/:hash/webpack/*
/static/*
```

incoming URLs will be matched like this:

```js
'/static/favicon.ico'
// Matches '/static/favicon.ico'

'/static/00a8b09d8ef/webpack/runtime.js'
'/static/00a8b09d8ef/webpack/css/common.css'
// Matches '/static/:hash/webpack/*'

'/static/vendor/css/bootstrap.css'
'/static/images/header.jpg'
// Matches '/static/*'
```
