import { useCallback, useState } from "react";
import { useAppContext } from "../context/AppContext.tsx";

const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost";
const BACKEND_CORE_URL = `${BACKEND_URL}/api`;

export const useApi = <T>(initialState?: T) => {
  const [data, setData] = useState<T | undefined>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const { clientId } = useAppContext();

  const call = useCallback(
    async (url: string, init?: RequestInit): Promise<T> => {
      setLoading(true);
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await fetch(`${BACKEND_CORE_URL}${url}`, {
          headers: { "Content-Type": "application/json" },
          signal,
          ...init,
        });

        if (!response.ok) {
          throw new Error(response.statusText || "Error fetching data");
        }

        const jsonData = (await response.json()) as T;
        setData(jsonData);
        setError(undefined);
        return jsonData;
      } catch (error) {
        setError(error instanceof Error ? error : new Error("An unknown error occurred"));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [BACKEND_CORE_URL],
  );

  return { loading, error, data, call };
};
