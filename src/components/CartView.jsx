import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

function CartView() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/')} className="continue-shopping">
          Seguir comprando
        </button>
      </div>
    )
  }

  return (
    <div className="cart-view">
      <h2>Carrito de compras</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.thumbnail} alt={item.title} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.title}</h3>
              <div className="cart-item-price">
                $ {new Intl.NumberFormat('es-AR').format(item.price)}
              </div>
              <div className="cart-item-actions">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-button"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-button"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-button"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>$ {new Intl.NumberFormat('es-AR').format(getCartTotal())}</span>
        </div>
        <button className="checkout-button">Finalizar compra</button>
        <button
          onClick={() => navigate('/')}
          className="continue-shopping"
        >
          Seguir comprando
        </button>
      </div>
    </div>
  )
}

export default CartView