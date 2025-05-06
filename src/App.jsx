import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductSearch from './components/ProductSearch'
import ProductDetail from './components/ProductDetail'
import CartView from './components/CartView'
import CartIcon from './components/CartIcon'
import { CartProvider } from './context/CartContext'
import './App.css'

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <div className="nav-top">
              <div className="nav-logo">
                <img src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.19.5/mercadolibre/logo__large_plus.png" alt="Mercado Libre" />
              </div>
              <div className="nav-search">
                <ProductSearch />
              </div>
              <div className="nav-promo">
                <img src="https://http2.mlstatic.com/D_NQ_957153-MLA69318147677_052023-OO.webp" alt="Promoción" />
              </div>
              <CartIcon />
            </div>
          <nav className="nav-menu">
            <ul>
              <li>Categorías</li>
              <li>Ofertas</li>
              <li>Historial</li>
              <li>Supermercado</li>
              <li>Moda</li>
              <li>Vender</li>
              <li>Ayuda</li>
            </ul>
          </nav>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ProductSearch />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartView />} />
          </Routes>
        </main>
      </div>
      </Router>
    </CartProvider>
  )
}

export default App
