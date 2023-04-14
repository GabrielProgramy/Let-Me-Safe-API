import { Router } from "express"
import UsersController from "../controller/UsersController"
import { verifyJWT } from "../middleware/verifyJWT"
import uploadFile from "../middleware/avatarUpload"

const usersRoutes = Router()
const controller = new UsersController()


usersRoutes.post("/auth", controller.authenticateUser)
// usersRoutes.post("/auth/google", controller.authenticateGoogle)
usersRoutes.post("/", controller.createUser)
usersRoutes.put("/me", verifyJWT, uploadFile, controller.updateUser)
usersRoutes.get("/:userId", verifyJWT, controller.findUser)

export default usersRoutes
