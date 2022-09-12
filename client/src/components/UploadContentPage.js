
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../components/auth'
import ContentForm from './ContentForm'
import Container from 'react-bootstrap/Container'

const UploadContentPage = () => {
  const navigate = useNavigate()
  const [funding, setFunding] = useState(false)
  const [categories, setCategories] = useState([])
  const [ errors, setErrors ] = useState('')
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
  const [ uploadImage, setUploadImage ] = useState(null)
  // const [ newContentId, setNewContentId ] = useState(0)

  useEffect(() => {
    const getData = async () => {
      try {
        const collection = await axios.get('http://127.0.0.1:8000/api/categories')
        setCategories(collection.data)
      } catch (errors) {
        console.log(errors)
        setErrors(true)
      }
    }
    getData()
  }, [])
  
  const handleContentSubmit = async (event) => {
    // event.preventDefault()
    console.log('FF--> ', fundingDetails)
    try {
      var ct = new FormData()
      ct.append('full_name', contentData.full_name)
      ct.append('location', contentData.location)
      ct.append('description', contentData.description)
      ct.append('categories', contentData.categories)
      ct.append('image', uploadImage[0])
      const { data } = await axios.post('http://127.0.0.1:8000/api/contents/', ct, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('DATA-->', data)
      // setNewContentId(data.id)
      // const ownerId = localStorage.getItem('userId')
      // const fundingBody = { ...fundingDetails, current_amout: 0, id: data.data.id , owner: ownerId }
      // const { dataF } = await axios.post('http://127.0.0.1:8000/api/fundings/', fundingBody, {
      //   headers: {
      //     Authorization: `Bearer ${getToken()}`,
      //   },
      // })
      // Navigate to the single page
      // navigate(`/contents/${data.id}`)
      return data.id
    } catch (err) {
      console.log(err.response.data)
      setErrors(err.response.data)
    }
  }
  
  const handleFundingSubmit = async (id) => {
    const ownerId = localStorage.getItem('userId')
    const fundingBody = { ...fundingDetails, current_amout: 0, content: id , owner: ownerId }
    try {
      const { dataF } = await axios.post('http://127.0.0.1:8000/api/fundings/', fundingBody, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
    } catch (err) {
      console.log(err.response.data)
      setErrors(err.response.data)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const id = await handleContentSubmit()
    console.log('This is the ID--> ', id)
    if (id !== 0){
      await handleFundingSubmit(id)
    }
    navigate(`/contents/${id}`)
  }

  const handleChange = (e) => {
    setContentData({ ...contentData, [e.target.name]: e.target.value.trim() })
    setErrors(false)
  }

  const handleUploadChange = (e) => {
    setUploadImage(e.target.files)
    setErrors(false)
  }

  const handleFundingChange = (e) => {
    setFundingDetail({ ...fundingDetails, [e.target.name]: e.target.value })
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
          <label htmlFor= "categories">Choose the category of your picture</label>
          <select name="categories" onChange={handleChange}>
            {categories.map(cat => {
              return (
                <option key={cat.id} value={cat.id} > { cat.name } </option>
              )
            })} 
          </select>
          <label htmlFor="image">Picture</label>
          <input type="file" name="image" placeholder="Picture" onChange={handleUploadChange} />
          { errors.image && <p className="text-danger">{errors.image}</p> } 
          {funding ?
            <>
              {/* <form onSubmit={handleFundingSubmit}> */}
              <input type="text" name="text" placeholder="Why is the money needed" value={fundingDetails.text} onChange={handleFundingChange} />
              <input type="number" name="target_amount" placeholder="0" value={fundingDetails.target_amount} onChange={handleFundingChange} />
              {/* </form> */}
              {/* <input type="submit" value="Confirm funding" className="btn dark" /> */}
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