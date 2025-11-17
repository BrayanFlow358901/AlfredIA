import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored && active) {
          const parsed = JSON.parse(stored) as T;
          setValue(parsed);
        }
      } catch (error) {
        console.warn(`[storage] load failed for ${key}`, error);
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch((error) => {
      console.warn(`[storage] save failed for ${key}`, error);
    });
  }, [hydrated, key, value]);

  return [value, setValue, hydrated] as const;
}
