import { useSession, signIn, signOut } from "next-auth/react"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]'

export default function Component() {
  // accessing the session client side
  const { data: session } = useSession()
  
  if (session) {
    return (
      <div className="w-1/2">
        <h1>Signed in as: {session.user.name}</h1>
        <img src={session.user.image}  className="rounded-md"/>
        <h2>{session.user.email}</h2>
        <button onClick={() => signOut()} className="bg-sky-500 w-1/3">Sign out</button>
      </div>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export async function getServerSideProps(context) {
  // get server side details
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  
  // if no session, redirect to login
  if (!session) {

    // redirect to login
    return {
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