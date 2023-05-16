import { MoreThanOrEqual, Repository } from 'typeorm'
import { postgresConnection } from '../connection'
import { Ocurrences } from '../entities/Ocurrences'

export default class OcurrencesRepository {
	private repository: Repository<Ocurrences>

	constructor() {
		this.repository = postgresConnection.getRepository('ocurrences')
	}

	async insertOcurrences(ocurrence: Ocurrences): Promise<Ocurrences> {
		const newOcurrences = this.repository.create(ocurrence)
		return this.repository.save(newOcurrences)
	}

	async listOcurrences(): Promise<Ocurrences[]> {

		return this.repository.find({
			relations: ['address']
		})
	}

	async getDangerousNeighborhoods(): Promise<{ ocurrences_id: string; address_district: string; }[]> {
		return this.repository.createQueryBuilder('ocurrences')
			.innerJoinAndSelect('ocurrences.address', 'address')
			.select(['ocurrences.id', 'address.district'])
			.getRawMany()
	}

	async getMoreOcurrences(): Promise<{ type: string; quantity: number }[]> {
		return this.repository.createQueryBuilder('ocurrences')
			.select('type')
			.addSelect('COUNT(type)', 'quantity')
			.groupBy('type')
			.orderBy('quantity', 'DESC')
			.getRawMany()

	}


}
