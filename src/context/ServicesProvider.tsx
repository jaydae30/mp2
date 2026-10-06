import { useEffect, useState, type ReactNode } from 'react'
import { ServicesContext } from './ServicesContext'

const STORAGE_KEY = 'mp2-services'

// Free services selected by default. Verify these IDs (see note below).
const DEFAULT_SERVICE_IDS: number[] = [73, 300, 538, 207]

function loadSavedServices(): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as number[]
  } catch {
    // corrupted value: fall back to defaults
  }
  return DEFAULT_SERVICE_IDS
}

export default function ServicesProvider({ children }: { children: ReactNode }) {
  const [serviceIds, setServiceIds] = useState<number[]>(loadSavedServices)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serviceIds))
  }, [serviceIds])

  function toggleService(id: number) {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <ServicesContext.Provider value={{ serviceIds, toggleService }}>
      {children}
    </ServicesContext.Provider>
  )
}