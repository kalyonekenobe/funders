import * as _ from 'lodash';

export const parseObjectStringValuesToPrimitives = (
  object: Record<string, any>,
): Record<string, any> | undefined => {
  if (object) {
    return _.mapValues(object, value => {
      if (_.isObject(value) && !_.isArray(value)) {
        return parseObjectStringValuesToPrimitives(value);
      } else if (_.isString(value)) {
        switch (value) {
          case 'true':
          case 'false':
            return value === 'true';
          case 'null':
            return null;
          case 'undefined':
            return undefined;
          default:
            return !isNaN(Number(value)) ? Number(value) : value;
        }
      }
      return value;
    });
  }
};
