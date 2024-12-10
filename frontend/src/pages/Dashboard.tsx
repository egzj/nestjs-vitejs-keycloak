import Navbar from "@/components/Navbar"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

const Dashboard = () => {
  const axios = useAxiosPrivate()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMe = async () => {
      try {
        await axios.get("/auth/me")
        // console.log("products:", data.data)
      } catch (err) {
        console.log("error:", err)
        navigate("/login")
      }
    }

    fetchMe()
  }, [])

  return (
    <div>
      <Navbar />
    </div>
  )
}
export default Dashboard
