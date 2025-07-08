import './App.css'
import { Layout } from 'common/components/layout/Layout'
import { NotFoundPage } from 'pages/notFound/NotFoundPage'
import { TradePage } from 'pages/tradePage/TradePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TradePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { App }
