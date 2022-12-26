import { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'

//components
import ContentsPage from './components/ContentsPage'
import UploadContentPage from './components/UploadContentPage'
import Footer from './components/Footer'
import Home from './components/Home'
import PageNavbar from './components/PageNavbar'
import Register from './components/Register'
import Login from './components/Login'
import SingleContentPage from './components/SingleContentPage'
import NotFound from './components/NotFound'

const App = () => {
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/api/contents/`)
    }
    getData()
  })

  return (
    <div className= 'App'>
      <BrowserRouter>
        <PageNavbar />
        <Routes>
          <Route path = '/' element = {<Home/>} />
          <Route path = '/contents' element = {<ContentsPage/>} />
          <Route path = '/contents/upload' element = {<UploadContentPage/>} />
          <Route path = '/contents/:single' element = {<SingleContentPage/>} />
          <Route path = '/register' element = {<Register/>} />
          <Route path = '/login' element = {<Login/>} />
          <Route path = '*' element = {<NotFound/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>

  ) 
}

export default App
