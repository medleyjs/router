'use strict';

const assert = require('assert').strict;
const createRouter = require('./helpers/createRouter');
const expectedRoute = require('./helpers/expectedRoute');

describe('Router with parametric routes', () => {

  it('throws if overlapping parameters have different names', () => {
    const router = createRouter([
      '/:subsystem',
      '/user/:id',
      '/user/:id/comment',
    ]);

    assert.throws(() => router.register('/:sub', {}), /route already exists with a different parameter name/);
    assert.throws(() => router.register('/:sub/', {}), /route already exists with a different parameter name/);
    assert.throws(() => router.register('/user/:userID', {}), /route already exists with a different parameter name/);
    assert.throws(() => router.register('/user/:userID/posts', {}), /route already exists with a different parameter name/);
  });

  it('supports a parameter at the root', () => {
    const router = createRouter(['/:id']);

    assert.deepEqual(router.find('/1'), expectedRoute('/:id', {id: '1'}));
    assert.deepEqual(router.find('/123'), expectedRoute('/:id', {id: '123'}));

    assert.equal(router.find('/'), null, 'Parameters cannot be empty');
    assert.equal(router.find('/123/'), null, 'Parameters cannot include the path separator');
  });

  it('supports a parameter at the end of the URL', () => {
    const router = createRouter(['/user/:id']);

    assert.deepEqual(router.find('/user/1'), expectedRoute('/user/:id', {id: '1'}));
    assert.deepEqual(router.find('/user/123'), expectedRoute('/user/:id', {id: '123'}));

    assert.equal(router.find('/user'), null, 'Parameters cannot be empty');
    assert.equal(router.find('/user/123/'), null, 'Parameters cannot include the path separator');
  });

  it('supports parameters in the middle of the URL', () => {
    const router = createRouter([
      '/:subsystem/edit',
      '/:subsystem/view',
      '/user/:id/comment',
      '/user/:id/comments',
    ]);

    assert.deepEqual(
      router.find('/1/edit'),
      expectedRoute('/:subsystem/edit', {subsystem: '1'})
    );
    assert.deepEqual(
      router.find('/123/edit'),
      expectedRoute('/:subsystem/edit', {subsystem: '123'})
    );

    assert.deepEqual(
      router.find('/user/1/comment'),
      expectedRoute('/user/:id/comment', {id: '1'})
    );
    assert.deepEqual(
      router.find('/user/123/comments'),
      expectedRoute('/user/:id/comments', {id: '123'})
    );

    assert.equal(router.find('//edit'), null, 'Parameters cannot be empty');
    assert.equal(router.find('/user//comment'), null, 'Parameters cannot be empty');
  });

  it('supports parameters with and without a postfix', () => {
    const router = createRouter([
      '/:subsystem',
      '/:subsystem/edit',
      '/user/:id/comment',
      '/user/:id', // Create without postfix after route with postfix
    ]);

    assert.deepEqual(
      router.find('/abc'),
      expectedRoute('/:subsystem', {subsystem: 'abc'})
    );
    assert.deepEqual(
      router.find('/abc/edit'),
      expectedRoute('/:subsystem/edit', {subsystem: 'abc'})
    );

    assert.deepEqual(
      router.find('/user/1/comment'),
      expectedRoute('/user/:id/comment', {id: '1'})
    );
    assert.deepEqual(
      router.find('/user/123'),
      expectedRoute('/user/:id', {id: '123'})
    );
  });

  it('supports matching URLs with a query string', () => {
    const router = createRouter([
      '/:subsystem',
      '/user/:id',
      '/events/:type',
      '/events/:type/subtypes',
    ]);

    assert.deepEqual(
      router.find('/js?'),
      expectedRoute('/:subsystem', {subsystem: 'js'})
    );
    assert.deepEqual(
      router.find('/js?foo=bar'),
      expectedRoute('/:subsystem', {subsystem: 'js'})
    );
    assert.deepEqual(
      router.find('/user/123?'),
      expectedRoute('/user/:id', {id: '123'})
    );
    assert.deepEqual(
      router.find('/events/change?'),
      expectedRoute('/events/:type', {type: 'change'})
    );
    assert.deepEqual(
      router.find('/events/change/subtypes?'),
      expectedRoute('/events/:type/subtypes', {type: 'change'})
    );
  });

  it('supports matching URLs with a slash in the query string', () => {
    const router = createRouter([
      '/:subsystem',
      '/user/:id',
      '/events/:type/subtypes',
    ]);

    assert.deepEqual(
      router.find('/js?redirect=/'),
      expectedRoute('/:subsystem', {subsystem: 'js'})
    );
    assert.deepEqual(
      router.find('/user/123?redirect=/'),
      expectedRoute('/user/:id', {id: '123'})
    );
    assert.deepEqual(
      router.find('/events/change/subtypes?redirect=/'),
      expectedRoute('/events/:type/subtypes', {type: 'change'})
    );
  });

});
