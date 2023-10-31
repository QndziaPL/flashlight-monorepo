import { useEffect, useState } from "react";

export const useIpAddress = () => {
  const [ipAddress, setIpAddress] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data: { ip: string }) => {
        setIpAddress(data.ip);
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return { ip: ipAddress, loading, error };
};
