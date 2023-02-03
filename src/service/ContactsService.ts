import Contacts from "../database/entities/Contacts";
import ContactsRepository from "../database/repositories/ContactsRepository";

export default class ContactsService {
  private contactsRepository: ContactsRepository;

  constructor() {
    this.contactsRepository = new ContactsRepository();
  }

  //   async create(contacts: Contacts): Promise<Contacts> {
  //     const alreadyExistContacts = await this.findByEmail(contacts.email);
  //   }
}
