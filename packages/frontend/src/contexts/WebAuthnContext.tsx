import { createContext, PropsWithChildren, useContext } from 'react'
import { decode } from '../utils/base64url-arraybuffer'

export interface IWebAuthnContext {
  registerFingerprint: () => Promise<PublicKeyCredential>
  verifyFingerprint: () => Promise<PublicKeyCredential>
}

export const WebAuthnContext = createContext({} as IWebAuthnContext)

export const useWebAuthn = () => useContext(WebAuthnContext)

export const WebAuthnProvider = ({ children }: PropsWithChildren) => {
  const value: IWebAuthnContext = {
    async registerFingerprint() {
      if (localStorage.getItem('credentialId')) {
        alert('Credential exists')

        throw new Error('Credential exists')
      }

      const uuid = crypto.randomUUID()
      const publicKeyCredential = await navigator.credentials.create({
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

      if (publicKeyCredential === null) {
        alert('Failed to get credential')

        throw new Error('Failed to create credential')
      }

      localStorage.setItem('credentialId', publicKeyCredential.id)

      console.log(publicKeyCredential)

      alert('success')

      return publicKeyCredential as PublicKeyCredential
    },
    async verifyFingerprint() {
      const credentialId = localStorage.getItem('credentialId')

      if (credentialId === null) {
        alert('Credential is not registered')

        throw new Error('Credential is not registered')
      }

      const publicKeyCredential = await navigator.credentials.get({
        publicKey: {
          challenge: Uint8Array.from(crypto.randomUUID(), c => c.charCodeAt(0)),
          timeout: 60000,
          userVerification: 'required',
          allowCredentials: [
            {
              id: decode(credentialId),
              type: 'public-key',
              transports: ['internal'],
            },
          ],
        },
      })

      if (publicKeyCredential === null) {
        alert('Failed to get credential')

        throw new Error('Failed to get credential')
      }

      if (credentialId !== publicKeyCredential.id) {
        alert('Unauthorized')

        throw new Error('Unauthorized')
      }

      console.log(publicKeyCredential)

      alert('success')

      return publicKeyCredential as PublicKeyCredential
    },
  }

  return (
    <WebAuthnContext.Provider value={value}>
      {children}
    </WebAuthnContext.Provider>
  )
}
