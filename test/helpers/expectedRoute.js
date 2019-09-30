'use strict';

function expectedRoute(path, params = {}) {
  return {
    store: Object.assign(Object.create(null), {path}),
    params,
  };
}

module.exports = expectedRoute;
