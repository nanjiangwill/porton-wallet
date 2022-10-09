import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react'
import { useWebAuthn } from 'components/WebAuthnContext'
import { provider } from 'constants/ethers'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Profile.module.scss'
import { getDefaultProvider } from 'ethers'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { address, signOut } = useWebAuthn()
  const [currentAddress, setcurrentAddress] = useState(
    'https://goerli.etherscan.io/address/0x45896af59d7F83Ff4E39503FA180907aec041002',
  )
  const [ensName, setEnsName] = useState('')
  const [ethBalance, setETHBalance] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      provider
        .getBalance(address!)
        .then(balance => setETHBalance(balance.toNumber()))

      let num2 = await getUsdcBalance(address!)
      setUSDCBalance(num2)
      const providerETH = getDefaultProvider('homestead')
      const ENSName = await providerETH.lookupAddress(currentAddress)
      if (ENSName !== null) {
        setEnsName(ENSName)
      }
    }
  }, [address])

  const [usdcBalance, setUSDCBalance] = useState(0)
  // const usdcContractAddr = "0x07865c6e87b9f70255377e024ace6630c1eaa37f"

  // const provider = ...; (use ethers.providers.InfuraProvider for a Node app or ethers.providers.Web3Provider(window.ethereum/window.web3) for a React app)

  // const balance = (contract.balanceOf(address!)).toNumber();
  async function getUsdcBalance(addr: string) {
    const ethers = require('ethers')
    const genericErc20Abi = [
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
          {
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_spender',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_from',
            type: 'address',
          },
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            name: '',
            type: 'uint8',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
          {
            name: '_spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ]
    const tokenContractAddress = '0x07865c6e87b9f70255377e024ace6630c1eaa37f'
    const contract = new ethers.Contract(
      tokenContractAddress,
      genericErc20Abi,
      provider,
    )
    let num = await contract.balanceOf(addr)
    console.log(num)
    console.log(num.toNumber())
    let a = num.toNumber()
    return a
  }

  //   async function getAmount(currency, address) {
  //     const amount = await currency.contract.methods.balanceOf(address).call();
  //     return amount * currency.usdrate;
  //  }

  return (
    <Container className={styles.page} maxW="container.lg" py={16}>
      <Box mb={16}>
        <Heading mb={3}>My Account{ensName}</Heading>
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
            {usdcBalance} USDC
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
