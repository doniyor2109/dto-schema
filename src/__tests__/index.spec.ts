import * as api from '..';

test('public api', () => {
  expect(api).toMatchInlineSnapshot(`
    Object {
      "NumberProp": [Function],
      "Prop": [Function],
      "StringProp": [Function],
      "parseDTO": [Function],
      "serializeDTO": [Function],
    }
  `);
});
