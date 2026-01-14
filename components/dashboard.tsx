"use client";

import { Fragment, useMemo, useState } from "react";
import { useDeviceVulnerabilities } from "../contexts/deviceVulnerabilities.context";
import type { VulnerabilitySortKey } from "../util/sortVulnerabilities";
import { Card } from "./primitives/Card";
import { Button } from "./primitives/Button";
import { Pill } from "./primitives/Pill";
import { SortIcon } from "./primitives/SortIcon";

type SeverityTone = {
    label: string;
    classes: string;
};

const severityTones: Record<string, SeverityTone> = {
    critical: {
        label: "Critical",
        classes: "bg-red-100 text-red-700",
    },
    high: {
        label: "High",
        classes: "bg-orange-100 text-orange-700",
    },
    medium: {
        label: "Medium",
        classes: "bg-amber-100 text-amber-700",
    },
    low: {
        label: "Low",
        classes: "bg-emerald-100 text-emerald-700",
    },
};

function getSeverityTone(severity: string): SeverityTone {
    const key = severity.trim().toLowerCase();
    if (severityTones[key]) return severityTones[key];
    return { label: severity || "Unknown", classes: "bg-slate-100 text-slate-600" };
}

function formatScore(score: number): string {
    if (!Number.isFinite(score)) return "N/A";
    return score.toFixed(1);
}

const sortLabels: Record<VulnerabilitySortKey, string> = {
    cve: "CVE",
    severity: "Severity",
    score: "Score",
    affected: "Affected Devices",
};

