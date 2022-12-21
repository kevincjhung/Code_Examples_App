// Components
import Head from 'next/head'
import Post from '../../components/Post'
import Comments from '../../components/Comments'
import CommentForm from '../../components/CommentForm'


// prisma
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Libraries
import { useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from 'styled-components'
import { useSession } from "next-auth/react"
import PostActions from '../../components/PostActions'
import { fromJSON } from 'postcss'


// Styled Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`


export default function Code({ post }) {
  // useSession
  const { data: session, status } = useSession()
  
  // useState
  const [comments, setComments] = useState([])
  const [commentsCount, setCommentsCount] = useState(0)
  const [liked, setLiked] = useState(false)
   
  // Get the post id from the url
  const router = useRouter()
  let postId = router.query.id


  // Fetch all comments for this particular post
  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        let result = await axios.get(`/api/comments/${postId}`, { signal: abortController.signal })
        result = result.data.data
        setComments(result) 
        setCommentsCount(result.length) 

      } catch (error) {
        console.error(error)
        if (axios.isCancel(error)) {
          return
        }
      }
    })()
      return () => {
      abortController.abort()
    }
  }, [])


  
  // after comment submit, we need to update the comments state, and the comments count
  const handleSubmit = async (e) => {
    let comment = e.comment
    
    try {
      await axios.post(`/api/comments/${router.query.id}`, { 
        comment,
        session
      })
      let result = await axios.get(`/api/comments/${postId}`)
      setComments(result.data.data)
      setCommentsCount(result.data.data.length)
      
    } catch(error){
      console.error(error)
    }
  }

  const handleComment = async (e) => {
    console.log('comment')
  }

  const handleLike = async (e) => {
    console.log('like/unlike button clicked')
    try {
      await axios.post(`/api/likes/${router.query.id}`, { 
        session,
        liked
      })
      setLiked(!liked)
    } catch(error){
      console.error(error)
    }
  }

  const handleShare = async (e) => {
    console.log('share')
  }


  return (
    <div>
      <Head>
        <title>{post.title}</title>
      </Head>
        <Post
          post={post}
          className='px-6 my-3 mt-10'
          smallMaxWith={"max-w-2xl"}
          largeMaxWith={"max-w-7xl"}
          onComment={handleComment}
          onLike={handleLike}
          onShare={handleShare}
          liked={liked}
          totalComments={99}
          totalLikes={99}
        />
      { session ? <CommentForm onSubmit={handleSubmit} user={session.user} /> : <p>Log in to like or leave a comment</p> }
      <Comments comments={comments} className="px-6 my-3 mt-10" />
    </div>
  )
}


// Statically generate paths for all posts
export async function getStaticPaths() {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  const posts = await prisma.post.findMany({})
  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  })) 

  // pre-render only these paths at build time.
  return {
    paths,
    fallback: false, // server-render pages on demand if the path doesn't exist
  }
}


/**
 * This function gets called at build time on server-side.
 * It may be called again, on a serverless function, if revalidation is enabled and a new request comes in
 */
export async function getStaticProps(context) {
  const id = parseInt(context.params.id)
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include:{
      user: true,
    }
  })


  return {
    // Passed to the page component as props
    props: { 
      post: JSON.parse(JSON.stringify(post)) 
    },
    revalidate: 30, // In seconds
  }
}


