import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import styles from './Landing.module.scss'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <Container className={styles.page} maxW="container.lg" py={16}>
      <Heading mb={7} fontSize={['5xl', '7xl']} className={styles.heading}>
        Porton Wallet
      </Heading>
      <SimpleGrid mb={7} spacing={7} columns={[1, 1, 2, 3]}>
        <Box flex={1} bgColor="#fafafa" p={5} borderRadius="2xl">
          <Heading mb={5}>Flexible gas fee payment</Heading>
          <Text fontSize={18}>
            - Project team can subsidize gas payment of users
          </Text>
          <Text fontSize={18}>- Users can use ERC20 token to pay gas fee</Text>
        </Box>
        <Box flex={1} bgColor="#fafafa" p={5} borderRadius="2xl">
          <Heading mb={5}>Seamless interaction</Heading>
          <Text fontSize={18}>
            - Don't need to sign signature for a period of time
          </Text>
          <Text fontSize={18}>- No interruption of UX</Text>
        </Box>
        <Box flex={1} bgColor="#fafafa" p={5} borderRadius="2xl">
          <Heading mb={5}>Use Touch ID to secure your private key</Heading>
          <Text fontSize={18}>- Everything begins with a fingerprint</Text>
          <Text fontSize={18}>- Instant set up</Text>
        </Box>
      </SimpleGrid>
      <Box flex={1} bgColor="#fafafa" p={5} borderRadius="2xl">
        <Heading mb={3}>Get your first Porton Wallet</Heading>
        <Text fontSize={18} mb={5}>
          Don't be worry, any data will be stored locally
        </Text>
        <Button
          colorScheme="messenger"
          size="lg"
          onClick={() => navigate('/registration')}
        >
          Use my Touch ID to Register
        </Button>
      </Box>
    </Container>
  )
}

export default LandingPage
