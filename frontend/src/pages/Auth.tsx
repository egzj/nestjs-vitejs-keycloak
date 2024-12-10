import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const Auth = () => {
  const { setAuth, setIsAuthLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get("access_token")
    const idToken = urlParams.get("id_token")
    const redirectUri = urlParams.get("redirect_uri")
    if (accessToken && idToken && redirectUri && setAuth) {
      const url = new URL(redirectUri)
      const path = url.pathname

      setAuth({ accessToken, idToken })
      setIsAuthLoading?.(false)
      navigate(path)
    }
  }, [])

  return <div>Loading...</div>
}
export default Auth
