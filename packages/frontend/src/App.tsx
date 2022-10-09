import { useWebAuthn } from './contexts/WebAuthnContext'

function App() {
  const { registerFingerprint, verifyFingerprint } = useWebAuthn()

  return (
    <div>
      <button onClick={registerFingerprint}>Register Fingerprint</button>
      <button onClick={verifyFingerprint}>Verify Fingerprint</button>
    </div>
  )
}

export default App
