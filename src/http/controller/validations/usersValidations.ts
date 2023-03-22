import Joi from "joi";

export const createUserSchema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	confirmPassword: Joi.string(),
	phone: Joi.string().required(),
	birthDate: Joi.date().required(),
})

export const updateUserSchema = Joi.object({
	firstName: Joi.string(),
	lastName: Joi.string(),
	email: Joi.string().email(),
	password: Joi.string(),
	phone: Joi.string(),
	birthDate: Joi.date(),
	cep: Joi.string()
})

export const authUserSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
})
