import express, { Router, Request, Response } from "express"
import IncomingRequestProcessor from "../utils/processor"
import { HttpResponse } from "../utils/http"
const router: Router = express.Router()

// [api] send request
router.post('/api', async (req: Request, res: Response) => {
  const processor = new IncomingRequestProcessor()
  const result = await processor.init(req)
  res.send(result)
})

/* GET server health. */
router.get('/health', function(req: Request, res: Response, next: Function): void {
  res.send(new HttpResponse(200, 'success'))
})

export default router
