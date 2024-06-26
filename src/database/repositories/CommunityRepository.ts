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

	async findCommunityByArguments(options: object): Promise<Community[] | undefined> {
		return this.repository.find({
			where: options
		})
	}

	async getCommunities(owner?: string): Promise<Community[]> {
		return this.repository.find({
			where: { owner },
			relations: {
				// user: true
			}
		})
	}

	async updateCommunity({ id, ...community }: Community): Promise<Community> {
		const updatedCommunity = await this.repository.save({ id, ...community })

		return updatedCommunity
	}

	async deleteCommunity(communityId: string): Promise<void> {
		this.repository.delete({ id: communityId })
	}
}
