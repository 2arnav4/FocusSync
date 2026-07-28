import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceId } from "@/types";

const STORAGE_VERSION = "v1";

export function getDeviceStorageKey(deviceId: DeviceId, key: string): string {
  return `focussync:${STORAGE_VERSION}:${deviceId}:${key}`;
}

export async function saveDeviceJson<T>(deviceId: DeviceId, key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(getDeviceStorageKey(deviceId, key), JSON.stringify(value));
}

export async function loadDeviceJson<T>(deviceId: DeviceId, key: string): Promise<T | null> {
  const rawValue = await AsyncStorage.getItem(getDeviceStorageKey(deviceId, key));
  return rawValue ? (JSON.parse(rawValue) as T) : null;
}

export async function clearDeviceState(deviceId: DeviceId): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const deviceKeys = keys.filter((key) => key.startsWith(`focussync:${STORAGE_VERSION}:${deviceId}:`));
  await AsyncStorage.multiRemove(deviceKeys);
}

export async function clearAllDeviceStates(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const deviceKeys = keys.filter((key) => key.startsWith(`focussync:${STORAGE_VERSION}:`));
  await AsyncStorage.multiRemove(deviceKeys);
}
