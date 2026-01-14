// device.types.ts

export type Severity = "Low" | "Medium" | "High" | "Critical";

export interface DeviceDto {
    id: string;
    cveId: string;
    machineId: string;
    fixingKbId: string | null;
    productName: string;
    productVendor: string;
    productVersion: string;
    severity: Severity;
}

export interface Device {
    id: string;
    cveId: string;
    machineId: string;
    fixingKbId?: string;
    product: {
        name: string;
        vendor: string;
        version: string;
    };
    severity: Severity;
}
