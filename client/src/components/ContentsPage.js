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

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/contents/')
        setContents(data)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getData()
  }, [])

  const selectionCategory = localStorage.getItem('dropDownCategory')

  return (
    <Container as="main">
      <h1 className='text-center mb-4'>Contents</h1>
      <Row>
        { contents.map(content => {
          const { id, image, location, categories } = content
          const toInclude = categories.filter(x => {
            return x.name.search(selectionCategory) !== -1
          })
          if (toInclude.length > 0) {
            return (
              <Col key={id} md="6" lg="4" className='mb-4'>
                <Link to={`/contents/${id}`}>
                  <Card>
                    <Card.Img variant='top' src={'https://res.cloudinary.com/dy8qoqcss/' + image}></Card.Img>
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