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
            Which Paymaster will pay for my gas fee?
          </Heading>
          <Select
            mb={1}
            variant="filled"
            value={tokenType}
            onChange={event => setTokenType(event.target.value)}
          >
            <option value="Default (0x21f9c4495846a2e2d0233512b98d9307fe7d92fb)">Default (0x21f9c4495846a2e2d0233512b98d9307fe7d92fb)</option>
          </Select>
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
