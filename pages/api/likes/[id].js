import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../server/db/client";

export default async function likes(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    // get the number of likes for a post
    case "GET":
      try {
        let numberOfLikes = await prisma.like.count({
          where: {
            postId: Number(id),
          },
        });

        res.status(200).json({ success: true, data: numberOfLikes });
      } catch (error) {
        console.error(error);
        res
          .status(400)
          .json({ success: false, message: error.message.toString() });
      }
      break;

    // liking/unliking a post
    case "POST":
      try {
				// TODO: fix, right now, it lets you like a post multiple times
        let { session } = req.body;

        // get user id with email from session
        let current_user = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
        });
        let user_id = current_user.id;

        // query the db to see if the user has liked this post before
        let result = await prisma.like.findMany({
          where: {
            userId: user_id,
            postId: Number(id),
          },
        });
        let userHasLiked = result.length > 0 ? true : false;
				
        console.log(`userHasLiked:`, userHasLiked);
				
				// user has not liked this post, add like to db
        if (!userHasLiked) {  
          console.log(`adding like for user: ${user_id} and post: ${id}`);

          // create the row in the like table
          await prisma.like.create({
            data: {
              userId: user_id,
              postId: Number(id),
            },
          });

          // add the number of likes to the post table
          await prisma.post.update({
            where: {
              id: Number(id),
            },
            data: {
              totalLikes: {
                increment: 1,
              },
            },
          });
        } else {  
          // user liked this post before, remove like from db
					// console.log(`removing like for user: ${user_id} and post: ${id}`);

          // remove like from the like table
          await prisma.like.deleteMany({
            where: {
              userId: user_id,
              postId: Number(id),
            },
          });

          // remove like from the post table
          await prisma.post.update({
            where: {
              id: Number(id),
            },
            data: {
              totalLikes: {
                decrement: 1,
              },
            },
          });

          res.status(201).json({
            success: true,
            data: {
              route: `POST /api/likes/${id}`,
              userHasLiked,
            },
          });
        }

      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.toString() });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "method not allowed" });
      break;
  }
}
