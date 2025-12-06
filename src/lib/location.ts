import { useCallback, useEffect, useMemo, useState } from "react";
import * as Location from "expo-location";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export function haversineDistanceKm(a: Coordinates, b: Coordinates): number {
  const earthRadiusKm = 6371;
  const dLat = deg2rad(b.latitude - a.latitude);
  const dLon = deg2rad(b.longitude - a.longitude);
  const lat1 = deg2rad(a.latitude);
  const lat2 = deg2rad(b.latitude);

  const hav = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * earthRadiusKm * Math.asin(Math.min(1, Math.sqrt(hav)));
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

type LocationState = {
  location: Location.LocationObject | null;
  isRequesting: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
  hasPermission: boolean;
  refresh: () => Promise<void>;
};

export function useCurrentLocation(): LocationState {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

  const refresh = useCallback(async () => {
    setIsRequesting(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      if (status !== Location.PermissionStatus.GRANTED) {
        setLocation(null);
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo obtener la ubicación");
      setLocation(null);
    } finally {
      setIsRequesting(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const hasPermission = useMemo(() => permissionStatus === Location.PermissionStatus.GRANTED, [permissionStatus]);

  return {
    location,
    isRequesting,
    error,
    permissionStatus,
    hasPermission,
    refresh,
  };
}

export function formatDistance(distanceKm: number | null) {
  if (distanceKm == null) return "Distancia desconocida";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(1)} km`;
}
