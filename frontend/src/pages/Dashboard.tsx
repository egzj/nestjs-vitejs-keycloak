import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

type Props = {}
const Dashboard = (props: Props) => {
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      setIsLoading(true)
      try {
        const { data } = await axios.get("/auth/me")
        setProducts(data.data)
        // console.log("products:", data.data)
      } catch (err) {
        console.log("error:", err)
        navigate("/login")
      }
      setIsLoading(false)
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
