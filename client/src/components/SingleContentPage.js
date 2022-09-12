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
  const [ comments, setComments] = useState([])
  const [ userInput, setUserInput] = useState('')
  const [ errors, setErrors ] = useState(false)
  const [ refreshPage, setRefreshPage ] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/contents/${single}`)
        const comRes = await axios.get('http://127.0.0.1:8000/api/comments')
        setSingleContent(res.data)
        setComments(comRes.data)
      } catch (err) {
        setErrors(true)
        if (err.response.status === 400 || err.response.status === 404) {
          navigate('*')
        }
      }
    }
    getData()
  }, [refreshPage])

  const handleChange = (e) => {
    setDonation(e.target.value)
  }

  const handleCommentChange = (e) => {
    setUserInput(e.target.value)
  }

  const makeDonation = async (e) => {
    e.preventDefault()
    const fundingItem = singleContent.fundings[0]
    const body = { ...fundingItem, current_amount: donation }
    console.log('This is the amount', donation)
    
    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/fundings/${fundingItem.id}/`, body)
      console.log('Donation mande')
      setRefreshPage(refreshPage + 1)
    } catch (error) {
      console.log('Error message: ', error.response.data.message)
    }
  }

  const deleteContent = async (e) => {
    e.preventDefault()
    const id = singleContent.id 
    try {
      const res = await axios.delete(`http://127.0.0.1:8000/api/contents/${id}/`)
      console.log('Content Deleted')
      setRefreshPage(refreshPage + 1)
      navigate('/')
    } catch (error) {
      console.log('Error message: ', error.response.data.message)
    }
  }

  const createComment = async (e) => {
    e.preventDefault()
    const id = singleContent.id 
    const ownerId = localStorage.getItem('userId')
    const body = { content: id , text: userInput, owner: ownerId }
    const header = { Authorization: `Bearer ${localStorage.getItem('token')}` }
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/comments/', body, header)
      console.log('comment created')
      setRefreshPage(refreshPage + 1)
      setUserInput('')
    } catch (error) {
      console.log('Error message: ', error.response.data.message)
    }
  }

  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(`http://127.0.0.1:8000/api/comments/${commentId}/`)
      console.log('Comment Deleted')
      setRefreshPage(refreshPage + 1)
    } catch (error) {
      console.log('Error message: ', error.response.data.message)
    }
  }

  const filterComments = (cmts) => {
    return cmts.filter( (singlecom) => {
      return singlecom.content.toString() === single
    })
  }

  const transform = (imageUrl) => {
    const imageTmp = imageUrl.split('/')
    imageTmp.splice(2, 0, 'w_150,h_300,c_fill/')
    return imageTmp.join('/')
  } 

  console.log('USER ID, Single Content Page --> ', localStorage.getItem('userId'))
  console.log('TOKEN, Single Content Page --> ', localStorage.getItem('token'))
  // console.log('AXIOS header, Single Content Page --> ', axios.defaults.headers.common)

  return (
    <Container as="main">
      <Row>
        {Object.values(singleContent).length > 0 ?
          <>
            <p>{ singleContent.description }</p>
          
            <Card>
              <Card.Img variant='top' src={'https://res.cloudinary.com/dy8qoqcss/' + transform(singleContent.image)}></Card.Img>
            </Card>
            <Row>
              <button onClick={deleteContent}> DELETE </button>
            </Row>
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
            <form onSubmit={createComment} className="form">
              <textarea className="text-area" placeholder="Comment Here" rows="6" cols="60" value={userInput} onChange={handleCommentChange}/>
              <button className='submit' type="submit">SEND</button>
            </form>
            <form>
              {Object.values(filterComments(comments)).length > 0 ?
                <ul> {filterComments(comments).map(comm => {
                  const { id, text, owner } = comm 
                  return (
                    <div key={id}>
                      <li> {text} --- {comm.created_at} --- {owner.username} </li>
                      <button className='delete' onClick={(e)=>{
                        e.preventDefault() 
                        deleteComment(id) 
                      }}> DELETE </button>
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