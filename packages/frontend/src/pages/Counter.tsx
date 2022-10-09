import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import styles from './Counter.module.scss'

const CounterPage = () => {
  const [count, setCount] = useState(0)

  const handleIncrease = () => {
    setCount(count => count + 1)
  }

  const handleDecrease = () => {
    setCount(count => count - 1)
  }

  return (
    <Container className={styles.page} maxW="container.lg" py={16}>
      <Box mb={10} ml={-3}>
        <IoArrowBack
          size={60}
          className={styles.back}
          onClick={() => window.history.back()}
        />
      </Box>
      <Heading mb={7}>DEMO: Counter</Heading>
      <Text fontSize="2xl" mb={7}>
        This is a simple on-chain counter game. With Porton Wallet, you don't
        pay gas fee for your transactions.
      </Text>
      <Box p={5} bgColor="#fafafa" borderRadius="2xl">
        <Text fontSize="5xl" fontWeight="light">
          {count}
        </Text>
        <Flex mt={3} gap={3}>
          <Button colorScheme="messenger" onClick={handleIncrease}>
            Increase
          </Button>
          <Button colorScheme="messenger" onClick={handleDecrease}>
            Decrease
          </Button>
        </Flex>
      </Box>
    </Container>
  )
}

export default CounterPage
