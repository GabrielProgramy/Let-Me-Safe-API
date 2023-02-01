import { Response } from 'express'
import CommunityService from '../../service/CommunityService'
import { RequestAlter } from '../middleware/verifyJWT'

export default class CommunityController {
	private static communityService: CommunityService

	constructor() {
		CommunityController.communityService = new CommunityService()
	}

	async createCommunity(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const body = req.body

			const newCommunity = await CommunityController.communityService.create({
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
			const community = await CommunityController.communityService.listAll()
			return res.status(200).json(community)
		} catch (err) {
			console.log(err)
			return res.status(500).json({ message: err.message })
		}
	}

	async getAllCommunityByOwner(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const owner = req.user.sub as string

			const community = await CommunityController.communityService.listAllByOwner(owner)
			return res.status(200).json(community)
		} catch (err) {
			console.log(err)
			return res.status(500).json({ message: err.message })
		}
	}

	async searchCommunity(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const id = req.query.id as string
			const nameCommunity = req.query.nameCommunity as string
			const nameOwner = req.query.nameOwner as string

			const community = await CommunityController.communityService.findByArguments({
				id, nameCommunity, nameOwner
			})

			return res.status(200).json(community)
		} catch (error) {
			console.error(error)
			return res.status(500).json(error)
		}
	}

	async deleteCommunity(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const id = req.params.id
			const owner = req.user.sub as string

			await CommunityController.communityService.deleteCommunity(id, owner)

			return res.status(204).end()
		} catch (err) {
			console.log(err)
			return res.status(500).json({ message: err.message })
		}

	}

	async updateCommunity(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const id = req.params.communityId
			const { name, description, privacy } = req.body

			const updatedCommunity = await CommunityController.communityService.updateCommunity({
				id,
				name,
				description,
				privacy,
			})

			return res.status(200).json(updatedCommunity)
		} catch (err) {
			console.log(err)
			return res.status(500).json({ message: err.message })
		}
	}

	async addMember(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const id = req.params.communityId
			const members = req.body.members

			const community = await CommunityController.communityService.addMember(id, members)

			return res.status(200).json(community)
		} catch (err) {
			console.log(err)
			return res.status(500).json({ message: err.message })
		}
	}

	async removeMember(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const id = req.params.communityId
			const members = req.body.members

			const community = await CommunityController.communityService.removeMember(id, members)

			return res.status(200).json(community)
		} catch (err) {
			console.log(err)
			return res.status(500).json({ message: err.message })
		}
	}

}
