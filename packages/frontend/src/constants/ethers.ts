import { ethers } from 'ethers'

export const DEPLOY_PRIVATE_KEY =
  '0x283386a9b4020ac5031c20f889d236fc9325e231601db7e79a92d3a982382b1f'

export const provider = new ethers.providers.JsonRpcProvider(
  'https://goerli.infura.io/v3/9c9dde38d02b4f0ca0631ea01644dd29',
)
