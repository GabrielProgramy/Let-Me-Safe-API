import { Router } from "express";
import ContactsController from "../controller/ContactsController";
import { verifyJWT } from "../middleware/verifyJWT";

const contactsRoutes = Router();
const controller = new ContactsController();

contactsRoutes.post("/", verifyJWT, controller.createContact);
contactsRoutes.get("/:contactId", verifyJWT, controller.findContactById);
contactsRoutes.put("/me", verifyJWT, controller.updateContact);
contactsRoutes.get("/", verifyJWT, controller.listContacts);
contactsRoutes.delete("/:contactId", verifyJWT, controller.deleteContact);

export default contactsRoutes;
