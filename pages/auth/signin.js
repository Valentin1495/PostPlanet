import { getProviders, signIn } from "next-auth/react"
import Image from "next/image"

export default function SignIn({ providers }) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name} className='flex flex-col items-center justify-center
                                            min-h-screen space-y-3 pb-20'>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg"
            alt="twitter bird"
            width={170}
            height={170}
          />
          <button 
            onClick={() => signIn(provider.id, { callbackUrl: '/'})}
            className='bg-[#1DA1F2] p-3 text-white rounded-full relative 
                      hover:bg-gradient-to-r hover:from-[#1DA1F2] hover:to-blue-300 
                      hover:ring-2 hover:ring-offset-2 hover:ring-blue-300 
                      transition-all ease-out duration-300'
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 
                        transform translate-x-12 bg-white opacity-10 rotate-12 
                        group-hover:-translate-x-40 ease" />
            <span className="relative">Sign in with {provider.name}</span>
          </button>
        </div>
      ))}
    </>
  )
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

