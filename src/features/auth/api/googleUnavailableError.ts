export class GoogleUnavailableError extends Error {
  constructor() {
    super('Google provider disabled')
    this.name = 'GoogleUnavailableError'
  }
}
