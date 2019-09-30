'use strict';

const assert = require('assert').strict;
const createRouter = require('./helpers/createRouter');
const expectedRoute = require('./helpers/expectedRoute');

describe('Router with static routes', () => {

  it('supports a route at the root URL', () => {
    const router = createRouter(['/']);
    assert.deepEqual(router.find('/'), expectedRoute('/'));
    assert.equal(router.find('/other/'), null);
  });

  it('supports a route at the root URL while there are other routes', () => {
    const router = createRouter([
      '/',
      '/a',
      '/a/b',
      '/:param',
      '/:param/post',
      '/*',
    ]);
    assert.deepEqual(router.find('/'), expectedRoute('/'));
  });

  it('supports many static paths', () => {
    const router = createRouter([
      '/',
      '/a',
      '/b/',
      '/c',
      '/cd',
      '/d/',
      '/d/e',
      '/hello-world',
      '/hello-there',
      '/hello-things',
      '/verylongroutepath',
      '/static/js',
      '/static/', // Create shorter route second
    ]);

    assert.deepEqual(router.find('/'), expectedRoute('/'));
    assert.deepEqual(router.find('/a'), expectedRoute('/a'));
    assert.deepEqual(router.find('/b/'), expectedRoute('/b/'));
    assert.deepEqual(router.find('/c'), expectedRoute('/c'));
    assert.deepEqual(router.find('/cd'), expectedRoute('/cd'));
    assert.deepEqual(router.find('/d/'), expectedRoute('/d/'));
    assert.deepEqual(router.find('/d/e'), expectedRoute('/d/e'));
    assert.deepEqual(router.find('/hello-world'), expectedRoute('/hello-world'));
    assert.deepEqual(router.find('/hello-there'), expectedRoute('/hello-there'));
    assert.deepEqual(router.find('/hello-things'), expectedRoute('/hello-things'));
    assert.deepEqual(router.find('/verylongroutepath'), expectedRoute('/verylongroutepath'));
    assert.deepEqual(router.find('/static/js'), expectedRoute('/static/js'));
    assert.deepEqual(router.find('/static/'), expectedRoute('/static/'));

    assert.equal(router.find('/a/'), null);
    assert.equal(router.find('/b'), null);
    assert.equal(router.find('/d'), null);
    assert.equal(router.find('/e'), null);
    assert.equal(router.find('/h'), null);
    assert.equal(router.find('/hello'), null);
    assert.equal(router.find('/hello-'), null);
    assert.equal(router.find('/hello-th'), null);
    assert.equal(router.find('/verylongroutepass'), null);
  });

  it('supports matching URLs with a query string', () => {
    const router = createRouter([
      '/',
      '/a',
      '/b/',
      '/c',
      '/cd',
      '/d/',
      '/d/e',
      '/hello-world',
      '/hello-there',
      '/hello-things',
      '/static/js',
      '/static/',
    ]);

    assert.deepEqual(router.find('/?'), expectedRoute('/'));
    assert.deepEqual(router.find('/a?'), expectedRoute('/a'));
    assert.deepEqual(router.find('/b/?'), expectedRoute('/b/'));
    assert.deepEqual(router.find('/c?'), expectedRoute('/c'));
    assert.deepEqual(router.find('/cd?'), expectedRoute('/cd'));
    assert.deepEqual(router.find('/d/?'), expectedRoute('/d/'));
    assert.deepEqual(router.find('/d/e?'), expectedRoute('/d/e'));
    assert.deepEqual(router.find('/hello-world?'), expectedRoute('/hello-world'));
    assert.deepEqual(router.find('/hello-there?'), expectedRoute('/hello-there'));
    assert.deepEqual(router.find('/hello-things?'), expectedRoute('/hello-things'));
    assert.deepEqual(router.find('/static/js?'), expectedRoute('/static/js'));
    assert.deepEqual(router.find('/static/?foo=bar'), expectedRoute('/static/'));
  });

});
