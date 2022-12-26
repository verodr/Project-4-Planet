import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

const BACKEND_URL = 'https://planet-earth-is-calling.herokuapp.com/'

const ContentsPage = () => {
  const [contents, setContents ] = useState([])
  const [ errors, setErrors ] =  useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/contents/`)
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
    imageTmp.splice(2, 0, 'w_600,h_338,c_fill')
    return imageTmp.join('/')
  } 

  const formatDate = (string) => {
    const d = new Date(string).toLocaleString()
    return d
  }
  return (
    <div className='list-wrapper'>
      <Container className='list-container content-index text-center'> 
        <h1 className='text-center mb-4'> { selectionCategory } </h1>
        <Row>
          { contents.map(content => {
            const { id, image, location, categories } = content
            const toInclude = selectionCategory === 'ALL' ? categories : categories.filter(x => {
              return x.name.search(selectionCategory) !== -1
            })
            if (toInclude.length > 0) {
              return (
                <Col key={id} md="6" lg="4" className='mb-4'>
                  <Link key={id} to={`/contents/${id}`}>
                    <Card className='list-card'>
                      <p className='location'> {location} - { formatDate(content.created_at) }</p>
                      <img src={'https://res.cloudinary.com/dy8qoqcss/' + transform(image)}/>
                      <p> { content.full_name } </p>
                    </Card>
                  </Link>
                </Col>
              )
            }
          }) }
        </Row>
      </Container>
    </div>
  )

}

export default ContentsPage