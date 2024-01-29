export const arrayFromMap = <TKey, TValue>(map: Map<TKey, TValue>): TValue[] => Array.from(map, ([_, value]) => value);
