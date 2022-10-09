import { useWebAuthn } from 'components/WebAuthnContext'
import { useEffect } from 'react'
import { IoClose, IoFingerPrint } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import styles from './Registration.module.scss'

const RegistrationPage = () => {
  const { address, signIn } = useWebAuthn()
  const navigate = useNavigate()

  useEffect(() => {
    if (address !== null) {
      navigate('/profile')
    }
  })

  return (
    <div className={styles.page}>
      <IoClose
        size={60}
        className={styles.back}
        onClick={() => navigate('/')}
      />
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FC466B" />
            <stop offset="100%" stopColor="#3F5EFB" />
          </linearGradient>
        </defs>
      </svg>
      <IoFingerPrint
        className={styles.icon}
        size={240}
        onClick={async () => {
          await signIn()
          navigate('/profile')
        }}
      />
      <div className={styles.message}>Click the fingerprint to register</div>
    </div>
  )
}

export default RegistrationPage
