import { createContext, useState } from "react"

export const AuthContext = createContext<{
  auth: { accessToken?: string; idToken?: string }
  setAuth: React.Dispatch<
    React.SetStateAction<{
      accessToken?: string
      idToken?: string
    }>
  > | null
  isAuthLoading: boolean
  setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>> | null
}>({
  auth: {},
  setAuth: null,
  isAuthLoading: true,
  setIsAuthLoading: null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<{
    accessToken?: string
    idToken?: string
  }>({})

  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true)

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, isAuthLoading, setIsAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
