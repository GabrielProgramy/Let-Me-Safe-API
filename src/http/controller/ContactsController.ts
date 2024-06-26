import { Request, Response } from "express";
import ContactsService from "../../service/ContactsService";
import { RequestAlter } from "../middleware/verifyJWT";

export default class ContactsController {
  private static contactsService: ContactsService;

  constructor() {
    ContactsController.contactsService = new ContactsService();
  }

  async createContact(req: RequestAlter, res: Response): Promise<Response> {
    try {
      const { name, email, phone } = req.body;

      const userId = req.user.sub as string;

      const newContact = await ContactsController.contactsService.createContact(
        {
          name,
          email,
          phone,
          userId,
        }
      );

      return res.status(201).json(newContact);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  }

  async findContactById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.contactId;

      const contact = await ContactsController.contactsService.findContactById(
        id
      );

      return res.status(200).json(contact);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async updateContact(req: Request, res: Response): Promise<Response> {
    try {
      const contact = req.body;

      const contactId = req.params.contactId;

      const updateContact =
        await ContactsController.contactsService.updateContact({
          ...contact,
          id: contactId,
        });

      return res.status(200).json(updateContact);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async listContacts(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.userId;

      const listContacts =
        await ContactsController.contactsService.listContacts(userId);

      return res.status(200).json(listContacts);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.contactId;

      await ContactsController.contactsService.deleteContact(id);

      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}
