"use client";

import { Fragment, useMemo, useState } from "react";
import { useDeviceVulnerabilities } from "../contexts/deviceVulnerabilities.context";
import { Card } from "./primitives/Card";
import { Button } from "./primitives/Button";
import { Pill } from "./primitives/Pill";

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

export default function Dashboard() {
    const { vulnerabilities, devices, loading, error, refresh } = useDeviceVulnerabilities();
    const [expandedCveId, setExpandedCveId] = useState<string | null>(null);

    const totalDevices = useMemo(() => {
        const uniqueDevices = new Set(devices.map((device) => device.machineId));
        return uniqueDevices.size;
    }, [devices]);

    const totalAffected = useMemo(() => vulnerabilities.reduce((sum, v) => sum + v.affectedMachines.length, 0), [
        vulnerabilities,
    ]);

    const toggleExpanded = (cveId: string) => {
        setExpandedCveId((prev) => (prev === cveId ? null : cveId));
    };

    return (
        <div className="relative min-h-screen bg-[#f5f1ea] text-slate-900">
            <div className="absolute inset-0 -z-10">
            </div>

            <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 font-sans">
                <header className="flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Vulnerability Overview
                    </p>
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-xl space-y-3">
                            <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
                                CVE Dashboard
                            </h1>
                            <p className="text-sm text-slate-600">
                                Track exposure across devices, prioritize remediation, and drill into affected
                                machines per CVE.
                            </p>
                        </div>
                        <Button type="button" onClick={() => void refresh()} variant="ghost">
                            Refresh data
                        </Button>
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-3">
                    <Card className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Total CVEs
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{vulnerabilities.length}</p>
                        <p className="mt-2 text-sm text-slate-500">Sorted by highest severity score.</p>
                    </Card>
                    <Card className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Devices Scanned
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{totalDevices}</p>
                        <p className="mt-2 text-sm text-slate-500">Unique machines in scope.</p>
                    </Card>
                    <Card className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Affected Devices
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{totalAffected}</p>
                        <p className="mt-2 text-sm text-slate-500">Aggregate impacted endpoints.</p>
                    </Card>
                </section>

                <Card className="overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">CVE inventory</h2>
                            <p className="text-sm text-slate-500">Click a row to reveal affected devices.</p>
                        </div>
                        {loading ? (
                            <Pill className="bg-slate-100 text-slate-500">Loading</Pill>
                        ) : (
                            <Pill className="bg-slate-100 text-slate-500">{vulnerabilities.length} entries</Pill>
                        )}
                    </div>

                    {error ? (
                        <div className="px-6 py-6">
                            <p className="text-sm font-semibold text-red-600">Data error</p>
                            <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{error}</p>
                        </div>
                    ) : null}

                    {loading && vulnerabilities.length === 0 ? (
                        <div className="px-6 py-10 text-sm text-slate-500">Loading CVE data...</div>
                    ) : vulnerabilities.length === 0 ? (
                        <div className="px-6 py-10 text-sm text-slate-500">No CVE data available.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-400">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">CVE</th>
                                        <th className="px-6 py-4 font-semibold">Severity</th>
                                        <th className="px-6 py-4 font-semibold">Score</th>
                                        <th className="px-6 py-4 font-semibold">Description</th>
                                        <th className="px-6 py-4 text-right font-semibold">Affected Devices</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vulnerabilities.map((entry) => {
                                        const isExpanded = expandedCveId === entry.cveId;
                                        const severityTone = getSeverityTone(entry.cveSeverity);
                                        return (
                                            <Fragment key={entry.cveId}>
                                                <tr
                                                    className={`cursor-pointer border-t border-slate-200/70 transition hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${isExpanded ? "bg-slate-50/70" : "bg-white/70"
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
                                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                                        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-xs text-slate-500">
                                                            {isExpanded ? "v" : ">"}
                                                        </span>
                                                        {entry.cveId}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Pill className={severityTone.classes}>{severityTone.label}</Pill>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-700">{formatScore(entry.cveScores)}</td>
                                                    <td className="px-6 py-4 text-slate-600">{entry.cveDescription}</td>
                                                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                                                        {entry.affectedMachines.length}
                                                    </td>
                                                </tr>
                                                {isExpanded ? (
                                                    <tr className="bg-white">
                                                        <td colSpan={5} className="px-6 pb-6 pt-0">
                                                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
                                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                                    Affected devices
                                                                </p>
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {entry.affectedMachines.map((machine) => (
                                                                        <Pill
                                                                            key={machine}
                                                                            className="bg-white text-slate-600 border border-slate-200"
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
