import { useCallback, useState } from "react";

const BACKEND_CORE_URL = "http://localhost/api";

export const useApi = <T>(initialState?: T) => {
  const [data, setData] = useState<T | undefined>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const call = useCallback(async (url: string, init?: RequestInit): Promise<T> => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_CORE_URL}${url}`, {
        headers: { "Content-Type": "application/json" },
        ...init,
      });
      const jsonData = (await response.json()) as T;
      setData(jsonData);
      setError(undefined);

      return jsonData;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, call };
};
