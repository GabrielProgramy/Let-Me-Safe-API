import Community from "../database/entities/Community";
import { CommunityRepository } from "../database/repositories/CommunityRepository";

interface CommunityResponse extends Omit<Community, 'members'> {
	members: string[]
}

interface ISearchArguments {
	communityId?: string
	owner?: string
}

export default class CommunityService {
	private communityRepository: CommunityRepository

	constructor() {
		this.communityRepository = new CommunityRepository()
	}

	async create({ members, ...community }: Community): Promise<CommunityResponse> {
		const communityFormatted = {
			members: members.replace('[', '{').replace(']', '}'),
			...community
		}

		const newCommunity = await this.communityRepository.insertCommunity(communityFormatted)

		return {
			...newCommunity,
			members: JSON.parse(newCommunity.members.replace('{', '[').replace('}', ']'))
		}
	}

	async listAll(): Promise<Community[]> {
		return this.communityRepository.getCommunities()
	}

	async listAllByOwner(owner: string): Promise<Community[]> {
		return this.communityRepository.getCommunities(owner)
	}

	async findByArguments(options: ISearchArguments): Promise<>
}
