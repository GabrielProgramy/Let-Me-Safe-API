import Community from "../database/entities/Community";
import { Users } from "../database/entities/User";
import { CommunityRepository } from "../database/repositories/CommunityRepository";
import UsersService from "./UsersService";

interface CommunityResponse extends Omit<Community, 'members'> {
	members: string[]
}

interface ISearchArguments {
	id?: string
	nameCommunity?: string
	nameOwner?: string
}

export default class CommunityService {
	private communityRepository: CommunityRepository
	private userService: UsersService

	constructor() {
		this.communityRepository = new CommunityRepository()
		this.userService = new UsersService()
	}

	private formatValues(a: Community): CommunityResponse {
		return {
			...a,
			members: JSON.parse(a.members.replace('{', '[').replace('}', ']'))
		}
	}

	async create({ members, ...community }: Community): Promise<CommunityResponse> {
		const communityFormatted = {
			members: members.replace('[', '{').replace(']', '}'),
			...community
		}

		const newCommunity = await this.communityRepository.insertCommunity(communityFormatted)

		return this.formatValues(newCommunity)
	}

	async listAll(): Promise<Community[]> {
		return this.communityRepository.getCommunities()
	}

	async listAllByOwner(owner: string): Promise<Community[]> {
		return this.communityRepository.getCommunities(owner)
	}

	async findByArguments(options: ISearchArguments): Promise<Community[]> {
		const user = await this.userService.findUser({ firstName: options.nameOwner })

		const searchParameters = {
			id: options.id,
			name: options.nameCommunity,
			user
		}

		const community = await this.communityRepository.findCommunityByArguments(searchParameters)


		if (!community) throw new Error('Community not found!')

		return community
	}

	async deleteCommunity(communityId: string, owner: string): Promise<void> {
		const [community] = await this.findByArguments({ id: communityId })

		if (owner !== community.owner) throw new Error('User not owner this community!')

		await this.communityRepository.deleteCommunity(communityId)
	}

	async updateCommunity(updateData: Community): Promise<Community> {
		await this.findByArguments({ id: updateData.id })

		return this.communityRepository.updateCommunity(updateData)
	}

	async addMember(communityId: string, members: string[]): Promise<CommunityResponse> {
		const [existsCommunity] = await this.findByArguments({ id: communityId })

		const membersInserted = Array.from(existsCommunity.members)

		members.map((member) => {
			const existsMember = membersInserted.filter(inserted => inserted === member)

			if (existsMember.length === 0) membersInserted.push(member)
		})

		const membersUpdated = await this.communityRepository.updateCommunity({
			id: communityId,
			members: JSON.stringify(membersInserted).replace('[', '{').replace(']', '}')
		})

		return this.formatValues(membersUpdated)
	}

	async removeMember(communityId: string, members: string[]) {
		const [existsCommunity] = await this.findByArguments({ id: communityId })

		const membersInserted = Array.from(existsCommunity.members)

		const [membersFilter] = members.map(member => membersInserted.filter(inserted => member !== inserted))

		const membersUpdated = await this.communityRepository.updateCommunity({
			id: communityId,
			members: JSON.stringify(membersFilter).replace('[', '{').replace(']', '}')
		})

		return this.formatValues(membersUpdated)
	}
}
