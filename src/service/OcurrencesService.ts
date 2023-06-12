import axios from 'axios'
import { getDistance } from 'geolib'
import { Ocurrences } from '../database/entities/Ocurrences'
import OcurrencesRepository from '../database/repositories/OcurrencesRepository'
import AddressService from './AddressService'
import { VCAPI_STREET } from '../utils/viaCepAPI'
import { randomUUID } from 'node:crypto'

import fetch from 'node-fetch'

interface NearbyOcurrences extends Omit<Ocurrences, 'Address'> {
	distance: number,
	district: string
}

interface IFilterData {
	type: string,
	district: string,
	startDate: Date,
	endDate: Date
}

type LatLng = { lat: number, log: number }

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

	async getOcurrences(filter?: IFilterData): Promise<Ocurrences[]> {
		const ocurrences = await this.ocurrencesRepository.listOcurrences()

		if (filter) return ocurrences.filter(ocurrence => {
			let valido = true;

			if (filter.type && ocurrence.type !== filter.type) valido = false;

			if (filter.district && ocurrence.address.district !== filter.district) valido = false;

			if (filter.startDate && new Date(ocurrence.date) < new Date(filter.startDate)) valido = false;

			if (filter.endDate && new Date(ocurrence.date) > new Date(filter.endDate)) valido = false;

			if (valido) return ocurrence

		})

		return ocurrences
	}

	async getLastOcurrences(): Promise<Ocurrences[]> {
		const date = new Date()
		date.setDate(new Date().getDate() - 4)

		const lastOcurrences = (await this.ocurrencesRepository.listOcurrences()).filter(ocurrence => ocurrence.date >= date)

		return lastOcurrences
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

		const neighborhoods = []

		object.forEach((value, key) => {
			neighborhoods.push({
				id: randomUUID(),
				neighborhood: key,
				ocurrences: value
			})
		})

		return neighborhoods
	}

	async getMoreFrequentOccurrences() {
		const frequentOccurences = await this.ocurrencesRepository.getMoreOcurrences()

		return frequentOccurences.map((fo) => {
			return {
				id: randomUUID(),
				...fo
			}
		})
	}



	async getNearbyOcurrences(location: LatLng): Promise<NearbyOcurrences[]> {
		const occurrences = await this.getLastOcurrences()

		const occurrencesWithinRadius = occurrences.map(({ address, addressId, userId, ...occurrence }) => {
			const { district } = address
			const occurrenceObject = JSON.parse(JSON.stringify(occurrence.location))


			const distance = getDistance({
				latitude: location.lat,
				longitude: location.log,
			}, {
				latitude: occurrenceObject.lat,
				longitude: occurrenceObject.log,
			});

			if (distance <= 2000) return {
				...occurrence,
				distance,
				district
			}
		});


		return occurrencesWithinRadius.filter(occurrence => occurrence)
	}

	private async newSafeRoute(origin: LatLng, destination: LatLng, occurrences: Ocurrences[], excludePoints?: LatLng[], definedRoute?: Array<[number, number]>) {

		const path = excludePoints
			? `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.log},${origin.lat};${destination.log},${destination.lat}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&geometries=geojson&exclude=${excludePoints.map(({ lat, log }) => `point(${log.toString()} ${lat.toString()})`).toString()}`
			: `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.log},${origin.lat};${destination.log},${destination.lat}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&geometries=geojson`
		const route = await fetch(path)
		const routeJson = await route.json()
		const routesCoordinates: Array<[number, number]> = routeJson.routes[0].geometry.coordinates

		const rangeRadius = occurrences.map(({ location }) => {
			for (const route of routesCoordinates) {
				const occurrenceObject = JSON.parse(JSON.stringify(location))
				const distance = getDistance({
					latitude: occurrenceObject.lat,
					longitude: occurrenceObject.log
				}, {
					latitude: route[1],
					longitude: route[0],
				})

				if (distance <= 100) return occurrenceObject
			}

		}).filter(occurrence => occurrence !== undefined)

		if (rangeRadius.length === 0) return {
			severity: 'safe',
			coordinates: routesCoordinates
		}

		if (JSON.stringify(routesCoordinates) === JSON.stringify(definedRoute)) {
			return {
				severity: 'dangerous',
				coordinates: routesCoordinates
			}
		}

		if (definedRoute && JSON.stringify(routesCoordinates) !== JSON.stringify(definedRoute) && rangeRadius.length > 0) {
			return {
				severity: 'dangerous',
				coordinates: routesCoordinates
			}
		}

		if (rangeRadius.length > 0) return this.newSafeRoute(origin, destination, occurrences, rangeRadius, routesCoordinates)



		return routesCoordinates
	}



	async secureRoute(origin: LatLng, destination: LatLng) {
		const occurrences = await this.getOcurrences()

		const safeRoute = await this.newSafeRoute(origin, destination, occurrences)
		return safeRoute
	}

}
