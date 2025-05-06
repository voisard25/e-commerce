import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ProductSearch() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.mercadolibre.com/sites/MLA/categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const url = new URL('https://api.mercadolibre.com/sites/MLA/search')
      url.searchParams.append('q', searchTerm)
      if (selectedCategory) {
        url.searchParams.append('category', selectedCategory)
      }
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data.results)
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.trim().length > 2) {
      try {
        const response = await fetch(`https://api.mercadolibre.com/sites/MLA/autosuggest?q=${encodeURIComponent(value)}`)
        const data = await response.json()
        setSuggestions(data.suggested_queries.map(item => item.q))
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    } else {
      setSuggestions([])
    }
  }

  return (
    <div className="product-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Buscar productos, marcas y más..."
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit" className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
              <img src={product.thumbnail} alt={product.title} />
              <div className="product-info">
                <h3>{product.title}</h3>
                <p className="price">
                  $ {new Intl.NumberFormat('es-AR').format(product.price)}
                </p>
                {product.shipping?.free_shipping && (
                  <p className="free-shipping">Envío gratis</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductSearch