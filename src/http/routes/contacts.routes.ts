import { Router } from "express";
import ContactsController from "../controller/ContactsController";
import { verifyJWT } from "../middleware/verifyJWT";

const contactsRoutes = Router();
const controller = new ContactsController();

contactsRoutes.post("/", verifyJWT, controller.createContact);
contactsRoutes.get("/me/:contactId", verifyJWT, controller.findContactById);
contactsRoutes.put("/:contactId", verifyJWT, controller.updateContact);
contactsRoutes.get("/me", verifyJWT, controller.listContacts);
contactsRoutes.delete("/:contactId", verifyJWT, controller.deleteContact);

export default contactsRoutes;
