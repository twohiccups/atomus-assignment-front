import type { Cve, CveEntryDto } from "./cve.types";

export function dtoToCve(entry: CveEntryDto): Cve {
  const cve = entry.cve;

  const cveDescription =
    cve.descriptions?.find((d) => d.lang === "en")?.value ??
    cve.descriptions?.[0]?.value ??
    "";

  const v2 = cve.metrics?.cvssMetricV2?.[0];
  const cveSeverity = v2?.baseSeverity ?? "UNKNOWN";
  const cveScores = v2?.cvssData?.baseScore ?? 0;

  return {
    cveId: cve.id,
    cveDescription,
    cveSeverity,
    cveScores,
  };
}
