import { PrismaClient } from '@prisma/client'
import { prisma } from "../../../server/db/client"

export default async function likes(req, res) {
	const {
		query: { id },
		method
	} = req

	switch (method) {
		case 'GET': 
			try {
				
				res.status(200).json({ success: true, data: id })
			}
			catch (error) {
				console.error(error)
				res.status(400).json({ success: false, message: error.message.toString() })
			}
			break;

		// liking/unliking a post 
		case 'POST': 
			try {
				let { session, liked }	= req.body
				
				console.log(`liked: ${liked}`)
				
				// get user id with email from session
				let current_user = await prisma.user.findUnique({
					where: {
						email: session.user.email
					}
				})
				let user_id = current_user.id


				if(!liked){ // user has not liked the post yet, add like
					// add like to the like table 
					let addLike = await prisma.like.create({
						data: {
							userId: user_id,
							postId: Number(id)
						}
					})
				} else { // user has liked the post, remove like
					// remove like from the like table
					let removeLike = await prisma.like.deleteMany({
						where: {
							userId: user_id,
							postId: Number(id)
						}
					})
				}

				
				res.status(201).json({ success: true, data: `POST /api/likes/${id}` })
			} catch(error){
				console.error(error) 
				res.status(400).json({ success: false, message: error.toString() })
			}
			break

		default:
		res.status(400).json({ success: false, message: "method not allowed" })
		break
	}
}