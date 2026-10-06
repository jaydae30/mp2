import { createContext } from 'react'

export type ServicesContextValue = {
  serviceIds: number[]
  toggleService: (id: number) => void
}

export const ServicesContext = createContext<ServicesContextValue | null>(null)