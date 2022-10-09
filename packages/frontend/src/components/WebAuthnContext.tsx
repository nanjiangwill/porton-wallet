import { PRIVATE_KEY } from 'constants/wallet'
import { useState } from 'react'
import { createContext, PropsWithChildren, useContext } from 'react'

export interface IWebAuthnContext {
  privateKey: string | null
  signIn: () => Promise<PublicKeyCredential>
  signOut: () => void
}

export const WebAuthnContext = createContext({} as IWebAuthnContext)

export const useWebAuthn = () => useContext(WebAuthnContext)

export const WebAuthnProvider = ({ children }: PropsWithChildren) => {
  const [privateKey, setPrivateKey] = useState(
    localStorage.getItem('webauthn.privateKey'),
  )

  const signIn = async () => {
    if (localStorage.getItem('webauthn.privateKey')) {
      alert('Credential exists')

      throw new Error('Credential exists')
    }

    const uuid = crypto.randomUUID()
    const payload = await navigator.credentials.create({
      publicKey: {
        challenge: Uint8Array.from(crypto.randomUUID(), c => c.charCodeAt(0)),
        rp: {
          name: 'Porton Wallet',
        },
        user: {
          id: Uint8Array.from(uuid, c => c.charCodeAt(0)),
          name: 'portonwallet',
          displayName: 'Porton Wallet',
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
        attestation: 'none',
      },
    })

    if (payload === null) {
      alert('Failed to get credential')

      throw new Error('Failed to create credential')
    }

    localStorage.setItem('webauthn.credentialId', payload.id)
    localStorage.setItem('webauthn.privateKey', PRIVATE_KEY)

    setPrivateKey(PRIVATE_KEY)

    return payload as PublicKeyCredential
  }

  const signOut = () => {
    localStorage.removeItem('webauthn.credentialId')
    localStorage.removeItem('webauthn.privateKey')

    setPrivateKey(null)
  }

  const value: IWebAuthnContext = {
    privateKey,
    signIn,
    signOut,
  }

  return (
    <WebAuthnContext.Provider value={value}>
      {children}
    </WebAuthnContext.Provider>
  )
}
