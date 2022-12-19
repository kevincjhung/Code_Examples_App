import Button from '../components/Button/index.jsx'
import Link from 'next/link';
// import { prisma } from '../server/db/client'
import PostSmall from '../components/PostSmall/index.jsx'
import { useState, useEffect } from 'react'
import axios from 'axios'
import '../public/loading.svg'

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
  
  // if posts have not been fetched yet, show a loading spinner, else show the posts
  if(posts === null) {
    content = <h2>Loading... <img src="/loading.svg" className="App-logo"/></h2>
  } else if(posts.length == 0) {
    content = <h2>There are no posts yet, click the "Create Something" button above to be the first to poster</h2>
  } else {
    content = posts?.map(post => (
      <li key={post.id}>
        <PostSmall
          post={post}
          user={post.user}
          href={`/code/${post.id}`}
          className='my-10'
          onLike={() => console.log("like post", post.id)}
          onComment={() => console.log("comment post", post.id)}
          onShare={() => console.log("share post", post.id)}
        />
        </li>
      ))
  }


  return (
    <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
      <div className='max-w-2xl mx-auto'>
        <h1 className="text-3xl font-normal tracking-tight text-gray-100 sm:text-4xl font-sans">
          Notes App, For Code
        </h1>
        <Link href="/AddPost">
          <Button children={"Create Something"}/>
        </Link>
      </div>
      <ul className='mt-8'>
         { content }
      </ul>
    </div>
  )
}

