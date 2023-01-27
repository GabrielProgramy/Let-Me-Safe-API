import { Repository } from "typeorm";
import Community from "../entities/Community";
import { postgresConnection } from "../connection";

export class CommunityRepository {
	private repository: Repository<Community>

	constructor() {
		this.repository = postgresConnection.getRepository('community')
	}

	async insertCommunity(community: Community): Promise<Community> {
		const newCommunity = await this.repository.create(community)

		return this.repository.save(newCommunity)
	}

	async findCommunityById(id: string): Promise<Community | undefined> {
		return this.repository.findOneBy({ id })
	}

	async getCommunities(): Promise<Community[]> {
		return this.repository.find()
	}

	async updateCommunity({ id, ...community }: Community): Promise<Community> {
		const updatedCommunity = await this.repository
			.createQueryBuilder().update(community).where({
				id
			}).returning('*').execute()

		return updatedCommunity.raw[0]
	}

	async deleteCommunity(communityId: string): Promise<void> {
		this.repository.delete({ id: communityId })
	}
}
