import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()
import { prisma } from "../../../server/db/client"

export default async function comments(req, res) {
	const {
		query: { id },
		method
	} = req

	switch (method) {
		case 'GET':  	// get all comments for a single post
			try {
				const comments = await prisma.comment.findMany({
					where: { postId: Number(id) },
					include: {
						user: true,
					}
				})
			
				res.status(200).json({ success: true, data: comments })
			}
			catch (error) {
				res.status(400).json({ success: false, message: error.message.toString() })
			}
			break;


		case 'POST':  	// create a new comment
			try {
				let { comment, session }	= req.body
				
				// get the user id from the session
				let userId = await prisma.user.findUnique({
					where: { email: session.user.email },
					select: { id: true }
				})
				userId = userId.id
				
				// Create the comment
				await prisma.comment.create({
					data: {
						content: comment, 
						userId: userId,
						postId: Number(id)
					},
				})

				// get the number of comments for this post
				let numComments = await prisma.comment.count({
					where: { postId: Number(id) }
				})
				
				// update the number of comments in the given post
				let newNumOfComments = await prisma.post.update({
					where: { id: Number(id) },
					data: { totalComments: numComments }
				})
				
				res.status(201).json({ success: true, data: "comment successfully added" })
			} catch(error){
				console.log(error) 
				res.status(400).json({ success: false, message: error.toString() })
			}
			break

		default:
		res.status(400).json({ success: false, message: "method not allowed" })
		break
	}
}