import { useEffect, useState } from 'react'
import { useParams , Link } from 'react-router-dom'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../components/auth'
import Card from 'react-bootstrap/Card'

const SingleContentPage = () => {
  const { single } = useParams()
  const [ singleContent, setSingleContent] = useState([])
  const [ donation, setDonation] = useState('')
  const [ comments, setComments] = useState([])
  const [ userInput, setUserInput] = useState('')
  const [ errors, setErrors ] = useState(false)
  const navigate = useNavigate()
  // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/contents/${single}/`)
        console.log('res.data-->' , res.data)
        setSingleContent(res.data)
        setComments(res.data.comments)
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

  const handleCommentChange = (e) => {
    setUserInput(e.target.value)
  }

  const makeDonation = async (e) => {
    const fundingItem = singleContent.fundings[0]
    const body = { ...fundingItem, current_amount: donation }
    console.log('This is the amount', donation)
    
    try {
      const res = await axios.put(`/api/fundings/${fundingItem.id}/`, body, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      // const res = await axios.put(`http://127.0.0.1:8000/api/fundings/${fundingItem.id}/`, body)
      console.log('Donation mande')
    } catch (error) {
      console.log('Error message: ', error.response.data.message)
    }
  }

  const deleteContent = async (e) => {
    const id = singleContent.id 
    try {
      const res = await axios.delete(`/api/contents/${id}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('Content Deleted')
      navigate('/')
    } catch (error) {
      console.log('Error message: ', error.response.data.message)
    }
  }

  const createComment = async (e) => {
    const id = singleContent.id 
    const ownerId = localStorage.getItem('userId')
    const body = { content: id , text: userInput, owner: ownerId, owner_name: localStorage.getItem('message') }
    try {
      const res = await axios.post('/api/comments/', body, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('comment created')
      setUserInput('')
    } catch (error) {
      console.log('Error message: ', error.response.data.message)
    }
  }

  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(`/api/comments/${commentId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('Comment Deleted')
    } catch (error) {
      console.log('Error message: ', error.response.data.message)
    }
  }

  const filterComments = (cmts) => {
    const temp = cmts.filter( (singlecom) => {
      return singlecom.content.toString() === single
    })
    console.log('TEMP', temp)
    return temp
  }

  const transform = (imageUrl) => {
    const imageTmp = imageUrl.split('/')
    imageTmp.splice(2, 0, '')
    return imageTmp.join('/')
  } 

  console.log('USER ID, Single Content Page --> ', localStorage.getItem('userId'))
  console.log('TOKEN, Single Content Page --> ', localStorage.getItem('token'))

  return (
    <Container as="main">
      <Row>
        {Object.values(singleContent).length > 0 ?
          <>
            <p>{ singleContent.description }</p>
          
            <Card>
              <Card.Img className="w-100" variant='top' src={'https://res.cloudinary.com/dy8qoqcss/' + transform(singleContent.image)}></Card.Img>
            </Card>
            <Row>
              <button onClick={deleteContent}> DELETE </button>
            </Row>
            {singleContent.fundings.length > 0 ? 
              <>
                <p> Make a donation, contribute to funding this campaign </p>
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
            <form onSubmit={createComment} className="form-comment">
              <textarea className="text-area" placeholder="Comment Here" rows="6" cols="60" value={userInput} onChange={handleCommentChange}/>
              <button className='submit' type="submit">SEND</button>
            </form>
            <form>
              {Object.values(filterComments(comments)).length > 0 ?
                <ul> {filterComments(comments).map(comm => {
                  const { id, text } = comm 
                  return (
                    <div key={id} className= 'com-style'>
                      <li className= 'comments-field'> {text} --- {comm.created_at} --- {comm.owner_name} </li>
                      <button className='delete-comment' onClick={(e)=>{
                        deleteComment(id) 
                      }}><img className='trash' src='https://cdn3.iconfinder.com/data/icons/basic-interface/100/delete-512.png'/></button>
                    </div>
                  )
                })}
                </ul>
                :
                <p> no comments</p>
              }

            </form>
          </>
          :
          <>
            {errors ? <h2>Something went wrong. Please try again later</h2> : <p>Loading...</p>}
          </>

        }
      </Row>
    </Container>

  )
}

export default SingleContentPage