import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle'
import { Link } from 'react-router-dom'

const Home = () => {
  const [ contents, setContents ] = useState([])
  const [ categories, setCategories] = useState([])
  const [ errors, setErrors ] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      try {
        const latest = await axios.get('http://127.0.0.1:8000/api/contents/latest')
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
    localStorage.setItem('dropDownCategory', event.target.value)
    navigate('/contents')
  }


  //   <Dropdown>
  //     <Dropdown.Toggle variant="success" id="dropdown-basic">
  //         Dropdown Button
  //     </Dropdown.Toggle>

  //     <Dropdown.Menu>
  //       <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
  //       <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
  //       <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
  //     </Dropdown.Menu>
  //   </Dropdown>


  return (
    <>
      {Object.values(contents).length > 0 || Object.values(categories) > 0
        ?
        <>
          <p> Latest uploaded is </p>
          <img src={'https://res.cloudinary.com/dy8qoqcss/' + contents.image} />
          {/* <Dropdown>
            <Dropdown.Toggle variant='success' id='dropdown-basic'>
                Collection
            </Dropdown.Toggle>
          
            <Dropdown.Menu  name='collections' id='dropDown' onChange={handleChange}>
              {categories.map(cat => {
                <Dropdown.Item key={cat.id} value={cat.name}> { cat.name } </Dropdown.Item>
              })}
            </Dropdown.Menu>
          </Dropdown> */}
          <select name='collections' id='dropDown' onChange={handleChange}> 
            {categories.map(cat => {
              return (
                <option key={cat.id} value={cat.name}> { cat.name } </option>
              )
            })} </select>
          <Link to="/contents/upload" className='btn dark' id = "randbtn">Upload</Link>
        </>
        :
        <>
          {errors ? <h2>Something went wrong. Please try again later</h2> : <p>Loading...</p>}
        </>
      }
    </>
   
  )
}

export default Home
