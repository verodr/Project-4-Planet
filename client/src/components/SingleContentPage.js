import { useEffect, useState } from 'react'
import { useParams , Link } from 'react-router-dom'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

const SingleContentPage = () => {
  const { single } = useParams()
  const [ singleContent, setSingleContent] = useState([])
  const [ donation, setDonation] = useState('')
  const [ errors, setErrors ] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/contents/${single}`)
        setSingleContent(res.data)
      } catch (err) {
        setErrors(true)
        if (err.response.status === 400 || err.response.status === 404) {
          navigate('*')
        }
      }
    }
    getData()
  }, [])

  const handleChange = (e) => {
    setDonation(e.target.value)
  }

  const makeDonation = async () => {
    const fundingItem = singleContent.fundings[0]
    const body = { ...fundingItem, current_amount: donation }
    console.log('This is the amount', donation)
    
    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/fundings/${fundingItem.id}/`, body)
    } catch (error) {
      console.log('Error message: ', error.response.data.message)
    }
  }

  console.log('HERE ->> ', singleContent)
  console.log('Donation -->', donation)

  const transform = (imageUrl) => {
    const imageTmp = imageUrl.split('/')
    imageTmp.splice(2, 0, 'w_150,h_300,c_fill/')
    return imageTmp.join('/')
  } 

  return (
    <>
      {Object.values(singleContent).length > 0 ?
        <>
          <p>{ singleContent.description }</p>
          <Container as="main">
            <Row>
              <Card>
                <Card.Img variant='top' src={'https://res.cloudinary.com/dy8qoqcss/' + transform(singleContent.image)}></Card.Img>
              </Card>
            </Row>
          </Container>
          {singleContent.fundings.length > 0 ? 
            <>
              <p> Make a donation, contribute to funding this campaign </p>
              {/* <image src='https://res.cloudinary.com/dy8qoqcss/image/upload/w_150,h_300,c_fill/v1662796793/vqjsierckxjqexyuyxsq.jpg'>rabbit</image> */}
              <form name ='add-funding' onSubmit={(text) => makeDonation(text)}> 
                <input type="text"
                  // name= 'addFunds'
                  defaultValue=''
                  placeholder= 'Insert donation amount'
                  onChange = {handleChange}>
                </input> 
                <button className='edit' type="submit">EDIT</button>
              </form> 
              <p> Current amount: { singleContent.fundings[0].current_amount } </p>
              <p> Target amount : { singleContent.fundings[0].target_amount } </p>
            </>
            :
            <> </> }
        </>
        :
        <>
          {errors ? <h2>Something went wrong. Please try again later</h2> : <p>Loading...</p>}
        </>

      }
    </>

  )
}

export default SingleContentPage