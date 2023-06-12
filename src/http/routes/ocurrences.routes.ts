import { Router } from 'express'
import OcurrencesController from '../controller/OcurrencesController'
import { verifyJWT } from '../middleware/verifyJWT'

const ocurrenceRoute = Router()
const controller = new OcurrencesController()

ocurrenceRoute.get('/', controller.getOcurrencesMap)
ocurrenceRoute.get('/dangerous-neighborhoods', verifyJWT, controller.getDangerousNeighborhoods)
ocurrenceRoute.get('/frequent', verifyJWT, controller.getMoreFrequentOccurrences)
ocurrenceRoute.get('/all', verifyJWT, controller.getOcurrences)
ocurrenceRoute.post('/', verifyJWT, controller.createOcurrence)
ocurrenceRoute.get('/nearby', verifyJWT, controller.getNearbyOcurrences)
ocurrenceRoute.get('/safe-route', verifyJWT, controller.getSafeRoute)

export default ocurrenceRoute




