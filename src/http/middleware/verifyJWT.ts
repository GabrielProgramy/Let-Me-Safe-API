import { NextFunction, Request, Response } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'

export interface RequestAlter extends Request {
	user: string | JwtPayload
}

export function verifyJWT(req: RequestAlter, res: Response, next: NextFunction): Response {
	if (!req.headers.authorization) return res.status(401).json({ message: 'No token provided' })

	const token: string = req.headers.authorization.split(' ').pop()

	verify(token, process.env.JWT_SECRET, (err, decoded: JwtPayload) => {
		if (err) return res.status(500).json({ message: 'Failed to authenticate token' })

		if (new Date(decoded.exp * 1000) < new Date()) return res.status(403).json({ message: 'Token expired' })

		req.user = decoded
		next()
	})
}
