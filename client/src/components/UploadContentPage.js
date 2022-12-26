import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../components/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/esm/Row'

const BACKEND_URL = 'https://planet-earth-is-calling.herokuapp.com'

const UploadContentPage = () => {
  const navigate = useNavigate()
  const [funding, setFunding] = useState(false)
  const [categories, setCategories] = useState([])
  const [ errors, setErrors ] = useState('')
  const [ message, setMessage ] = useState('')
  const [ contentData, setContentData ] = useState({
    full_name: '',
    location: '',
    description: '',
    image: '',
    categories: '',
  })
  const [ fundingDetails, setFundingDetail ] = useState({
    target_amount: 0,
    text: '',
  })
  const [ uploadImage, setUploadImage ] = useState({ length: 0 })
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

  useEffect(() => {
    const getData = async () => {
      try {
        const collection = await axios.get(`${BACKEND_URL}/api/categories/`)
        const select = { id: 0, name: 'Select', contents: [] }
        collection.data.splice(0, 0, select)
        setCategories(collection.data)
      } catch (errors) {
        console.log(errors)
        setErrors(errors.response.data)
      }
    }
    getData()
  }, [])
  
  const handleContentSubmit = async (event) => {
    try {
      var ct = new FormData()
      ct.append('full_name', contentData.full_name)
      ct.append('location', contentData.location)
      ct.append('description', contentData.description)
      ct.append('categories', contentData.categories)
      ct.append('owner', localStorage.getItem('userId'))
      ct.append('image', uploadImage[0])
      
      const { data } = await axios.post(`${BACKEND_URL}/api/contents/`, ct, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })

      return data.id
    } catch (err) {
      console.log(err.response.data)
      setErrors(err.response.data)
    }
  }
  
  const handleFundingSubmit = async (id) => {
    if (fundingDetails.text !== '') {
      const ownerId = localStorage.getItem('userId')
      const fundingBody = { ...fundingDetails, current_amout: 0, content: id , owner: ownerId }
      try {
        const { dataF } = await axios.post(`${BACKEND_URL}/api/fundings/`, fundingBody, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
      } catch (err) {
        console.log(err.response.data)
        setErrors(err.response.data)
      }
    }
  }

  const validateForm = (event) => {
    event.preventDefault()
    setMessage('')
    if (contentData.full_name === '') {
      setMessage('Name is required')
    } else
    if (contentData.location === '') {
      setMessage('Location is required')
    } else 
    if (contentData.description === '') {
      setMessage('Description is required')
    } else
    if (uploadImage.length < 1) {
      setMessage('Image is required') 
    } else 
    if (contentData.categories === '') {
      setMessage('Please select a category')
    } else {
      handleSubmit(event)
    }
  }

  //allows me to upload at once content and funding, waiting if the content goes through properly taking its id to create an associated fundings campaign
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const id = await handleContentSubmit()
      if (id !== 0){
        await handleFundingSubmit(id)
      }
      navigate(`/contents/${id}`)
    } catch (err) {
      console.log(err.response.data)
      setErrors(err.response.data)
    }
  }

  const handleChange = (e) => {
    setContentData({ ...contentData, [e.target.name]: e.target.value })
    // setErrors(false)
  }

  const handleUploadChange = (e) => {
    setUploadImage(e.target.files)
    // setErrors(false)
  }

  const handleFundingChange = (e) => {
    setFundingDetail({ ...fundingDetails, [e.target.name]: e.target.value })
    // setErrors(false)
  }
  

  return (
    <main className='form-page'>
      <Container>
        <Row>
          <div className='upload-shape'>
            <form className='col-10 offset-1 col-md-6 offset-md-3 text-center' onSubmit={validateForm}>
              { message ? <p className="text-danger">{message}</p> : <></> }
              <input type="text" name="full_name" placeholder="Name or Nickname *" value={contentData.full_name} onChange={handleChange} />
              <input type="text" name="location" placeholder="Location *" value={contentData.location} onChange={handleChange} />
              { errors.location && <p className="text-danger">{errors.location}</p> }
              <textarea name="description" placeholder="Description *" value={contentData.description} onChange={handleChange}></textarea>
              { errors.description && <p className="text-danger">{errors.description}</p> }
              <label htmlFor= "categories">Choose the category of your picture *</label>
              <select name="categories" onChange={handleChange}>
                {categories.map(cat => {
                  return (
                    <option key={cat.id} value={cat.id} > { cat.name } </option>
                  )
                })} 
              </select>
              <label htmlFor="image">Picture *</label>
              <input type="file" name="image" placeholder="Picture" onChange={handleUploadChange} />
              { errors.image && <p className="text-danger">{errors.image}</p> } 
              {funding ?
                <>
                  <input type="text" name="text" placeholder="Why is the money needed" value={fundingDetails.text} onChange={handleFundingChange} /> 
                  <input type="number" name="target_amount" placeholder="0$" value={fundingDetails.target_amount} onChange={handleFundingChange} />
                </>
                :
                <>
                  <label htmlFor="fundings">Start a Crowdfunding</label>
                  <input type="radio" name="fundingsYes" placeholder="Yes" value="yes" onChange={(e) => { 
                    e.preventDefault()
                    setFunding(true)
                  }}/>
                  <label htmlFor="Yes">Yes</label>
                  <input type="radio" name="fundingsNo" placeholder="No" value="no" onChange={(e) => {
                    e.preventDefault()
                    setFunding(false)
                  }}/>
                  <label htmlFor="No">No</label>
                </>
              }
              { errors.image && <p className="text-danger">{errors.image}</p> } 
              <input type="submit" value="Upload" className="btn dark" id="upload-contents"/>
            </form>
          </div>
        </Row>
      </Container>
    </main>
  )
      
}

export default UploadContentPage