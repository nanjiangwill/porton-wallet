import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react'
import { useWebAuthn } from 'components/WebAuthnContext'
import { useNavigate } from 'react-router-dom'
import styles from './Profile.module.scss'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { signOut } = useWebAuthn()

  return (
    <Container className={styles.page} maxW="container.lg" py={16}>
      <Box mb={16}>
        <Heading mb={7}>My Account</Heading>
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
            0.112357 ETH
          </Text>
        </Box>
        <Box px={5} py={2} bgColor="#fafafa" borderRadius="2xl">
          <Text fontSize="5xl" fontWeight="light">
            100.00 USDC
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
