'use strict';

module.exports = (api) => {
  const isTest = api.env('test');

  api.cache(() => JSON.stringify({ isTest }));

  return {
    compact: false,
    comments: false,
    presets: [
      [
        '@superdispatch/babel-preset',
        {
          targets: 'esmodules',
          optimize: { runtime: false },
        },
      ],
    ],
  };
};
