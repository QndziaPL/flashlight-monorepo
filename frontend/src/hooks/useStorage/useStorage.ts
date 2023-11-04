import { useCallback, useEffect, useMemo, useState } from "react";
import { getInitialStateValue, getStorage, updateStorageValue } from "./helpers";

export type StorageType = "local" | "session";

export function useStorage<T>(
  key: string,
  initialValue: T,
  storageType: StorageType,
): [value: T, updateValue: (newValue: T) => void] {
  const storage = useMemo(() => getStorage(storageType), [storageType]);
  const [value, setValue] = useState<T>(getInitialStateValue(key, initialValue, storage));

  const updateStorage = useCallback((value: T) => updateStorageValue(storage, key, value), [storage, key]);

  const updateValue = useCallback(
    (newValue: T) => {
      updateStorage(newValue);
      setValue(newValue);
    },
    [updateStorage],
  );

  useEffect(() => {
    const value = getInitialStateValue(key, initialValue, storage);
    setValue(value);
    updateStorage(value);
  }, [key, storage, updateStorage]);

  return [value, updateValue];
}
