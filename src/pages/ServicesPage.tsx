import { useServices } from '../context/useServices'

export default function ServicesPage() {
  const { serviceIds, toggleService } = useServices()
  return (
    <>
      <h1>My Services</h1>
      <p>Selected IDs: {serviceIds.join(', ')}</p>
      <button type="button" onClick={() => toggleService(8)}>
        Toggle Netflix (8)
      </button>
    </>
  )
}