import { PrismaClient } from '@prisma/client'
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from "../../../server/db/client"

export default async function posts(req, res) {
	const {
		query: { id },
		method
	} = req

	switch (method) {
		case 'GET':
			try {
				const post = await prisma.post.findUnique({
					where: { id: Number(id) },
					include: {
						user: true,
					}
				})

				res.status(200).json({ success: true, data: post })
			}
			catch (error) {
				console.error(error)
				res.status(400).json({ success: false, message: error.message.toString() })
			}
			break;

		default:
			res.status(400).json({ success: false, message: "method not allowed" })
			break
	}
}