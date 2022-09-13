import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

const ContentsPage = () => {
  const [contents, setContents ] = useState([])
  const [ errors, setErrors ] =  useState(false)
  // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/contents/')
        setContents(data)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getData()
  }, [])

  const selectionCategory = localStorage.getItem('dropDownCategory')

  const transform = (imageUrl) => {
    const imageTmp = imageUrl.split('/')
    imageTmp.splice(2, 0, 'w_300,h_200,c_fill/')
    return imageTmp.join('/')
  } 

  return (
    <Container as='main' className='contents-index text-center'> 
      <h1 className='text-center mb-4'>Contents</h1>
      <Row>
        { contents.map(content => {
          const { id, image, location, categories } = content
          const toInclude = selectionCategory === 'ALL' ? categories : categories.filter(x => {
            return x.name.search(selectionCategory) !== -1
          })
          if (toInclude.length > 0) {
            return (
              <Col key={id} md="6" lg="4" className='mb-4'>
                <Link to={`/contents/${id}`}>
                  <Card>
                    <Card.Img variant='top' src={'https://res.cloudinary.com/dy8qoqcss/' + transform(image)}></Card.Img>
                    <Card.Body className='bg-light'>
                      <Card.Title className='text-center mb-0'>Created At: {content.created_at} {location}</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            )
          }
        }) }
      </Row>
    </Container>
  )
 
}

export default ContentsPage
//http://127.0.0.1:8000/