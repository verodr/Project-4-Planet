
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authUser } from './auth'

// Import React Bootstrap Components
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

const PageNavbar = () => {
 
  const location = useLocation()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('userId')
    window.location.reload(navigate('/login'))
  }
  return (
    <Navbar expand="sm">
      <Container as="section">
        <Navbar.Brand as={Link} to="/">🌻</Navbar.Brand>
        { authUser() 
          ?
          <>
            <Nav.Link><span onClick={handleLogout}>Logout</span></Nav.Link>
          </>
          :
          <>
            <Nav.Link as={Link} to="/Register">Register</Nav.Link>
            <Nav.Link as={Link} to="/Login">Login</Nav.Link>
          </>
        }
      </Container>
    </Navbar>
  )
}

export default PageNavbar
  