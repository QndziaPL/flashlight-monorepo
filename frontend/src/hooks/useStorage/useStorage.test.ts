import { act, renderHook } from "@testing-library/react";
import type { StorageType } from "./useStorage.ts";
import { useStorage } from "./useStorage.ts";

describe("useStorage", () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("should handle different data types for initialValue", () => {
    const numberValue = 42;
    const arrayValue = [1, 2, 3];
    const objectValue = { foo: "bar" };
    const booleanValue = true;

    const { result: numberResult } = renderHook(() => useStorage("numberKey", numberValue, "session"));
    expect(numberResult.current[0]).toBe(numberValue);

    const { result: arrayResult } = renderHook(() => useStorage("arrayKey", arrayValue, "session"));
    expect(arrayResult.current[0]).toEqual(arrayValue);

    const { result: objectResult } = renderHook(() => useStorage("objectKey", objectValue, "session"));
    expect(objectResult.current[0]).toEqual(objectValue);

    const { result: booleanResult } = renderHook(() => useStorage("booleanKey", booleanValue, "session"));
    expect(booleanResult.current[0]).toBe(booleanValue);
  });

  it("should handle null and undefined initialValue", () => {
    const { result: nullResult } = renderHook(() => useStorage("nullKey", null, "session"));
    expect(nullResult.current[0]).toBeNull();

    const { result: undefinedResult } = renderHook(() => useStorage("undefinedKey", undefined, "session"));
    expect(undefinedResult.current[0]).toBeUndefined();
  });

  it("should update the value and store it in storage", () => {
    const key = "testKey";
    const initialValue = 42;
    const storageType: StorageType = "local";

    const { result } = renderHook(() => useStorage(key, initialValue, storageType));
    const [, updateValue] = result.current;

    const newValue = 100;
    act(() => {
      updateValue(newValue);
    });

    expect(result.current[0]).toBe(newValue);
    const directlyObtainedValue = JSON.parse(localStorage.getItem(key) ?? "");
    expect(result.current[0]).toEqual(directlyObtainedValue);
  });

  it("should store and update array of objects", () => {
    type TestModel = {
      id: number;
      content: string;
      finished: boolean;
    };
    const newValue: TestModel[] = [
      {
        id: 1,
        content: "test content 1",
        finished: false,
      },
      {
        id: 2,
        content: "test content 2",
        finished: true,
      },
      {
        id: 3,
        content: "test content 3",
        finished: false,
      },
      {
        id: 4,
        content: "test content 4",
        finished: false,
      },
      {
        id: 5,
        content: "test content 5",
        finished: true,
      },
    ];

    const key = "testKey";
    const initialValue: TestModel[] = [];
    const storageType: StorageType = "session";

    const { result } = renderHook(() => useStorage(key, initialValue, storageType));
    const [, updateValue] = result.current;

    expect(result.current[0]).toEqual([]);

    act(() => {
      updateValue(newValue);
    });

    const storedValue = result.current[0];

    expect(storedValue).toHaveLength(newValue.length);

    const onlyFinishedItems = storedValue?.filter((item) => item.finished);
    if (!onlyFinishedItems) throw new Error("onlyFinishedItems should not be undefined!!! something went wrong");

    expect(onlyFinishedItems).toHaveLength(2);
    expect(onlyFinishedItems[0].id).toEqual(2);
  });

  it("should persist value between re-renders", () => {
    const key = "testKey";
    const initialValue = "initialValue";
    const storageType: StorageType = "local";
    const { result, rerender } = renderHook(() => useStorage(key, initialValue, storageType));
    const [, updateValue] = result.current;
    const newValue = "newValue";
    act(() => {
      updateValue(newValue);
    });
    expect(result.current[0]).toBe(newValue);
    rerender();

    expect(result.current[0]).toBe(newValue);
  });
});
