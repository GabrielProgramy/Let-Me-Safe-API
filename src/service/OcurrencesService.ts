import axios from 'axios'
import { Ocurrences } from '../database/entities/Ocurrences'
import OcurrencesRepository from '../database/repositories/OcurrencesRepository'
import AddressService from './AddressService'
import { VCAPI_STREET } from '../utils/viaCepAPI'
import { date, object } from 'joi'

export default class OcurrencesService {
	private ocurrencesRepository: OcurrencesRepository
	private addressService: AddressService

	constructor() {
		this.ocurrencesRepository = new OcurrencesRepository()
		this.addressService = new AddressService()
	}

	async create(ocurrence: Ocurrences): Promise<Ocurrences> {
		const { lat, log } = ocurrence.location as any
		const { data } = await axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?latitude=${lat}&longitude=${log}&types=street&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`)

		const searchAddress = await VCAPI_STREET(
			data.features[0].properties.name,
			data.features[0].properties.place_formatted.split('-').shift()
		)

		const address = await this.addressService.create({
			cep: searchAddress.cep.split('-').join(''),
			...searchAddress
		})

		ocurrence.addressId = address.id

		return this.ocurrencesRepository.insertOcurrences(ocurrence)
	}

	async getOcurrences(): Promise<Ocurrences[]> {

		return this.ocurrencesRepository.listOcurrences()
	}

	async getLastOcurrences(): Promise<Ocurrences[]> {
		const date = new Date()
		date.setDate(new Date().getDate() - 4)

		return this.ocurrencesRepository.listOcurrences(date)
	}



	async getDangerousDistricts() {
		const ocurrences = await this.ocurrencesRepository.getDangerousNeighborhoods()


		const object = ocurrences.reduce((acc, ocurrence) => {
			if (!acc.has(ocurrence.address_district)) {
				acc.set(ocurrence.address_district, 1)
			} else {
				acc.set(ocurrence.address_district, acc.get(ocurrence.address_district) + 1)
			}


			return acc
		}, new Map())



		return Object.fromEntries(object)
	}


	async listOcurrencesNeighborhoods(neighborhood: string) {
		const ocurrences = await this.ocurrencesRepository.listOcurrencesByNeighborhood(neighborhood)

		const object = ocurrences.reduce((acc, ocurrence) => {
			if (!acc.has(ocurrence.ocurrences_type)) {
				acc.set(ocurrence.ocurrences_type, 1)
			} else {
				acc.set(ocurrence.ocurrences_type, acc.get(ocurrence.ocurrences_type) + 1)
			}


			return acc
		}, new Map())



		return Object.fromEntries(object)
	}
}
