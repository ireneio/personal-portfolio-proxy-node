import { AxiosRequestConfig, AxiosResponse } from 'axios'
import api from './api'

export interface ResponseBody {
  status?: number,
  message?: string,
  data?: any
}

export class HttpResponse {
  constructor(status?: number, message?: string, data?: any) {
    if(status)  this.status = status
    if(message) this.message = message
    if(data) this.data = data
  }

  private message: string = ''

  private status: number = 200

  private data: string = ''

  public setResponse(response: ResponseBody): void {
    if(response.status) this.status = Number(response.status)
    if(response.message) this.message = response.message
    if(response.data) this.data = JSON.stringify(response.data)
  }
}

export interface RequestBody {
  authorization?: string,
  acceptLanguage?: string,
  method: "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" |
  "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH" | "purge" | "PURGE" | "link" | "LINK" | "unlink" | "UNLINK" | undefined,
  endpoint: string,
  data: any,
  contentType?: string
}

export class HttpRequest {
  constructor(request: RequestBody, API_URL: string) {
    this.request = request
    this.endpoint = request.endpoint
    this.API_URL = API_URL
  }

  private request: RequestBody

  private API_URL = ''

  private endpoint: string = ''

  private config: AxiosRequestConfig = {
    method: undefined,
    headers: {},
    data: undefined
  }

  private setHeadersAndBaseConfig(request: RequestBody): void {
    const { authorization, method, contentType, acceptLanguage } = request

    this.config.method = method

    const headers: { [index: string]: string } = {}
    if(contentType) {
      headers['content-type'] = contentType
    }
    if(authorization) {
      headers.authorization = authorization
    }
    if(acceptLanguage) {
      headers.acceptLanguage = acceptLanguage
    }
    this.config.headers = headers
  }

  private mapData(): FormData | null | any {
    const { contentType, data, method } = this.request

    if(method?.toUpperCase() === 'GET') {
      return null
    } else if(contentType === 'application/json') {
      return data
    } else if(contentType === 'multipart/formdata') {
      const formData = new FormData()
      data.forEach((item: any) => {
        formData.append(item, data[item])
      })
      return formData
    } else {
      throw new HttpResponse(400, 'Request "contentType" Not Supported. JSON or Multipart/Formdata only.')
    }
  }

  private async sendRequest(): Promise<AxiosResponse<any>> {
    try {
      const response: AxiosResponse<any> = await api(`${this.API_URL}${this.endpoint}`, this.config)
      return response
    } catch(e) {
      throw new HttpResponse(e.status, e.message)
    }
  }

  private setData(): void {
    const reqBody = this.mapData()
    this.config.data = reqBody
  }

  private parseData(data: any): any {
    return JSON.parse(JSON.stringify(data))
  }

  public async init() {
    const response = new HttpResponse()
    try {
      this.setHeadersAndBaseConfig(this.request)
      this.setData()
      const { data } = await this.sendRequest()
      const responseData = this.parseData(data)
      response.setResponse({ status: 200, message: 'success', data: responseData })
    } catch(e) {
      response.setResponse({ status: e.status, message: e.message })
    } finally {
      return response
    }
  }
}
