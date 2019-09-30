'use strict';

const assert = require('assert').strict;
const createRouter = require('./helpers/createRouter');
const expectedRoute = require('./helpers/expectedRoute');

describe('Router with wildcard routes', () => {

  it('supports a wildcard at the root', () => {
    const router = createRouter(['/*']);

    assert.deepEqual(router.find('/'), expectedRoute('/*', {'*': ''}));
    assert.deepEqual(router.find('/1'), expectedRoute('/*', {'*': '1'}));
    assert.deepEqual(router.find('/123'), expectedRoute('/*', {'*': '123'}));
    assert.deepEqual(router.find('/js/'), expectedRoute('/*', {'*': 'js/'}));
    assert.deepEqual(router.find('/js/common.js'), expectedRoute('/*', {'*': 'js/common.js'}));
  });

  it('supports a wildcard in a separate path segment', () => {
    const router = createRouter(['/static/*']);

    assert.deepEqual(router.find('/static/'), expectedRoute('/static/*', {'*': ''}));
    assert.deepEqual(router.find('/static/1'), expectedRoute('/static/*', {'*': '1'}));
    assert.deepEqual(router.find('/static/123'), expectedRoute('/static/*', {'*': '123'}));
    assert.deepEqual(router.find('/static/js/'), expectedRoute('/static/*', {'*': 'js/'}));
    assert.deepEqual(router.find('/static/js/common.js'), expectedRoute('/static/*', {'*': 'js/common.js'}));

    assert.equal(router.find('/static'), null);
  });

  it('supports matching URLs with a query string', () => {
    const router = createRouter([
      '/*',
      '/static/*',
    ]);

    assert.deepEqual(router.find('/?'), expectedRoute('/*', {'*': ''}));
    assert.deepEqual(router.find('/?foo'), expectedRoute('/*', {'*': ''}));
    assert.deepEqual(router.find('/1?'), expectedRoute('/*', {'*': '1'}));
    assert.deepEqual(router.find('/123?'), expectedRoute('/*', {'*': '123'}));
    assert.deepEqual(router.find('/js/?'), expectedRoute('/*', {'*': 'js/'}));
    assert.deepEqual(router.find('/js/common.js?'), expectedRoute('/*', {'*': 'js/common.js'}));

    assert.deepEqual(router.find('/static/?'), expectedRoute('/static/*', {'*': ''}));
    assert.deepEqual(router.find('/static/1?'), expectedRoute('/static/*', {'*': '1'}));
    assert.deepEqual(router.find('/static/123?'), expectedRoute('/static/*', {'*': '123'}));
    assert.deepEqual(router.find('/static/js/?'), expectedRoute('/static/*', {'*': 'js/'}));
    assert.deepEqual(router.find('/static/js/common.js?'), expectedRoute('/static/*', {'*': 'js/common.js'}));
  });

});
