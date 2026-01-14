import type { Device, DeviceDto } from "./device.types";

export function dtoToDevice(dto: DeviceDto): Device {
  return {
    id: dto.id,
    cveId: dto.cveId,
    machineId: dto.machineId,
    fixingKbId: dto.fixingKbId ?? undefined,
    product: {
      name: dto.productName,
      vendor: dto.productVendor,
      version: dto.productVersion,
    },
    severity: dto.severity,
  };
}
