import * as api from '..';

test('public api', () => {
  expect(api).toMatchInlineSnapshot(`
    Object {
      "ArrayProp": [Function],
      "BooleanProp": [Function],
      "DateProp": [Function],
      "NumberProp": [Function],
      "ObjectProp": [Function],
      "Prop": [Function],
      "StringProp": [Function],
      "parseDTO": [Function],
      "serializeDTO": [Function],
    }
  `);
});
