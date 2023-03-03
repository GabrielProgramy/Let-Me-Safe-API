import Contacts from "../database/entities/Contacts";
import ContactsRepository from "../database/repositories/ContactsRepository";

export default class ContactsService {
  private contactsRepository: ContactsRepository;

  constructor() {
    this.contactsRepository = new ContactsRepository();
  }

  async createContact(contact: Contacts): Promise<Contacts> {
    const alreadyExistsContact =
      await this.contactsRepository.findContactByName(contact.name);

    if (alreadyExistsContact) throw new Error("Contact already exists!");

    return this.contactsRepository.insertContact(contact);
  }

  async findContactById(id: string): Promise<Contacts> {
    const contact = await this.contactsRepository.findContactById(id);

    if (!contact) throw new Error("Contact not found!");

    return contact;
  }

  async updateContact(contact: Contacts): Promise<Contacts> {
    await this.findContactById(contact.id);

    const updateContact = await this.contactsRepository.updateContact(contact);

    return updateContact;
  }

  async listContacts(userId: string): Promise<Contacts[]> {
    const listContacts = await this.contactsRepository.listContacts(userId);

    return listContacts;
  }

  async deleteContact(id: string): Promise<void> {
    await this.contactsRepository.deleteContact(id);
  }
}
