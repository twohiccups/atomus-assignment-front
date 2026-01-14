import type { DeviceVulnerability } from "@/types/types";

export type VulnerabilitySortKey = "cve" | "severity" | "score" | "affected";
export type SortDirection = "asc" | "desc";

export type SortConfig = {
  key: VulnerabilitySortKey;
  direction: SortDirection;
};

const severityOrder: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function compareNumbers(a: number, b: number, direction: SortDirection) {
  return direction === "asc" ? a - b : b - a;
}

function compareStrings(a: string, b: string, direction: SortDirection) {
  const result = a.localeCompare(b);
  return direction === "asc" ? result : -result;
}

export function sortVulnerabilities(
  items: DeviceVulnerability[],
  config: SortConfig
): DeviceVulnerability[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    switch (config.key) {
      case "cve":
        return compareStrings(a.cveId, b.cveId, config.direction);
      case "severity": {
        const aScore = severityOrder[a.cveSeverity.trim().toLowerCase()] ?? 0;
        const bScore = severityOrder[b.cveSeverity.trim().toLowerCase()] ?? 0;
        return compareNumbers(aScore, bScore, config.direction);
      }
      case "affected":
        return compareNumbers(
          a.affectedMachines.length,
          b.affectedMachines.length,
          config.direction
        );
      case "score":
      default:
        return compareNumbers(a.cveScores, b.cveScores, config.direction);
    }
  });
  return sorted;
}
