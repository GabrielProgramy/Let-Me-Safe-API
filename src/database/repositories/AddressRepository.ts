import { Repository } from "typeorm";
import { postgresConnection } from "../connection";
import Address from "../entities/Address";

export default class AddressRepository {
  private repository: Repository<Address>;

  constructor() {
    this.repository = postgresConnection.getRepository("address");
  }

  async insertAddress(address: Address): Promise<Address> {
    const newAddress = this.repository.create(address);
    return this.repository.save(newAddress);
  }

  async findByCep(cep: string): Promise<Address | undefined> {
    const address = await this.repository.findOneBy({
      cep,
    });
    return address;
  }
}
