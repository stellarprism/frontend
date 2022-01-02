import * as IPFS from 'ipfs-core'

export class IPFSService {
  client!: IPFS.IPFS

  async initialize() {
    this.client = await IPFS.create()
  }

  async read(path: string, encoding = 'utf-8') {
    if (path.startsWith('ipfs://')) {
      path = path.substring(7)
    }

    if (path.startsWith('ipfs/')) {
      path = path.substring(5)
    }

    const decoder = new TextDecoder(encoding)

    let output = ''
    for await (const chunk of this.client.cat(path)) {
      output += decoder.decode(chunk)
    }

    return output
  }
}
