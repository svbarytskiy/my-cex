import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <header
      className="
      bg-background-secondary
      p-4
      flex               
      items-center"
    >
      <div
        className="
        flex             
        justify-between   
        items-center     
      "
      >
        <Link
          to="/en"
          className="
            flex items-center
            text-accent-primary
            font-bold
            text-2xl
            tracking-wide
            group
          "
        >
          EXBIT
        </Link>

        <nav className="ml-5">
          <ul
            className="
            flex         
            space-x-3  
            items-center 
          "
          >
            <li>
              <Link
                to="/en"
                className="
                  text-header-text
                  hover:text-accent-primary
                  transition-colors
                  duration-200
                  text-xs
                  font-medium
                  py-2 px-2
                  rounded-md
                  hover:bg-background-tertiary-hover
                "
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/en/trade/BTC_USDT"
                className="
                  text-header-text
                  hover:text-accent-primary
                  transition-colors
                  duration-200
                  text-xs
                  font-medium
                  py-2 px-2
                  rounded-md
                  hover:bg-background-tertiary-hover
                "
              >
                Trade
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
