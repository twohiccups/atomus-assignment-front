// device.api.ts
import type { Device, DeviceDto } from "./device.types";
import { dtoToDevice } from "./device.mapper";


export async function fetchDevices(args: {
  baseUrl: string;
  endpointPath: string;
  token: string;
}): Promise<Device[]> {
  const DEVICE_ENDPOINT_URL = 'https://45dd4b13-a54d-424a-ba8f-146262bdb45d.mock.pstmn.io/devices'
  const url = `${DEVICE_ENDPOINT_URL}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { value: DeviceDto[] };

  if (!data || !Array.isArray(data.value)) {
    throw new Error("Unexpected response shape: missing value[]");
  }

  return data.value.map(dtoToDevice);
}
