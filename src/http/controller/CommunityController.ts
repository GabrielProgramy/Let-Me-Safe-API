import { Response } from 'express'
import CommunityService from '../../service/CommunityService'
import { RequestAlter } from '../middleware/verifyJWT'
import Community from '../../database/entities/Community'

export default class OcurrencesController {
	private static communityService: CommunityService

	constructor() {
		OcurrencesController.communityService = new CommunityService()
	}

	async createCommunity(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const body = req.body

			const newCommunity = await OcurrencesController.communityService.create({
				name: body.name,
				description: body.description,
				owner: String(req.user.sub),
				privacy: body.privacy,
				members: JSON.stringify(body.members)
			})


			return res.status(201).json(newCommunity)
		}
		catch (err) {
			console.log(err)
			return res.status(500).json({ message: err.message })
		}
	}

	async getAllCommunity(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const community = await OcurrencesController.communityService.listAll()
			return res.status(200).json(community)
		} catch (err) {
			console.log(err)
			return res.status(500).json({ message: err.message })
		}
	}

	async getAllCommunityByOwner(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const owner = req.user.sub as string

			const community = await OcurrencesController.communityService.listAllByOwner(owner)
			return res.status(200).json(community)
		} catch (err) {
			console.log(err)
			return res.status(500).json({ message: err.message })
		}
	}
}
