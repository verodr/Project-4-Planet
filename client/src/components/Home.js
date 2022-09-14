import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'

const Home = () => {
  const [ contents, setContents ] = useState([])
  const [ categories, setCategories] = useState([])
  const [ errors, setErrors ] = useState(false)
  const navigate = useNavigate()
  const axios = require('axios')
  // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

  const [ newsData, setNewsData ] = useState([])
  useEffect(() => {

    const getData = async () => {
      const options = {
        method: 'GET',
        url: 'https://climate-change23.p.rapidapi.com/news',
        headers: {
          'X-RapidAPI-Key': '9b480a6d88mshc6e98bd8981fde1p132c0djsnd99ddaca6b99',
          'X-RapidAPI-Host': 'climate-change23.p.rapidapi.com',
        },
      }
      try {
        const data = await axios.request(options)
        setNewsData(data.data)
      }  catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [])

  const sourceMapping = (sourceString) => {
    const dictMap = {
      'www.thetimes.co.uk': 'The Times',
      'www.theguardian.com': 'The Guardian',
      'www.telegraph.co.uk': 'The Telegraph',
      'www.bbc.co.uk': 'BBC',
    }
    const elem = Object.keys(dictMap).filter(x=>{
      return sourceString.indexOf(x) !== -1
    })[0]
    return dictMap[elem]
  }



  useEffect(() => {
    const getData = async () => {
      try {
        const latest = await axios.get('http://127.0.0.1:8000/api/contents/latest' )
        const collection = await axios.get('http://127.0.0.1:8000/api/categories')
        setContents(latest.data)
        setCategories(collection.data)
        // console.log(collection.data)
      } catch (errors) {
        console.log(errors)
        setErrors(true)
      }
    }
    getData()
  }, [])

  const handleChange = (event) => {
    localStorage.setItem('dropDownCategory', event)
    navigate('/contents')
  }


  const transform = (imageUrl) => {
    const imageTmp = imageUrl.split('/')
    imageTmp.splice(2, 0, 'w_800,h_600,c_fill/')
    return imageTmp.join('/')
  } 

  console.log('apinews-->', newsData )
  return (
    <> 
      <Container as="main" className='content-index'>
        <Row className='left-side'>
          <Col md={true}>
            <div className = 'heading display-1'>
              <h1>PLANET<br /><span> EARTH IS </span><br />
                <span>CALLING</span></h1>
              <p className='first-page lead'>Witness extreme events of Climate Change from all around the world <br />
                  with your shots in real time!
                  You can also
                  start fundraising to
                  help people affected<br />
                  by natural disasters!</p>
              { localStorage.getItem('token') ? 
                <Link to="/contents/upload" className='btn dark' id = "randbtn">Upload</Link>
                :
                <Link to="/Login" className='btn dark' id = "randbtn">Upload</Link>
              }
            </div>
          </Col>
          <Col md={true}>
            {Object.values(contents).length > 0 || Object.values(categories) > 0
              ?
              <>
                <div className='right-side'>
                  <Link key={contents.id} to={`/contents/${contents.id}`}>
                    <p> Latest uploaded is </p>
                    <img src={'https://res.cloudinary.com/dy8qoqcss/' + transform(contents.image)} />
                  </Link>
                  <DropdownButton
                    id="dropdown-button-dark-example2"
                    variant="secondary"
                    menuVariant="dark"
                    title="COLLECTION"
                    className="mt-2"
                    onSelect={handleChange}
                  >
                    {/* <Dropdown.Menu variant="dark" className="colors"> */}
                    <Dropdown.Item eventKey="ALL" className="bg-dark text-white" variant="dark">ALL</Dropdown.Item>
                    {/* <Dropdown.Divider /> */}
                    {categories.map(cat => {
                      return (
                        <Dropdown.Item key={cat.id} eventKey={cat.name} > { cat.name } </Dropdown.Item>
                      )
                    })}
                  </DropdownButton>{' '}
                  {/* <select name='collections' id='dropDown' onChange={handleChange}> 
                    <option key={0} value={'select'}>COLLECTION</option>
                    <option key={1} value={'ALL'}> ALL </option>
                    {categories.map(cat => {
                      return (
                        <option key={cat.id} value={cat.name}> { cat.name } </option>
                      )
                    })} </select> */}
                 
                  <ul>
                    { newsData.length > 0 ?
                      newsData.map((source) => {
                        return <ul key={source.source}> ----- {sourceMapping(source.source)} -----
                          <a href= {source.news[0].url}> <li>{source.news[0].title} </li></a>
                        </ul>
                      }) :
                      <p> Loading latest news... </p>
                    }
                  </ul>
                </div>
              </>
              :
              <>
                {errors ? <h2>Something went wrong. Please try again later</h2> : <p>Loading...</p>}
              </>
            }
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
