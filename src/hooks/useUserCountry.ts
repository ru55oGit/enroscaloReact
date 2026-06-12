import { useState, useEffect } from "react";

export interface CountryInfo {
  country: string;
  countryCode: string;
  city?: string;
  method: "ip" | "timezone" | "cached";
}

const CACHE_KEY = "user_country_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

const getTimezoneCountry = (): string => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Mapeo básico para países de habla hispana (tu target principal)
  const timezoneToCountry: {
    [key: string]: { country: string; code: string };
  } = {
    "America/Argentina/Buenos_Aires": { country: "Argentina", code: "AR" },
    "America/Argentina/Cordoba": { country: "Argentina", code: "AR" },
    "America/Mexico_City": { country: "México", code: "MX" },
    "America/Monterrey": { country: "México", code: "MX" },
    "America/Bogota": { country: "Colombia", code: "CO" },
    "America/Lima": { country: "Perú", code: "PE" },
    "America/Santiago": { country: "Chile", code: "CL" },
    "America/Caracas": { country: "Venezuela", code: "VE" },
    "America/La_Paz": { country: "Bolivia", code: "BO" },
    "America/Asuncion": { country: "Paraguay", code: "PY" },
    "America/Montevideo": { country: "Uruguay", code: "UY" },
    "Europe/Madrid": { country: "España", code: "ES" },
  };

  return timezoneToCountry[timezone]?.country || "Desconocido";
};

const getCachedCountry = (): CountryInfo | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const isExpired = Date.now() - data.timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return { ...data.countryInfo, method: "cached" as const };
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const setCachedCountry = (countryInfo: CountryInfo): void => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        countryInfo,
        timestamp: Date.now(),
      }),
    );
  } catch {
    // Silently fail if localStorage is not available
  }
};

const fetchCountryByIP = async (): Promise<CountryInfo> => {
  const response = await fetch("https://ipapi.co/json/");
  if (!response.ok) {
    throw new Error("Failed to fetch country info");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.reason || "API Error");
  }

  return {
    country: data.country_name || "Desconocido",
    countryCode: data.country_code || "XX",
    city: data.city,
    method: "ip",
  };
};

export const useUserCountry = () => {
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        setLoading(true);
        setError(null);

        // Primero intentar con caché
        const cached = getCachedCountry();
        if (cached) {
          setCountryInfo(cached);
          setLoading(false);
          return;
        }

        // Intentar con IP
        try {
          const ipResult = await fetchCountryByIP();
          setCountryInfo(ipResult);
          setCachedCountry(ipResult);
        } catch (ipError) {
          console.warn("IP detection failed:", ipError);

          // Fallback con timezone
          const timezoneCountry = getTimezoneCountry();
          const fallbackResult: CountryInfo = {
            country: timezoneCountry,
            countryCode: "XX",
            method: "timezone",
          };

          setCountryInfo(fallbackResult);
          setCachedCountry(fallbackResult);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    detectCountry();
  }, []);

  const refreshCountry = async (): Promise<void> => {
    localStorage.removeItem(CACHE_KEY);
    setCountryInfo(null);
    setLoading(true);
    setError(null);

    // Re-trigger detection
    const detectCountry = async () => {
      try {
        const ipResult = await fetchCountryByIP();
        setCountryInfo(ipResult);
        setCachedCountry(ipResult);
      } catch (ipError) {
        const timezoneCountry = getTimezoneCountry();
        const fallbackResult: CountryInfo = {
          country: timezoneCountry,
          countryCode: "XX",
          method: "timezone",
        };

        setCountryInfo(fallbackResult);
        setCachedCountry(fallbackResult);
      } finally {
        setLoading(false);
      }
    };

    await detectCountry();
  };

  return {
    countryInfo,
    loading,
    error,
    refreshCountry,
    isFromSpanishSpeakingCountry: countryInfo?.countryCode
      ? [
          "AR",
          "MX",
          "CO",
          "PE",
          "CL",
          "VE",
          "BO",
          "PY",
          "UY",
          "ES",
          "GT",
          "HN",
          "SV",
          "NI",
          "CR",
          "PA",
          "DO",
          "CU",
          "EC",
        ].includes(countryInfo.countryCode)
      : undefined,
  };
};
