import { Repository } from 'typeorm'
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
    return this.repository.find()
  }
}
