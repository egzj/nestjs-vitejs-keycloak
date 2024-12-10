import Navbar from "@/components/Navbar"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Table } from "@/components/ui/table"

const Products = () => {
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const { data } = await axios.get("/products")
        setProducts(data.data)
        // console.log("products:", data.data)
      } catch (err) {
        console.log("error:", err)
        navigate("/login")
      }
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  return (
    <div>
      <Navbar />
      {!isLoading &&
        (products.length > 0 ? (
          <div>
            <h1>Products</h1>
            <div>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div>
            <p>0 products found</p>
          </div>
        ))}
    </div>
  )
}
export default Products
