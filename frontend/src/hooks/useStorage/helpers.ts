import type { StorageType } from "./useStorage.ts";

export const getStorage = (storageType: StorageType) => {
  if (typeof window === "undefined") return null;

  switch (storageType) {
    case "session":
      return sessionStorage;
    case "local":
      return localStorage;
  }
};

export const updateStorageValue = <T>(storage: Storage | null, key: string, value: T) => {
  storage?.setItem(key, JSON.stringify(value));
};

export const getInitialStateValue = <T>(key: string, initialValue: T, storage: Storage | null) => {
  const value = storage?.getItem(key);

  return !!value ? (JSON.parse(value) as T) : initialValue;
};
