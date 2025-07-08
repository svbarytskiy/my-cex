import './navbar.css'

const Navbar = () => {
  return (
    <header className="navbar">
      <span className="logo">CryptoVison</span>
      <nav>
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/trade/BTC-USDT">Trade</a>
          </li>
          <li>
            <a href="/futures/BTC-USDT">Futures</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
export { Navbar }
