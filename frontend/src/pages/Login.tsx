import { Button } from "@/components/ui/button"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const REDIRECT_URI = `${import.meta.env.VITE_BASE_URL}/products`

const Login = () => {
  const navigate = useNavigate()
  const axios = useAxiosPrivate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await axios.get("/auth/me")
        navigate("/")
      } catch (err) {
        console.log("error:", err)
      }
    }
    fetchUser()
  }, [])

  return (
    <div>
      <a
        href={`${import.meta.env.VITE_KEYCLOAK_URL}/realms/${
          import.meta.env.VITE_KEYCLOAK_REALM
        }/protocol/openid-connect/auth?client_id=${
          import.meta.env.VITE_KEYCLOAK_CLIENT_ID
        }&scope=openid%20email%20profile&response_type=code&redirect_uri=${
          import.meta.env.VITE_BACKEND_URL
        }/auth/callback?redirect_uri=${REDIRECT_URI}`}
      >
        <Button>Login</Button>
      </a>
    </div>
  )
}
export default Login
