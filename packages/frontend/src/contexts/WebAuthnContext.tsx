import { createContext, PropsWithChildren, useContext } from 'react'
import { decode } from '../utils/base64url-arraybuffer'
import * as CBOR from '../utils/cbor'
import * as Helper from '../utils/helpers'
import { ethers, BigNumber } from 'ethers'
import metadata from './WebauthnWallet.json'

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
      const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/9c9dde38d02b4f0ca0631ea01644dd29')
      if(!process.env.REACT_APP_PRIVATE_KEY || process.env.REACT_APP_PRIVATE_KEY.substring(0, 2) !== '0x')
        throw new Error('Need private key string !');
      const private_key = process.env.REACT_APP_PRIVATE_KEY
      const wallet = new ethers.Wallet(private_key, provider)
      const price = ethers.utils.formatUnits(await provider.getGasPrice(), 'gwei')
      console.log(metadata)
      const factory = new ethers.ContractFactory(metadata.abi, metadata.bytecode.object, wallet)

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
      console.log('SUCCESS', publicKeyCredential)
      //console.log('ClientDataJSON: ', bufferToString(newCredentialInfo.response.clientDataJSON))
      let attestationObject = CBOR.decode((publicKeyCredential as any).response.attestationObject, undefined, undefined);
      //console.log('AttestationObject: ', attestationObject)
      let authData = Helper.parseAuthData(attestationObject.authData);
      console.log('AuthData: ', authData);
      console.log('CredID: ', Helper.bufToHex(authData.credID));
      console.log('AAGUID: ', Helper.bufToHex(authData.aaguid));
      let pubk = CBOR.decode(authData.COSEPublicKey.buffer, undefined, undefined);
      console.log('PublicKey', pubk);
      console.log('Q[0]', pubk['-2']);
      console.log('Q[1]', pubk['-3']);
      console.log(publicKeyCredential)
      const q0 = BigNumber.from(pubk['-2']);
      const q1 = BigNumber.from(pubk['-3']);
      
      const contract = await factory.deploy('0x1b98F08dB8F12392EAE339674e568fe29929bC47', 
        '0xb0c31b1f9EB2cAB7AaD5b62Ce56c66D4218924a1', 
        '0x16367BB04F0Bb6D4fc89d2aa31c32E0ddA609508',
        [q0, q1])
      console.log('contract address:', contract)
      console.log('contract dep tx', contract.deployTransaction)
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
