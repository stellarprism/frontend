import { Plugin } from '@nuxt/types'
import { EthereumService } from '~/services/Ethereum'

const plugin: Plugin = async (context, inject) => {
  const service = new EthereumService()

  try {
    await service.initialize()
  } catch (error: Error | any) {
    console.error('Failed to initialize ethereum service', error)
  }

  inject('ethereum', service)
}

export default plugin
