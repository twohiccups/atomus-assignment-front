'use client'
import { useDeviceVulnerabilities } from '../contexts/deviceVulnerabilities.context';


export default function Dashboard() {
    const { vulnerabilities, loading, error } = useDeviceVulnerabilities();
    return (
        <>
            <div>
            </div >
        </>
    )
}