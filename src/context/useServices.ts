import { useContext } from 'react'
import { ServicesContext } from './ServicesContext'

export function useServices() {
  const ctx = useContext(ServicesContext)
  if (!ctx) throw new Error('useServices must be used inside ServicesProvider')
  return ctx
}