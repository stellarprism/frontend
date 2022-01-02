export type ExternalProvider = {
  isMetaMask: boolean
  isStatus: boolean
  host: string
  path: string
  chainId: string
  sendAsync: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void
  send: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void
  request: (request: { method: string; params?: Array<any> }) => Promise<any>
}

declare global {
  interface Window {
    ethereum: ExternalProvider
  }
}
