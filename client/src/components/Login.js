import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

const Login = () => {
  
  const [ loginData, setloginData ] = useState({
    email: '',
    password: '',
  })
  
  const navigate = useNavigate()
  
  const [ errors, setErrors ] = useState(false)
  
  const handleChange = (e) => {
    setloginData({ ...loginData, [e.target.name]: e.target.value })
    setErrors(false)
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/login/', loginData)
      const { token, id, message } = res.data
      console.log('ID-->', id)
      console.log('DATA-->', res.data)
      localStorage.setItem('token', token)
      localStorage.setItem('userId', id)
      localStorage.setItem('message', message)
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
      console.log('What Axios gets--', `Bearer ${localStorage.getItem('token')}` )
      navigate('/')
    } catch (error) {
      console.log(error)
      setErrors(error.response.data.message)
    }
  }
  
  
  return (
    <main className='form-page'>
      <Container>
        <Row>
          <div className='login-body'>
            <div className='login-container'>
              <h1 className='login-title'>Login Form</h1>
              {errors && <div className='error'>{errors}</div>}
              <form onSubmit={onSubmit} className='login-form'>
                <input 
                  type='text' name='email' placeholder='email' value={loginData.email} onChange={handleChange}
                />
                <input type='password' name='password' placeholder='Password' value={loginData.password} onChange={handleChange}
                />
                <div className='login-button-container'>
                  <button type='submit' className='login-button'>Login</button>
                </div>
              </form>
            </div>
          </div>
        </Row>
      </Container>
    </main>
  )
  
}

export default Login