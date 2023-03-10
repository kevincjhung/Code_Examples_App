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
  const [likesCount, setLikesCount] = useState(0)
  
  console.log(post)

   
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

  // fetch likes for this particular post
  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        let result = await axios.get(`/api/likes/${postId}`, { signal: abortController.signal })  
        let numberOfLikes = result.data.data
        // console.log('number of likes', numberOfLikes)
        setLikesCount(numberOfLikes)
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
      // like/unlike
      await axios.post(`/api/likes/${router.query.id}`, { 
        session
      })
      
  
      // set the total likes
      let result = await axios.get(`/api/likes/${router.query.id}`)
      let numberOfLikes = result.data.data
      // console.log(`number of likes`, numberOfLikes)
      // setLikesCount(numberOfLikes)
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
        <link rel="shortcut icon" href="/app-icon.png" />
      </Head>
        <Post
          post={post}
          className='px-6 my-3 mt-10 w-9/12 mx-auto'
          smallMaxWith={"max-w-2xl"}
          largeMaxWith={"max-w-7xl"}
          onComment={handleComment}
          onLike={handleLike}
          onShare={handleShare}
          liked={liked}
          totalComments={commentsCount}
          totalLikes={likesCount}
        />
      { session 
          ? 
          <CommentForm onSubmit={handleSubmit} user={session.user} className="w-9/12 mx-auto"/> 
          : 
          <p>Log in to like or leave a comment</p> 
      }
      <Comments comments={comments} className="px-6 my-3 mt-10 w-9/12 mx-auto" />
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

  // This is incremental static regeneration
  return {
    // Passed to the page component as props
    props: { 
      post: JSON.parse(JSON.stringify(post)) 
    },
    revalidate: 30, // In seconds
  }
}


