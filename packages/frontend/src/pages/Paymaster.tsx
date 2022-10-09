import { Box, Button, Container, Heading, Select } from '@chakra-ui/react'
import { useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import styles from './Paymaster.module.scss'

const PaymasterPage = () => {
  const [tokenType, setTokenType] = useState('ETH')

  return (
    <Container className={styles.page} maxW="container.lg" py={16}>
      <Box mb={10} ml={-3}>
        <IoArrowBack
          size={60}
          className={styles.back}
          onClick={() => window.history.back()}
        />
      </Box>
      <Box mb={16}>
        <Heading mb={7}>Paymaster</Heading>
        <Box mb={7} p={5} bgColor="#fafafa" borderRadius="2xl">
          <Heading fontSize="2xl" mb={5}>
            How will my gas fee be paid?
          </Heading>
          <Button colorScheme="messenger">Connect a paymaster</Button>
        </Box>
        <Box mb={7} p={5} bgColor="#fafafa" borderRadius="2xl">
          <Heading fontSize="2xl" mb={5}>
            Which token should be used to pay the gas fee?
          </Heading>
          <Select
            mb={5}
            variant="filled"
            value={tokenType}
            onChange={event => setTokenType(event.target.value)}
          >
            <option value="USDC">USDC</option>
            <option value="ETH">ETH</option>
            <option value="TRON">TRON</option>
            <option value="BSC">BSC</option>
            <option value="ALGO">ALGO</option>
          </Select>
          <Button colorScheme="messenger">Save</Button>
        </Box>
      </Box>
    </Container>
  )
}

export default PaymasterPage
