import { Response } from 'express'
import OcurrencesService from '../../service/OcurrencesService'
import { RequestAlter } from '../middleware/verifyJWT'
import { Ocurrences } from '../../database/entities/Ocurrences'

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
			let occurrences: Ocurrences[]


			if (Object.keys(req.query).length > 0) {
				occurrences = await OcurrencesController.ocurrencesService.getOcurrences({
					type: req.query.type as string,
					district: req.query.district as string,
					startDate: new Date(req.query.startDate as string),
					endDate: new Date(req.query.endDate as string)
				})
			}
			else {
				occurrences = await OcurrencesController.ocurrencesService.getOcurrences()
			}

			return res.status(200).json(occurrences)
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

	async getMoreFrequentOccurrences(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const ocurrences = await OcurrencesController.ocurrencesService.getMoreFrequentOccurrences()

			return res.status(200).json(ocurrences)
		} catch (err) {
			console.log(err)
			return res.status(400).json({ err: err.message })
		}

	}

	async getNearbyOcurrences(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const lat = Number(req.query.lat)
			const log = Number(req.query.log)

			const ocurrences = await OcurrencesController.ocurrencesService.getNearbyOcurrences({ lat, log })

			return res.status(200).json(ocurrences)
		} catch (err) {
			console.log(err)
			return res.status(400).json({ err: err.message })
		}

	}

}
