import { HttpRequest, HttpResponse } from './http'
import { Request } from 'express'

const API_URL = process.env.NODE_APP_API_URL || ''

export default class IncomingRequestProcessor {
  constructor() {}

  private getRequestType(request: Request): string | string[] | undefined {
    const headers = request.headers
    if(!headers) {
      return 'application/json'
    }
    return headers['content-type']
  }

  private getRequestBody(request: Request): any {
    return Object.keys(request.body).length > 0 ? request.body : null
  }

  private verifyRequestType(type: string | string[] | undefined): boolean {
    return type !== undefined && type.includes('application/json')
  }

  public async init(incRequest: Request): Promise<HttpResponse> {
    const body = this.getRequestBody(incRequest)
    const type = this.getRequestType(incRequest)
    const { authorization, 'accept-language': acceptLanguage } = incRequest.headers

    try {
      const isValidRequestType = this.verifyRequestType(type)

      if(isValidRequestType) {
        const request = new HttpRequest({
          data: body.data ? body.data : null,
          authorization,
          acceptLanguage,
          method: body.method,
          endpoint: body.endpoint,
          contentType: type as string
        }, API_URL)
        return await request.init()
      } else {
        throw new Error('Body Format to the Server Is Not Accepted.')
      }
    } catch(e) {
      return new HttpResponse(400, e.message)
    }
  }
}
