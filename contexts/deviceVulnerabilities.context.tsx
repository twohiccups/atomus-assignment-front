// deviceVulnerabilities.context.tsx
"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import type { Device } from "../lib/api/device/device.types";
import type { Cve } from "../lib/api/cve/cve.types";
import { fetchDevices } from "../lib/api/device/device.api";
import { fetchCves } from "../lib/api/cve/cve.api";
import { DeviceVulnerability } from '@/types/types';
import { consolidateDevicesAndCves } from '../util/consolidateDeviceCves';
import {
    sortVulnerabilities,
    type SortConfig,
    type SortDirection,
    type VulnerabilitySortKey,
} from "../util/sortVulnerabilities";


type DeviceVulnerabilitiesContextValue = {
    devices: Device[];
    cves: Cve[];
    vulnerabilities: DeviceVulnerability[];
    sortedVulnerabilities: DeviceVulnerability[];
    sortConfig: SortConfig;
    setSort: (key: VulnerabilitySortKey) => void;
    setSortDirection: (direction: SortDirection) => void;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};

const DeviceVulnerabilitiesContext =
    createContext<DeviceVulnerabilitiesContextValue | null>(null);

export function DeviceVulnerabilitiesProvider(props: { children: ReactNode }) {
    const [devices, setDevices] = useState<Device[]>([]);
    const [cves, setCves] = useState<Cve[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: "score",
        direction: "desc",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);

        const deviceArgs = { baseUrl: "", endpointPath: "", token: "" };

        const [devicesRes, cvesRes] = await Promise.allSettled([
            fetchDevices(deviceArgs),
            fetchCves(),
        ]);

        if (devicesRes.status === "fulfilled") setDevices(devicesRes.value);
        else {
            setDevices([]);
            setError(
                `Devices fetch failed: ${devicesRes.reason instanceof Error
                    ? devicesRes.reason.message
                    : String(devicesRes.reason)
                }`
            );
        }

        if (cvesRes.status === "fulfilled") setCves(cvesRes.value);
        else {
            setCves([]);
            setError((prev) =>
                [
                    prev,
                    `CVEs fetch failed: ${cvesRes.reason instanceof Error
                        ? cvesRes.reason.message
                        : String(cvesRes.reason)
                    }`,
                ]
                    .filter(Boolean)
                    .join("\n")
            );
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refresh();
    }, [refresh]);

    const vulnerabilities = useMemo(
        () => consolidateDevicesAndCves(devices, cves),
        [devices, cves]
    );

    const sortedVulnerabilities = useMemo(
        () => sortVulnerabilities(vulnerabilities, sortConfig),
        [vulnerabilities, sortConfig]
    );

    const setSort = useCallback((key: VulnerabilitySortKey) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "desc" };
        });
    }, []);

    const setSortDirection = useCallback((direction: SortDirection) => {
        setSortConfig((prev) => ({ ...prev, direction }));
    }, []);

    const value = useMemo<DeviceVulnerabilitiesContextValue>(
        () => ({
            devices,
            cves,
            vulnerabilities,
            sortedVulnerabilities,
            sortConfig,
            setSort,
            setSortDirection,
            loading,
            error,
            refresh,
        }),
        [
            devices,
            cves,
            vulnerabilities,
            sortedVulnerabilities,
            sortConfig,
            setSort,
            setSortDirection,
            loading,
            error,
            refresh,
        ]
    );

    return (
        <DeviceVulnerabilitiesContext.Provider value={value}>
            {props.children}
        </DeviceVulnerabilitiesContext.Provider>
    );
}

export function useDeviceVulnerabilities(): DeviceVulnerabilitiesContextValue {
    const ctx = useContext(DeviceVulnerabilitiesContext);
    if (!ctx) {
        throw new Error(
            "useDeviceVulnerabilities must be used within a DeviceVulnerabilitiesProvider"
        );
    }
    return ctx;
}

