
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../components/auth'
import ContentForm from './ContentForm'
import Container from 'react-bootstrap/Container'

const UploadContentPage = () => {
  const navigate = useNavigate()
  const [resStatus, setResStatus] = useState('')
  const [loginError, setLoginError] = useState('')
  const [ errors, setErrors ] = useState('')
  const [ contentData, setContentData ] = useState({
    full_name: '',
    location: '',
    description: '',
    categories: '',

  })
  const [ uploadImage, setUploadImage ] = useState('')
      
    
  //   const checkLogin = (comm) => {
  //     if (!localStorage.getItem('token')) {
  //       setLoginError('noLogin')
  //       return false
  //     }
  //     const currentUserName = localStorage.getItem('email')
  //     if (currentUserName !== comm.email){
  //       setResStatus({ status: 'WrongToken' })
  //       return false
  //     }
  //     console.log(localStorage.getItem('email'))
  //     return true
  //   }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.post('http://127.0.0.1:8000/api/contents/', contentData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log(data)
      // Navigate to the bread single page but on the bread we've just created
      navigate(`/contents/${data.id}`)
    } catch (err) {
      console.log(err.response.data)
      setErrors(err.response.data)
    }
  }
    
  const handleChange = (e) => {
    setContentData({ ...contentData, [e.target.name]: e.target.value })
    setUploadImage(e.target.files)
    setErrors(false)
  }
    
  //   const createTopic = async (e) => {
  //     e.preventDefault()
  //     if (!checkLogin({ topicUser: localStorage.getItem('email') })){
  //       return 
  //     }
  //     // //the code below is to check if the url is the right format to be printed
  //     const body = { ...topicData, createdAt: Date.now() }
  // if (body.image.match(/\.(jpeg|jpg|gif|png)$/) === null && body.image !== '')  { 
  //   setResStatus('wrong-url')
  //   return 
  // }
    
  //     try {
  //       console.log(body) 
  //       const res = await axios.post('http://127.0.0.1:8000/api/contents/', body)
  //       setResStatus(res)
  //       navigate('/contents')
  //     } catch (error){
  //       console.log(error.response)
  //       setErrors(error.response.data.message)
  //     }
  //     setTopicData({
  //       created_at: '',
  //       full_name: '',
  //       location: '',
  //       description: '',
  //       image: '' })
  //   }


  console.log('BEFORE >>', contentData)
  return (
    <main className="form-page">
      <Container>
        <ContentForm
          errors={errors}
          data={{ text: contentData, file: uploadImage }}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          
        />
      </Container>
    </main>
  )
      
}

export default UploadContentPage