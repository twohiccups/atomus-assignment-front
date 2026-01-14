import Dashboard from '../../components/dashboard';
import { DeviceVulnerabilitiesProvider } from '../../contexts/deviceVulnerabilities.context';



export default function Page() {

  return (<>
    <DeviceVulnerabilitiesProvider>
      <Dashboard />
    </DeviceVulnerabilitiesProvider>

  </>)
}