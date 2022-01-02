import { Contract, ethers } from 'ethers'
import { ExternalProvider } from '~/types/ethereum'

export class EthereumService {
  provider: ExternalProvider
  wrapper!: ethers.providers.Web3Provider

  $token!: Contract
  $marketplace!: Contract

  constructor() {
    if ((this.provider = window.ethereum)) {
      this.wrapper = new ethers.providers.Web3Provider(this.provider)

      this.wrapper.on('chainChanged', () => window.location.reload())
    }
  }

  async initialize() {
    this.$token = await this.loadContract('PlanetToken')
    this.$marketplace = await this.loadContract('Marketplace')

    try {
      await this.getAddress()
    } catch (error) {}
  }

  isUsable() {
    return this.wrapper != null
  }

  async getAddress() {
    let accounts = await this.provider!.request({ method: 'eth_accounts' })
    if (!accounts.length) {
      accounts = await this.provider!.request({ method: 'eth_requestAccounts' })
    }

    return accounts[0]
  }

  private async loadContract(name: string) {
    const chainId = parseInt(
      await this.provider.request({ method: 'eth_chainId' })
    )

    const json = require(`@/contracts/${name}.json`)
    const address = json.networks[chainId].address

    const signer = this.wrapper!.getSigner()
    return new Contract(address, json.abi, signer)
  }
}
