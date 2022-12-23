import { useSession, signIn, signOut } from "next-auth/react"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]'
import Button from "../components/Button"

export default function Component() {
  // accessing the session client side
  const { data: session } = useSession()
  
  if (session) {
    return (
      <div className="h-full flex flex-col items-center justify-center ">
        <h3 className="text-2xl mt-1">
          Signed in as:
        </h3>
        <h1 className="text-4xl mt-1">
          {session.user.name}
        </h1>
        <img src={session.user.image}  className="rounded-full w-6/12 my-1.5 text-2xl"/>
        <h2 className="my-1.5 text-2xl">Email: {session.user.email}</h2>
        
        <button className="mt-4 w-5/12 content-center group relative flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 transition duration-300 ease-in-out hover:scale-105" 
          onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
    )
  } else{
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  } 
}




export async function getServerSideProps(context) {
  // get server side details
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  
  // if no session, redirect to login
  if (!session) {
    return {  // redirect to login
      redirect: { 
        destination: '/api/auth/signin',
        permanent: false,
      }
    }
  }

  // send to client
  return {
    props: { 
      session,
    },
  }
} 