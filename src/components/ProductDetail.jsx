import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const [productResponse, descriptionResponse] = await Promise.all([
          fetch(`https://api.mercadolibre.com/items/${id}`),
          fetch(`https://api.mercadolibre.com/items/${id}/description`)
        ])
        
        const productData = await productResponse.json()
        const descriptionData = await descriptionResponse.json()
        
        setProduct({
          ...productData,
          description: descriptionData.plain_text
        })
      } catch (error) {
        console.error('Error fetching product details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetail()
  }, [id])

  if (loading) return <div>Cargando...</div>
  if (!product) return <div>Producto no encontrado</div>

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="breadcrumb">
          <span onClick={() => window.history.back()}>Volver al listado</span>
        </div>

        <div className="product-grid">
          <div className="product-images">
            <div className="main-image-container">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={product.pictures[currentImageIndex].url}
                  alt={product.title}
                  className="main-image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              {currentImageIndex > 0 && (
                <button
                  className="carousel-button prev"
                  onClick={() => setCurrentImageIndex(i => i - 1)}
                >
                  ‹
                </button>
              )}
              {currentImageIndex < product.pictures.length - 1 && (
                <button
                  className="carousel-button next"
                  onClick={() => setCurrentImageIndex(i => i + 1)}
                >
                  ›
                </button>
              )}
            </div>
            <div className="thumbnail-grid">
              {product.pictures.map((picture, index) => (
                <img
                  key={index}
                  src={picture.url}
                  alt={`${product.title} - ${index + 1}`}
                  className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            {product.shipping?.free_shipping && (
              <span className="shipping-badge">Envío gratis</span>
            )}
            <h1>{product.title}</h1>
            <div className="price-container">
              <p className="price">
                $ {new Intl.NumberFormat('es-AR').format(product.price)}
              </p>
              {product.original_price && (
                <p className="original-price">
                  $ {new Intl.NumberFormat('es-AR').format(product.original_price)}
                </p>
              )}
            </div>

            <div className="purchase-options">
              <button 
                className="buy-now-button"
                onClick={() => {
                  addToCart(product)
                  navigate('/cart')
                }}
              >
                Comprar ahora
              </button>
              <button 
                className="add-to-cart-button"
                onClick={() => addToCart(product)}
              >
                Agregar al carrito
              </button>
            </div>

            <div className="seller-info">
              <h3>Información del vendedor</h3>
              <p>Ubicación: {product.seller_address?.city?.name}</p>
              {product.seller?.seller_reputation?.level_id && (
                <div className="reputation-level">
                  Reputación: {product.seller.seller_reputation.level_id}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="product-description">
          <h2>Descripción</h2>
          <motion.div
            className={`description-content ${showFullDescription ? 'expanded' : ''}`}
            initial={false}
            animate={{ height: showFullDescription ? 'auto' : '100px' }}
          >
            <p>{product.description}</p>
          </motion.div>
          {product.description?.length > 300 && (
            <button
              className="show-more-button"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>

        <div className="product-attributes">
          <h2>Características principales</h2>
          <table className="attributes-table">
            <tbody>
              {product.attributes
                .filter(attr => attr.value_name)
                .map((attr) => (
                  <tr key={attr.id}>
                    <th>{attr.name}</th>
                    <td>{attr.value_name}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail