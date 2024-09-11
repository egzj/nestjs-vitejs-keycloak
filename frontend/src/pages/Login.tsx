import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const REDIRECT_URI = "http://localhost:3000/products"

type Props = {}
const Login = (props: Props) => {
  const { auth } = useAuth()
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
        }&scope=openid%20email%20profile&response_type=code&redirect_uri=http://localhost:5000/api/v1/auth/callback?redirect_uri=${REDIRECT_URI}`}
      >
        <Button>Login</Button>
      </a>
    </div>
  )
}
export default Login