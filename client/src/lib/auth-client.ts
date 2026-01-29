import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BASEURL || (
        import.meta.env.PROD ? '' : 'http://localhost:3000'
    ),
    fetchOptions: {credentials:'include'},
})

export const { signIn, signUp, useSession } = authClient;