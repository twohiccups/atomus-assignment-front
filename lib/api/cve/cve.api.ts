
import type { Cve, CveEntryDto } from "./cve.types";
import { dtoToCve } from "./cve.mapper";

const CVE_BASE_URL =
  "https://45dd4b13-a54d-424a-ba8f-146262bdb45d.mock.pstmn.io/vulns";

export async function fetchCves(): Promise<Cve[]> {
  const res = await fetch(CVE_BASE_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { vulnerabilities?: CveEntryDto[] };

  if (!data || !Array.isArray(data.vulnerabilities)) {
    throw new Error("Unexpected response shape: missing vulnerabilities[]");
  }

  return data.vulnerabilities.map(dtoToCve);
}

