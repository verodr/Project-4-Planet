import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState } from 'react'
import { useParams , Link } from 'react-router-dom'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../components/auth'
import Card from 'react-bootstrap/Card'
import { Button } from 'bootstrap'

const SingleContentPage = () => {
  const { single } = useParams()
  const [ singleContent, setSingleContent] = useState([])
  const [ donation, setDonation] = useState('')
  const [ comments, setComments] = useState([])
  const [ userInput, setUserInput] = useState('')
  const [ errors, setErrors ] = useState(false)
  const [ message, setMessage ] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/contents/${single}/`)
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
  }, [message])

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
      setMessage(donation)
      setDonation('')
    } catch (error) {
      setErrors(true)
      setMessage(error.response.data.detail)
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
      navigate('/')
    } catch (error) {
      console.log('Error message: ', error.response.data.detail)
      setErrors(true)
      setMessage(error.response.data.detail)
    }
  }

  const createComment = async () => {
    const id = singleContent.id 
    const ownerId = localStorage.getItem('userId')
    const body = { content: id , text: userInput, owner: ownerId, owner_name: localStorage.getItem('message') }
    try {
      const res = await axios.post('/api/comments/', body, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setMessage(userInput)
      setUserInput('')
      console.log('comment created')
      return 'Comment created'
    } catch (error) {
      setMessage(error.response.data.detail)
    }
  }

  const deleteComment = async (e, commentId) => {
    try {
      const res = await axios.delete(`/api/comments/${commentId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setMessage(commentId)
    } catch (error) {
      setMessage(error.response.data.detail)
    }
  }

  const transform = (imageUrl) => {
    const imageTmp = imageUrl.split('/')
    imageTmp.splice(2, 0, '')
    return imageTmp.join('/')
  } 

  const formatDate = (string) => {
    const d = new Date(string).toLocaleString()
    return d
  }

  const formatError = (string) => {
    console.log('This is the string--', string)
    if (string === 'Invalid Token'){
      return 'You should login to perform this action!' 
    } 
    if (string === 'Unauthorised') {
      return 'You are not authorized to perform this action!'
    }
    if (typeof(string) === 'object' ){
      return string.text
    }
  }

  return (
    <Container as="main"className='content-index text-center'>
      <Row>
        {Object.values(singleContent).length > 0 ?
          <>
            <Card className='w-100'>
              <Card.Img className="w-100" variant='top' src={'https://res.cloudinary.com/dy8qoqcss/' + transform(singleContent.image)}></Card.Img>
              <Card.Body> 
                <Card.Title>
                Created by: { singleContent.full_name }, { singleContent.location }
                </Card.Title>
                <div> { singleContent.description } </div>
                <div> Uploaded at: { formatDate(singleContent.created_at) }</div>
                { <div className='Error text-danger'> {formatError(message)} </div> }
              </Card.Body>
              <Card.Footer id='delete-back'>
                <button className="del" onClick={deleteContent}> DELETE </button>
              </Card.Footer>
            </Card>
            <Card>
              {singleContent.fundings.length > 0 ? 
                <>
                  <div> Make a donation, contribute to funding this campaign </div>
                  <div> { singleContent.fundings[0].text }  </div>
                  <form name ='add-funding' onSubmit={(text) => makeDonation(text)}> 
                    <input type='text'
                      className='add-fund'
                      defaultValue=''
                      disabled={parseFloat(singleContent.fundings[0].target_amount) - parseFloat(singleContent.fundings[0].current_amount) <= 0 ? true : false}
                      placeholder= 'Insert donation amount'
                      onChange = {handleChange}>
                    </input> 
                  </form> 
                  <div className='donate-btn'>
                    <button className='edit' 
                      type="submit" 
                      disabled={parseFloat(singleContent.fundings[0].target_amount) - parseFloat(singleContent.fundings[0].current_amount) <= 0 ? true : false}
                      onClick={(text) => makeDonation(text)}>
                        DONATE
                    </button>
                  </div>
                  <div> Current amount: ${ singleContent.fundings[0].current_amount } </div>
                  <div className='target-color'> Target amount :  ${ singleContent.fundings[0].target_amount } </div>
                  { parseFloat(singleContent.fundings[0].target_amount) - parseFloat(singleContent.fundings[0].current_amount) <= 0 ? <p className='text-warning'> Congratulations you hit the target!! </p> : <></> }
                </>
                :
                <> </> 
              }
            </Card> 
            
            <Card id='back-del'>
              <Card.Body className='comment-box'>
                <form onSubmit={createComment} className="form-comment">
                  <textarea className="text-area" placeholder="Comment Here" rows="6" cols="60" value={userInput} onChange={handleCommentChange}/>
                </form>
                <button className='submit send' type="submit" onClick={createComment}>SEND</button>
                {/* <form> */}
                {Object.values(comments).length > 0 ?
                  <ul> {comments.map(comm => {
                    const { id, text } = comm 
                    return (
                      <Card key={id} className= 'com-style'>
                        <Card.Text className= 'comments-field'> {text}  by {comm.owner_name} at {formatDate(comm.created_at)} </Card.Text>
                        <button className='btn btn-default trash-icon' onClick={(e)=>{
                          deleteComment(e, id) 
                        }}>
                          <Card.Img className='trash-icon justify-content-right' src='https://res.cloudinary.com/dy8qoqcss/image/upload/w_150,h_150,c_fill/v1663181983/samples/trash_ax56aa.png'/>
                        </button>
                      </Card>
                    )
                  })}
                  </ul>
                  :
                  <div> no comments</div>
                }
                {/* </form> */}
              </Card.Body>
            </Card>
          </>
          :
          <>
            {errors ? <h2>Something went wrong. Please try again later</h2> : <div>Loading...</div>}
          </>

        } 
      </Row>
    </Container>

  )
}

export default SingleContentPage