import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

function CartWidget({ isVisible }) {
  const { cartItems, getCartTotal } = useCart()
  const navigate = useNavigate()

  if (!isVisible || cartItems.length === 0) return null

  return (
    <div className="cart-widget">
      <div className="cart-widget-items">
        {cartItems.slice(0, 3).map((item) => (
          <div key={item.id} className="cart-widget-item">
            <img src={item.thumbnail} alt={item.title} className="cart-widget-item-image" />
            <div className="cart-widget-item-info">
              <p className="cart-widget-item-title">{item.title}</p>
              <p className="cart-widget-item-quantity">Cantidad: {item.quantity}</p>
              <p className="cart-widget-item-price">
                $ {new Intl.NumberFormat('es-AR').format(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
        {cartItems.length > 3 && (
          <p className="cart-widget-more-items">
            Y {cartItems.length - 3} productos más...
          </p>
        )}
      </div>
      <div className="cart-widget-footer">
        <div className="cart-widget-total">
          <span>Total:</span>
          <span>$ {new Intl.NumberFormat('es-AR').format(getCartTotal())}</span>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="cart-widget-checkout"
        >
          Ir al carrito
        </button>
      </div>
    </div>
  )
}

export default CartWidget