import { Ocurrences } from '../database/entities/Ocurrences'
import OcurrencesRepository from '../database/repositories/OcurrencesRepository'

export default class OcurrencesService {
  private ocurrencesRepository: OcurrencesRepository

  constructor() {
    this.ocurrencesRepository = new OcurrencesRepository()
  }

  async create(ocurrence: Ocurrences): Promise<Ocurrences> {
    return this.ocurrencesRepository.insertOcurrences(ocurrence)
  }

  async getOcurrences(): Promise<Ocurrences[]> {
    return this.ocurrencesRepository.listOcurrences()
  }
}
