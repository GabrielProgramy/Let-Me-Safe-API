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

	async listOcurrences(date?: Date): Promise<Ocurrences[]> {
		const options = date ? { date: MoreThanOrEqual(date) } : {}

		return this.repository.find({
			where: options
		})
	}

	async getDangerousNeighborhoods(): Promise<{ ocurrences_id: string; address_district: string; }[]> {
		return this.repository.createQueryBuilder('ocurrences')
			.innerJoinAndSelect('ocurrences.address', 'address')
			.select(['ocurrences.id', 'address.district'])
			.getRawMany()
	}

	async listOcurrencesByNeighborhood(neighborhood: string): Promise<{ ocurrences_id: string; ocurrences_type: string }[]> {
		return this.repository.createQueryBuilder('ocurrences')
			.innerJoinAndSelect('ocurrences.address', 'address')
			.andWhere('address.district = :neighborhood', { neighborhood })
			.select(['ocurrences.id', 'ocurrences.type'])
			.getRawMany()
	}
}
