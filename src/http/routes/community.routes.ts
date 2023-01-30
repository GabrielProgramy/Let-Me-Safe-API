import { Router } from 'express'
import CommunityController from '../controller/CommunityController'
import { verifyJWT } from '../middleware/verifyJWT'

const communityRouter = Router()
const controller = new CommunityController()

communityRouter.get('/all', verifyJWT, controller.getAllCommunity)
communityRouter.get('/me', verifyJWT, controller.getAllCommunityByOwner)
communityRouter.post('/', verifyJWT, controller.createCommunity)

export default communityRouter
