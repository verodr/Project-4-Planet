import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

const Register = () => {

  const [ registerData, setRegisterData ] = useState({
    email: '',
    username: '',
    password: '',
    password_confirmation: '', 
  })
  
  const navigate = useNavigate()
  
  const [ errors, setErrors ] = useState(false)
  
  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    setErrors(false)
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const res = await axios.post('api/auth/register/', registerData)
      navigate('/login')
    } catch (error) {
      console.log(error)
      setErrors(error.response.data.message)
    }
  
  }
  
  return (
    <main className='form-page'>
      <Container>
        <Row>
          <div className='register-container'>
            <h1 className='register-title'>Registration form</h1>
            {errors && <div className='error'>{errors}</div>}
            <form onSubmit={onSubmit} className='register-form'>
              <input 
                type='text' name='username' placeholder='Username' value={registerData.username} onChange={handleChange}
              />
              <input type='text' name='email' placeholder='Email' value={registerData.email} onChange={handleChange}
              />
              <input type='password' name='password' placeholder='Password' value={registerData.password} onChange={handleChange}
              />
              <input type='password' name='password_confirmation' placeholder='Confirm Password' value={registerData.password_confirmation} onChange={handleChange}
              />
              <div className='register-button-container'>
                <button type='submit' className='register-button'>Register</button>
              </div>
            </form>
          </div>
        </Row>
      </Container>
    </main>
    
  )
  
}



export default Register