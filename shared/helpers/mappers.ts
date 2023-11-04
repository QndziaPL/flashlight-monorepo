export const removeKeysWithUndefinedValues = <T extends Record<string, any>>(obj: T): T => {
  const newObj: T = {} as T;

  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) {
      newObj[key as keyof T] = removeKeysWithUndefinedValues(obj[key as keyof T]);
    } else if (obj[key] !== undefined) {
      newObj[key as keyof T] = obj[key as keyof T];
    }
  });

  return newObj;
};
