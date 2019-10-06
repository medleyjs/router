/* eslint-disable no-console */
'use strict';

const Benchmark = require('benchmark');
const Router = require('../Router');

const routes = [
  '/',
  '/user',
  '/user/:userID',
  '/user/:userID/posts',
  '/static/js/*',
  '/static/*',
  '/api/login',
  '/api/projects',
  '/api/people',
  '/api/postings',
  '/api/postings/details',
  '/api/postings/details/misc',
  '/api/postings/details/misc/many',
  '/api/postings/details/misc/many/nodes',
  '/api/postings/details/misc/many/nodes/deep',
  '/api/posts',
  '/api/posts/:postID',
  '/api/posts/:postID/comments',
  '/api/posts/:postID/comments/:commentID',
  '/medium/length/',
  '/very/very/long/long/route/route/path',
];
const testURLs = [
  '/',
  '/use',
  '/user',
  '/user/0123456789',
  '/user/0123456789012345678901234567890123456789',
  '/user/0123456789/posts',
  '/static/js/common.js',
  '/static/json/config.json',
  '/static/css/styles.css',
  '/static/',
  '/api/login',
  '/api/postings/details/misc/many/nodes/deep',
  '/api/posts/0123456789',
  '/api/posts/0123456789/comments',
  '/api/posts/0123456789/comments/0123456789',
  '/medium/length/',
  '/very/very/long/long/route/route/path',
  '/404-not-found',
  // With query string
  '/?q',
  '/use?q',
  '/user?q',
  '/user/0123456789?q',
  '/user/0123456789?querystringisreallyreallylong',
  '/static/css/styles.css?q',
  '/404-not-found?q',
];

const router = new Router();

for (const route of routes) {
  router.register(route);
}

const benchSuite = new Benchmark.Suite();

for (const url of testURLs) {
  benchSuite.add(url + ' ', () => router.find(url));
}

benchSuite.on('cycle', (event) => {
  console.log(String(event.target));
}).run();
