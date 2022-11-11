import Address from "../database/entities/Address";
import AddressRepository from "../database/repositories/AddressRepository";

export default class AddressService {
  private addressRepository: AddressRepository;

  constructor() {
    this.addressRepository = new AddressRepository();
  }

  async create(address: Address): Promise<Address> {
    const alreadyExistAddress = await this.findByCep(address.cep);

    if (alreadyExistAddress) return alreadyExistAddress;

    return this.addressRepository.insertAddress(address);
  }

  async findByCep(cep: string): Promise<Address> {
    const address = await this.addressRepository.findByCep(cep);

    if (!address) throw new Error("Address not found!");

    return address;
  }
}
