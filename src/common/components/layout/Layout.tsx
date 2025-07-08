import { FC } from 'react'
import { Navbar } from './NavBar'
import { Outlet } from 'react-router-dom'

const Layout: FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}
export { Layout }
