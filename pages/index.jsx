import Button from '../components/Button/index.jsx'
import Link from 'next/link';
// import { prisma } from '../server/db/client'
import PostSmall from '../components/PostSmall/index.jsx'
import { useState, useEffect } from 'react'
import axios from 'axios'
import '../public/loading.svg'

// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css' //

import Head from 'next/head'

export default function Home() {
  let [ posts, setPosts ] = useState(null)

  // fetch the posts from the database
  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        let result = await axios.get("/api/posts", { signal: abortController.signal })
        setPosts(result.data.data)
        console.log(result.data.data)
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


  let content;
  // if posts have not been fetched yet, show a loading skeleton, else show the posts
  if(posts === null) {
    content = (
      <div className="flex justify-center ">
        
        
      </div>
    )
  } else if(posts.length == 0) {
    content = <h2>There are no posts yet, click the "Create Something" button above to create the first post</h2>
  } else {
    content = posts?.map(post => (
      <li key={post.id}>
        <PostSmall
          post={post}
          user={post.user}
          href={`/code/${post.id}`}
          className='my-10 bg-zinc-800 rounded-lg shadow-lg hover:brightness-110 transition duration-300 ease-in-out '
          onLike={() => console.log("like/unlike post:", post.id)}
          onComment={() => console.log("comment post", post.id)}
          onShare={() => console.log("share post", post.id)}
        />
        </li>
      ))
  }


  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/app-icon.png" />
      </Head>
      <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
        <div className='max-w-2xl mx-auto'>
          <h1 className="text-3xl font-normal tracking-tight text-gray-100 sm:text-4xl font-sans text-center">
            A Notes App, For Code
          </h1>
          <img className='mx-auto my-5' 
            src="app-icon.png" width={200} height={200} alt="Notes App"
          />
          <Link href="/AddPost">
            <Button children={"Create Something"} className="bg-gradient-to-r from-violet-500 to-fuchsia-500 transition duration-300 ease-in-out hover:scale-105"/>
          </Link>
        </div>
        <ul className='mt-8'>
          { content }
        </ul>
      </div>
    </>
  )
}

