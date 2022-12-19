export default async function handler(req, res) {
	const { method } = req;

	switch (method) {
		case 'GET': // Get all comments 
			try {
				let comments = await prisma.comment.findMany({
					orderBy: {
						createdAt: 'desc'
					},
					include: {
						user: true,
					}
				})

				comments = JSON.parse(JSON.stringify(comments)),
				res.status(200).json({ success: true, data: comments })

			} catch (error) {
				res.status(400).json({ success: false, message: error.message })
			}
			break
		
		/**  Code below was copied and pasted, edit before using */
		// case 'comment':
		// 	const session = await unstable_getServerSession(req, res, authOptions)

		// 	// if user is not logged in, return 401
		// 	if (!session) {
		// 		console.error('log in before you create a comment')
		// 		res.status(401).json({ error: 'Unauthorized' })
		// 	}

		// 	const prismaUser = await prisma.user.findUnique({
		// 		where: { email: session.user.email }
		// 	})

		// 	if (!prismaUser) {
		// 		res.status(401).json({ error: 'No user with that email' })
		// 	}

		// 	const { language, code } = req.body;

		// 	const title = titleFromCode(code);

		// 	const comment = await prisma.comment.create({
		// 		data: {
		// 			title,
		// 			language,
		// 			code,
		// 			userId: prismaUser.id
		// 		}
		// 	})


		// 	res.status(201).json({ success: true, data: comment });
		// 	break

		default:
			res.setHeader('Allow', ['comment'])
			res.status(405).end(`Method ${method} Not Allowed`)
	}
}
