import { Contract, ethers } from 'ethers'

export class EthereumService {
  public provider: ethers.providers.JsonRpcProvider
  public signer: ethers.providers.JsonRpcSigner | null
  public readOnly: boolean

  public $token!: Contract
  public $marketplace!: Contract

  constructor() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      this.signer = this.provider.getSigner()
      this.readOnly = false
    } else {
      this.provider = new ethers.providers.InfuraProvider(
        parseInt(process.env.INFURA_NETWORK_ID as string),
        process.env.INFURA_PROJECT_ID
      )
      this.signer = null
      this.readOnly = true
    }

    this.provider.on('chainChanged', () => window.location.reload())
  }

  async initialize() {
    this.$token = await this.loadContract('PlanetToken')
    this.$marketplace = await this.loadContract('Marketplace')

    try {
      await this.getAddress()
    } catch (error) {}
  }

  isUsable() {
    return this.provider != null
  }

  async getAddress() {
    if (this.readOnly) {
      return undefined
    }

    let accounts = await this.provider.send('eth_accounts', [])
    if (!accounts.length) {
      accounts = await this.provider.send('eth_requestAccounts', [])
    }

    return accounts[0]
  }

  private async loadContract(name: string) {
    const chainId = parseInt(await this.provider.send('eth_chainId', []))

    const json = require(`@/contracts/${name}.json`)
    const network = json.networks[chainId]

    if (!network) {
      throw new Error(`address not found on network: ${network}`)
    }

    const address = network.address

    if (this.signer) {
      return new Contract(address, json.abi, this.signer)
    } else {
      return new Contract(address, json.abi, this.provider)
    }
  }

  get connected() {
    return this.provider && this.$token && this.$marketplace
  }
}
