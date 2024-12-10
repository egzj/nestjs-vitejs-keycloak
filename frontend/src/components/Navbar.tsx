import useAuth from "@/hooks/useAuth"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"

const Navbar = () => {
  const { auth, setAuth, isAuthLoading } = useAuth()
  const axios = useAxiosPrivate()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get("/auth/logout")
      setAuth?.({})
      navigate(`/login`, { replace: true }) // <-- redirect
    } catch (err) {
      console.log("error:", err)
    }
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-16 border-b border-zinc-300 bg-white py-2 dark:bg-gray-950">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-8">
        {/* Left Nav */}
        <div className="items-center gap-10 md:flex">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Dashboard
          </Link>
        </div>
        {/* Right Nav */}
        <div className="ml-auto items-center gap-4 md:flex">
          {!isAuthLoading &&
            (auth?.accessToken ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Login
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
export default Navbar
