import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react'
import { useWebAuthn } from 'components/WebAuthnContext'
import { provider } from 'constants/ethers'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Profile.module.scss'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { address, signOut } = useWebAuthn()

  const [ethBalance, setETHBalance] = useState(0)

  useEffect(() => {
    provider
      .getBalance(address!)
      .then(balance => setETHBalance(balance.toNumber()))
  }, [address])

  return (
    <Container className={styles.page} maxW="container.lg" py={16}>
      <Box mb={16}>
        <Heading mb={3}>My Account</Heading>
        <Text mb={7} fontSize={18}>
          {address}
        </Text>
        <Flex gap={3} wrap="wrap">
          <Button colorScheme="messenger" onClick={() => navigate('/counter')}>
            Play Counter Game
          </Button>
          <Button onClick={() => navigate('/paymaster')}>
            Go to Paymaster Settings
          </Button>
          <Button
            onClick={() => {
              signOut()
              navigate('/registration')
            }}
          >
            Sign out
          </Button>
        </Flex>
      </Box>
      <Box mb={16}>
        <Heading mb={7}>Balances</Heading>
        <Box px={5} py={2} bgColor="#fafafa" borderRadius="2xl" mb={3}>
          <Text fontSize="5xl" fontWeight="light">
            {ethBalance} ETH
          </Text>
        </Box>
        <Box px={5} py={2} bgColor="#fafafa" borderRadius="2xl">
          <Text fontSize="5xl" fontWeight="light">
            0 USDC
          </Text>
        </Box>
      </Box>
      <Box>
        <Heading mb={7}>Owned NFTs</Heading>
        <Text>Some NFTs here</Text>
      </Box>
    </Container>
  )
}

export default ProfilePage
