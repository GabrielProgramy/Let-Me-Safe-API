import { Repository } from "typeorm";
import { postgresConnection } from "../connection";
import Contacts from "../entities/Contacts";

export default class ContactsRepository {
  private repository: Repository<Contacts>;

  constructor() {
    this.repository = postgresConnection.getRepository("contacts");
  }

  async insertContact(contact: Contacts): Promise<Contacts> {
    const newContact = this.repository.create(contact);
    return this.repository.save(newContact);
  }

  async findContactByName(name: string): Promise<Contacts | undefined> {
    const contact = await this.repository.findOneBy({
      name,
    });
    return contact;
  }

  async findContactById(id: string): Promise<Contacts | undefined> {
    const contact = await this.repository.findOneBy({
      id,
    });
    return contact;
  }

  async updateContact({ id, ...contact }: Contacts): Promise<Contacts> {
    const updateContact = await this.repository
      .createQueryBuilder()
      .update(contact)
      .where({
        id,
      })
      .returning("*")
      .execute();

    return updateContact.raw[0];
  }

  async listContacts(id: string): Promise<Contacts[]> {
    const contacts = await this.repository.find({
      where: { id },
    });
    return contacts;
  }

  async deleteContact(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
