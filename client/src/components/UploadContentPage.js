
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
    image: '',
    // categories: '',
  })
  const [ uploadImage, setUploadImage ] = useState(null)
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    // contentData.image = uploadImage[0]
    // const formData = new FormData()
    // formData.append('file', event.file)
    // contentData.image = uploadImage
    var ct = new FormData()
    ct.append('full_name', contentData.full_name)
    ct.append('location', contentData.location)
    ct.append('description', contentData.description)
    // ct.append('categories', contentData.categories)
    ct.append('image', uploadImage[0])
    console.log('To send to server -->', ct)
    console.log(uploadImage)
    try {
      const { data } = await axios.post('http://127.0.0.1:8000/api/contents/', ct, {
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
    // setContentData({ ...contentData, 'image': e.target.file })
    // setUploadImage(e.target.files)
    setErrors(false)
  }
  
  const handleUploadChange = (e) => {
  //   // setContentData({ ...contentData, [e.target.name]: e.target.value })
    setUploadImage(e.target.files)
    setErrors(false)
  }
  
  return (
    <main className="form-page">
      <Container>
        <form onSubmit={handleSubmit}>
          <input type="text" name="full_name" placeholder="Name or Nickname" value={contentData.full_name} onChange={handleChange} />
          { errors.full_name && <p className="text-danger">{errors.full_name}</p> }
          <input type="text" name="location" placeholder="Location" value={contentData.location} onChange={handleChange} />
          { errors.location && <p className="text-danger">{errors.location}</p> }
          <textarea name="description" placeholder="Description" value={contentData.description} onChange={handleChange}></textarea>
          { errors.description && <p className="text-danger">{errors.description}</p> }
          {/* <label htmlFor= "categories">Choose the category of your picture</label>
      <select name="categories">
        <option value= { categories }></option>
      </select> */}
          <label htmlFor="image">Picture</label>
          <input type="file" name="image" placeholder="Picture" onChange={handleUploadChange} />
          { errors.image && <p className="text-danger">{errors.image}</p> } 
          {/* <label htmlFor="fundings">Start a Crowdfunding</label>
      <input type="radio" name="fundings" placeholder="Yes" value= "Yes"/>
      <label htmlFor="Yes">Yes</label>
      <input type="radio" name="fundings" placeholder="No" value= "No"/>
      <label htmlFor="No">No</label>
      { errors.image && <p className="text-danger">{errors.image}</p> }  */}
          <input type="submit" value="Upload" className="btn dark" />
        </form>
      </Container>
      {/* <Container>
        <ContentForm
          errors={errors}
          data={{ text: contentData, file: uploadImage }}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          // handleUploadChange = {handleUploadChange}
          
        />
      </Container> */}
    </main>
  )
      
}

export default UploadContentPage