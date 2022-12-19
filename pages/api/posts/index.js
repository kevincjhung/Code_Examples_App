import titleFromCode from '../../../utils/titleFromCode.js'
import { PrismaClient } from '@prisma/client'
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from "../../../server/db/client"

export default async function handler(req, res) {
	const { method } = req;

	switch (method) {
		case 'GET':
			try {
				let posts = await prisma.post.findMany({
					orderBy: {
						createdAt: 'desc'
					},
					include: {
						user: true,
					}
				})

				posts = JSON.parse(JSON.stringify(posts)),

					res.status(200).json({ success: true, data: posts })
			} catch (error) {
				console.error(error)
				res.status(400).json({ success: false, message: error.message })
			}
			break;

		case 'POST':
			const session = await unstable_getServerSession(req, res, authOptions)

			// if user is not logged in, return 401
			if (!session) {
				console.error('log in before you create a post')
				res.status(401).json({ error: 'Unauthorized' })
			}

			const prismaUser = await prisma.user.findUnique({
				where: { email: session.user.email }
			})

			if (!prismaUser) {
				res.status(401).json({ error: 'No user with that email' })
			}

			const { language, code } = req.body;

			const title = titleFromCode(code);

			const post = await prisma.post.create({
				data: {
					title,
					language,
					code,
					userId: prismaUser.id
				}
			})


			res.status(201).json({ success: true, data: post });
			break

		default:
			res.setHeader('Allow', ['POST'])
			res.status(405).end(`Method ${method} Not Allowed`)
	}
}
