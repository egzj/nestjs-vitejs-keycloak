import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
  const { setAuth, setIsAuthLoading } = useAuth()

  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    })
    setAuth?.((prev: any) => {
      // console.log(JSON.stringify(prev))
      // console.log(response.data.accessToken)
      return { ...prev, accessToken: response.data.accessToken }
    })
    setIsAuthLoading?.(false)
    return response.data.accessToken
  }

  return refresh
}

export default useRefreshToken