export default function Dashboard() {
    const {
        vulnerabilities,
        sortedVulnerabilities,
        sortConfig,
        setSort,
        devices,
        loading,
        error,
        refresh,
    } = useDeviceVulnerabilities();
    const [expandedCveId, setExpandedCveId] = useState<string | null>(null);

    const totalDevices = useMemo(() => {
        const uniqueDevices = new Set(devices.map((device) => device.machineId));
        return uniqueDevices.size;
    }, [devices]);

    const toggleExpanded = (cveId: string) => {
        setExpandedCveId((prev) => (prev === cveId ? null : cveId));
    };

    return (
        <div className="relative min-h-screen bg-[rgb(242,245,249)] text-slate-950">
            <div className="absolute inset-0 -z-10">
            </div>

            <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 font-sans">
                <header className="flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                        Vulnerability Overview
                    </p>
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-xl space-y-3">
                            <h1 className="text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
                                CVE Dashboard
                            </h1>

                        </div>
                        <Button type="button" onClick={() => void refresh()} variant="ghost">
                            Refresh data
                        </Button>
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-2">
                    <Card className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                            Total CVEs
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-950">{vulnerabilities.length}</p>
                        <p className="mt-2 text-sm text-slate-700">Sorted by highest severity score.</p>
                    </Card>
                    <Card className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                            Devices Scanned
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-950">{totalDevices}</p>
                        <p className="mt-2 text-sm text-slate-700">Unique machines in scope.</p>
                    </Card>
                </section>

                <Card className="overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-950">CVE inventory</h2>
                            <p className="text-sm text-slate-700">Click a row to reveal affected devices.</p>
                        </div>
                        {loading ? (
                            <Pill className="bg-slate-200 text-slate-800">Loading</Pill>
                        ) : (
                            <Pill className="bg-slate-200 text-slate-800">{vulnerabilities.length} entries</Pill>
                        )}
                    </div>

                    {error ? (
                        <div className="px-6 py-6">
                            <p className="text-sm font-semibold text-red-600">Data error</p>
                            <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{error}</p>
                        </div>
                    ) : null}

                    {loading && vulnerabilities.length === 0 ? (
                        <div className="px-6 py-10 text-sm text-slate-700">Loading CVE data...</div>
                    ) : vulnerabilities.length === 0 ? (
                        <div className="px-6 py-10 text-sm text-slate-700">No CVE data available.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                                <thead className="bg-slate-100 text-xs uppercase tracking-[0.2em] text-slate-600">
                                    <tr>
                                        {(["cve", "severity", "score"] as VulnerabilitySortKey[]).map((key) => (
                                            <th key={key} className="px-6 py-4 font-semibold">
                                                <button
                                                    type="button"
                                                    onClick={() => setSort(key)}
                                                    className={`flex w-full items-center justify-start gap-2 rounded-sm px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${sortConfig.key === key
                                                        ? "bg-white text-slate-800 shadow-sm"
                                                        : "text-slate-600 hover:text-slate-800"
                                                        }`}
                                                    aria-sort={
                                                        sortConfig.key === key
                                                            ? sortConfig.direction === "asc"
                                                                ? "ascending"
                                                                : "descending"
                                                            : "none"
                                                    }
                                                >
                                                    <span>{sortLabels[key]}</span>
                                                    <SortIcon
                                                        direction={
                                                            sortConfig.key === key
                                                                ? sortConfig.direction
                                                                : "none"
                                                        }
                                                    />
                                                </button>
                                            </th>
                                        ))}
                                        <th className="px-6 py-4 font-semibold">Description</th>
                                        <th className="px-6 py-4 text-right font-semibold">
                                            <button
                                                type="button"
                                                onClick={() => setSort("affected")}
                                                className={`flex w-full items-center justify-end gap-2 rounded-sm px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${sortConfig.key === "affected"
                                                    ? "bg-white text-slate-800 shadow-sm"
                                                    : "text-slate-600 hover:text-slate-800"
                                                    }`}
                                                aria-sort={
                                                    sortConfig.key === "affected"
                                                        ? sortConfig.direction === "asc"
                                                            ? "ascending"
                                                            : "descending"
                                                        : "none"
                                                }
                                            >
                                                <span>{sortLabels.affected}</span>
                                                <SortIcon
                                                    direction={
                                                        sortConfig.key === "affected"
                                                            ? sortConfig.direction
                                                            : "none"
                                                    }
                                                />
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedVulnerabilities.map((entry) => {
                                        const isExpanded = expandedCveId === entry.cveId;
                                        const severityTone = getSeverityTone(entry.cveSeverity);
                                        return (
                                            <Fragment key={entry.cveId}>
                                                <tr
                                                    className={`cursor-pointer border-t border-slate-300/70 transition hover:bg-slate-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${isExpanded ? "bg-slate-100/70" : "bg-white"
                                                        }`}
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-expanded={isExpanded}
                                                    onClick={() => toggleExpanded(entry.cveId)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter" || event.key === " ") {
                                                            event.preventDefault();
                                                            toggleExpanded(entry.cveId);
                                                        }
                                                    }}
                                                >
                                                    <td className="px-6 py-4 font-semibold text-slate-950">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                type="button"
                                                                className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-slate-300 text-xs text-slate-700 transition hover:text-slate-900"
                                                                aria-label={`Toggle ${entry.cveId}`}
                                                            >
                                                                {isExpanded ? "v" : ">"}
                                                            </button>
                                                            <span>{entry.cveId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Pill className={severityTone.classes}>{severityTone.label}</Pill>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-800">{formatScore(entry.cveScores)}</td>
                                                    <td className="px-6 py-4 text-slate-700">{entry.cveDescription}</td>
                                                    <td className="px-6 py-4 text-right font-semibold text-slate-950">
                                                        {entry.affectedMachines.length}
                                                    </td>
                                                </tr>
                                                {isExpanded ? (
                                                    <tr className="bg-white">
                                                        <td colSpan={5} className="px-6 pb-6 pt-0">
                                                            <div className="rounded-md border border-dashed border-slate-300 bg-slate-100 p-4 mt-3">
                                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                                                                    Affected devices
                                                                </p>
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {entry.affectedMachines.map((machine) => (
                                                                        <Pill
                                                                            key={machine}
                                                                            className="bg-white text-slate-800 border border-slate-300"
                                                                        >
                                                                            {machine}
                                                                        </Pill>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                            </Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
}
