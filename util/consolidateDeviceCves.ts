// consolidate.ts
import type { Device } from "../lib/api/device/device.types";
import type { Cve } from "../lib/api/cve/cve.types";
import { DeviceVulnerability } from '@/types/types';

export function consolidateDevicesAndCves(
    devices: Device[],
    cves: Cve[]
): DeviceVulnerability[] {
    const cveById = new Map<string, Cve>(cves.map((c) => [c.cveId, c]));
    const machinesByCveId = new Map<string, Set<string>>();

    for (const d of devices) {

        let set = machinesByCveId.get(d.cveId);
        if (!set) {
            set = new Set<string>();
            machinesByCveId.set(d.cveId, set);
        }
        set.add(d.machineId);
    }

    const result: DeviceVulnerability[] = [];

    for (const [cveId, machineSet] of machinesByCveId.entries()) {
        const cve = cveById.get(cveId);

        result.push({
            cveId,
            cveDescription: cve?.cveDescription ?? "No description available.",
            cveSeverity: cve?.cveSeverity ?? "Unknown",
            cveScores: typeof cve?.cveScores === "number" ? cve.cveScores : 0,
            affectedMachines: Array.from(machineSet),
        });
    }

    result.sort((a, b) => {
        if (b.cveScores !== a.cveScores) return b.cveScores - a.cveScores;
        return a.cveId.localeCompare(b.cveId);
    });

    return result;
}
