import { Router } from 'express'
import CommunityController from '../controller/CommunityController'
import { verifyJWT } from '../middleware/verifyJWT'

const communityRouter = Router()
const controller = new CommunityController()

communityRouter.get('/all', verifyJWT, controller.getAllCommunity)
communityRouter.get('/me', verifyJWT, controller.getAllCommunityByOwner)
communityRouter.get('/search', verifyJWT, controller.searchCommunity)
communityRouter.post('/', verifyJWT, controller.createCommunity)
communityRouter.put('/:communityId', verifyJWT, controller.updateCommunity)
communityRouter.patch('/:communityId/add', verifyJWT, controller.addMember)
communityRouter.patch('/:communityId/remove', verifyJWT, controller.removeMember)
communityRouter.delete('/:id', verifyJWT, controller.deleteCommunity)

export default communityRouter
