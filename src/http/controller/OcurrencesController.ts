import { Response } from 'express'
import OcurrencesService from '../../service/OcurrencesService'
import { RequestAlter } from '../middleware/verifyJWT'

export default class OcurrencesController {
	private static ocurrencesService: OcurrencesService

	constructor() {
		OcurrencesController.ocurrencesService = new OcurrencesService()
	}

	async createOcurrence(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const ocurrence = req.body
			const userId = req.user.sub



			const newOcurrences = await OcurrencesController.ocurrencesService.create({ ...ocurrence, userId })

			return res.status(201).json(newOcurrences)
		} catch (err) {
			console.log(err)
			return res.status(400).json({ err: err.message })
		}
	}

	async getOcurrences(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const ocurrences = await OcurrencesController.ocurrencesService.getOcurrences()

			return res.status(200).json(ocurrences)
		} catch (err) {
			console.log(err)
			return res.status(400).json({ err: err.message })
		}
	}

	async getOcurrencesMap(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const ocurrences = await OcurrencesController.ocurrencesService.getLastOcurrences()

			return res.status(200).json(ocurrences)
		} catch (err) {
			console.log(err)
			return res.status(400).json({ err: err.message })
		}
	}

	async getDangerousNeighborhoods(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const ocurrences = await OcurrencesController.ocurrencesService.getDangerousDistricts()

			return res.status(200).json(ocurrences)

		} catch (err) {
			console.log(err)
			return res.status(400).json({ err: err.message })
		}
	}

	async listOcurrencesNeighborhoods(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const neighborhood = req.query.neighborhood as string
			const ocurrences = await OcurrencesController.ocurrencesService.listOcurrencesNeighborhoods(neighborhood)

			return res.status(200).json(ocurrences)

		} catch (err) {
			console.log(err)
			return res.status(400).json({ err: err.message })
		}

	}

}
