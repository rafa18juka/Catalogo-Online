import { Navigate } from 'react-router-dom'
import { getDefaultPathForSurface, getSurfaceFromPort } from '../lib/surface'

export function SurfaceRedirect() {
  const surface = getSurfaceFromPort(window.location.port)

  return <Navigate to={getDefaultPathForSurface(surface)} replace />
}
