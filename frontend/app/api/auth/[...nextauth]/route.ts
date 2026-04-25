import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.name = user.name
                token.email = user.email
                token.picture = user.image
            }
            return token
        },

        async session({session, token}) {
            session.user = {
                id: token.sub!,
                name: token.name ?? null,
                email: token.email ?? null,
                image: token.picture ?? null
            }
            return session
        }
    }
})
  

export {handler as GET, handler as POST}