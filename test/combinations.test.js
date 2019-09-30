'use strict';

const assert = require('assert').strict;
const createRouter = require('./helpers/createRouter');
const expectedRoute = require('./helpers/expectedRoute');

describe('Router with combinations of route types', () => {

  it('matches static routes, then parametric routes, then wildcard routes', () => {
    const router = createRouter([
      '/',
      '/:folder',
      '/*',
      '/user',
      '/user/:id',
      '/user/:id/posts',
      '/user/*',
    ]);

    assert.deepEqual(
      router.find('/'),
      expectedRoute('/')
    );
    assert.deepEqual(
      router.find('/js'),
      expectedRoute('/:folder', {folder: 'js'})
    );
    assert.deepEqual(
      router.find('/js/'),
      expectedRoute('/*', {'*': 'js/'})
    );
    assert.deepEqual(
      router.find('/js/webpack'),
      expectedRoute('/*', {'*': 'js/webpack'})
    );
    assert.deepEqual(
      router.find('/user'),
      expectedRoute('/user')
    );
    assert.deepEqual(
      router.find('/user/123'),
      expectedRoute('/user/:id', {id: '123'})
    );
    assert.deepEqual(
      router.find('/user/123/posts'),
      expectedRoute('/user/:id/posts', {id: '123'})
    );
    assert.deepEqual(
      router.find('/user/123/comments'),
      expectedRoute('/user/*', {'*': '123/comments'})
    );
  });

  it('matches parametric routes and wildcard routes that share a common prefix with static routes', () => {
    const router = createRouter([
      '/user/me',
      '/user/:id',
      '/user/:id/posts',
      '/user/*',
    ]);

    assert.deepEqual(
      router.find('/user/me'),
      expectedRoute('/user/me', {})
    );
    assert.deepEqual(
      router.find('/user/m'),
      expectedRoute('/user/:id', {id: 'm'})
    );
    assert.deepEqual(
      router.find('/user/mee'),
      expectedRoute('/user/:id', {id: 'mee'})
    );
    assert.deepEqual(
      router.find('/user/me/posts'),
      expectedRoute('/user/:id/posts', {id: 'me'})
    );
    assert.deepEqual(
      router.find('/user/me/p'),
      expectedRoute('/user/*', {'*': 'me/p'})
    );
    assert.deepEqual(
      router.find('/user/me/post'),
      expectedRoute('/user/*', {'*': 'me/post'})
    );
    assert.deepEqual(
      router.find('/user/me/posts/comments'),
      expectedRoute('/user/*', {'*': 'me/posts/comments'})
    );
  });

});
