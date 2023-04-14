import { Router } from 'express'
import OcurrencesController from '../controller/OcurrencesController'
import { verifyJWT } from '../middleware/verifyJWT'

const ocurrenceRoute = Router()
const controller = new OcurrencesController()

ocurrenceRoute.get('/', controller.getOcurrencesMap)
ocurrenceRoute.get('/dangerous-neighborhoods', verifyJWT, controller.getDangerousNeighborhoods)
ocurrenceRoute.get('/ocurrences-neighborhoods', verifyJWT, controller.listOcurrencesNeighborhoods)
ocurrenceRoute.get('/all', verifyJWT, controller.getOcurrences)
ocurrenceRoute.post('/', verifyJWT, controller.createOcurrence)

export default ocurrenceRoute
