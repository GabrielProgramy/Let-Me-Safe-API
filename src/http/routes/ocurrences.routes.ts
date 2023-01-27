import { Router } from 'express'
import OcurrencesController from '../controller/OcurrencesController'
import { verifyJWT } from '../middleware/verifyJWT'

const ocurrenceRoute = Router()
const controller = new OcurrencesController()

ocurrenceRoute.get('/', controller.getOcurrences)
ocurrenceRoute.post('/', verifyJWT, controller.createOcurrence)

export default ocurrenceRoute
