export interface Cve {
    cveId: string;
    cveDescription: string;
    cveSeverity: string;
    cveScores: number;
}

export interface CveEntryDto {
    cve: {
        id: string;
        descriptions?: Array<{ lang: string; value: string }>;
        metrics?: {
            cvssMetricV2?: Array<{
                baseSeverity?: string;
                cvssData?: { baseScore?: number };
            }>;
        };
    };
}
