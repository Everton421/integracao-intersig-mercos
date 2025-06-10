
export type IResponseErrorApi = {
  response: {
    status: number,
    statusText: string,
  
 data: {
    error: {
      type:  string ,
      message: string,
      description: string,
      fields: [[object]]
    }
  }
  }
}