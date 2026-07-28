import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "https://hsrpg-api.pginbengaluru72.workers.dev" // the base url of your auth server
})

export const { signIn, signUp, signOut, useSession } = authClient;
