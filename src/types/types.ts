export type DeviceVulnerability = {
    cveId: string;
    cveDescription: string;
    cveSeverity: string;
    cveScores: number;
    affectedMachines: string[];
};
