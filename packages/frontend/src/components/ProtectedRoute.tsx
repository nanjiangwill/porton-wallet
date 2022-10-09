import { useWebAuthn } from 'components/WebAuthnContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { address } = useWebAuthn()

  if (address === null) {
    return <Navigate to="/registration" replace />
  }

  return children
}

export default ProtectedRoute
