import { Prop } from './Prop';

export function UnknownProp() {
  return Prop({
    type: 'unknown',
    testType() {
      return true;
    },
    normalize(value) {
      return value;
    },
    serialize(value) {
      return value;
    },
  });
}
