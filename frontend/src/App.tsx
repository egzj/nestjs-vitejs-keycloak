import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "@/pages/Login"
import Dashboard from "./pages/Dashboard"
import { AuthProvider } from "@/context/AuthProvider"
import Auth from "@/pages/Auth"
import Products from "@/pages/Products"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
