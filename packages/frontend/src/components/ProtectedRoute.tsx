import { useWebAuthn } from 'components/WebAuthnContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { privateKey } = useWebAuthn()

  if (privateKey === null) {
    return <Navigate to="/registration" replace />
  }

  return children
}

export default ProtectedRoute
