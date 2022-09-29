# Project 4 - “PLANET EARTH IS CALLING”
For my fourth project, I built  a full-stack application from scratch creating a Python Django API for the back-end and using React for the front-end.
I created this app driven by the desire to build a place where all people from all over the world can document, by uploading their photos, the terrible effects of climate change and start, when possible, fundraising to help the victims of natural disasters.
<img width="1440" alt="Screenshot 2022-09-24 at 19 08 14" src="https://user-images.githubusercontent.com/106544788/193084544-6ed8a3f5-366f-4a09-add3-657f86dd06c9.png">

## Deployment link
[planet-earth-is-calling.herokuapp.com](https://planet-earth-is-calling.herokuapp.com "Planet-Earth-Is-Calling")

## Project Member
  - Veronica De Ronzi [github.com/verodr ](https://github.com/verodr)
  
## Timeframe
7 days

## Technologies Used
  - HTML
  - CSS
  - SASS
  - React
  - Express
  - Insomnia
  - React Bootstrap
  - Python
  - Django
  - Django REST Framework
  - Psycopg2
  - pyJWT
  - TablePlus
  - Netlify
  - JavaScript
  - Git
  - GitHub
  - Google Fonts
  - Excalidraw 
  - Cloudinary
  - Google Dev tools
  - VSCode
### Brief
  - Build a full-stack application by making your own backend and your own frontend;
  - Use a Python Django API, using Django REST Framework to serve your data from Postgres database;
  - Consume your API with a separate front-end built with React;
  - Be deployed online so it's publicly accessible
### Planning
Even before they gave us the briefs of the fourth project, I had its theme in mind, since I have the environmental issue very much at heart, I wanted my latest project to tackle the problem of climate change.
So I wanted to create an app that had a
  - Home page
  - Pictures library
  - Content page

![plan4-2022-07-21-2146](https://user-images.githubusercontent.com/106544788/193093072-24609c1c-625b-4cf0-b14e-30f18affdd43.png)

### Timeline 
#### Back-end
Day 1 and 2
  - Create  wireframe
  - Server (API)
  - Database Table Structure

#### Frontend
Day 3
  - Latest uploaded
  - Contents page items
  
Day 4 
  - Funding raising logic
  - Login
  - Register  
  - Upload image
  
Day 5/6/7 
  - Get/delete single content
  - Create/delete comments
  - Make donation
  - Handle errors
  - Styling 


## Build/Code Process
### The Server (API)
#### Database Table Structure
  - Category
  
only one field "name"

  - Content
  
It has two foreign keys: 
    - Categories (many to many)
    - Owner (many to one)
    
It has a special field to handle images "CloudinaryField('image')"

```python
class Content(models.Model):
   created_at = models.DateTimeField(auto_now_add=True)
   full_name = models.CharField(max_length=50, default=None)
   location = models.CharField(max_length=50, default=None)
   description = models.TextField(max_length=300, default=None)
   image = CloudinaryField('image')
   categories = models.ManyToManyField(
       "categories.Category",
       related_name = "contents",
   )
   owner = models.ForeignKey(
       'jwt_auth.User',
       related_name="contents",
       on_delete = models.CASCADE
   )
 
 
   def __str__(self):
       return f"{self.created_at} - {self.location} - {self.description} - {self.full_name}
```
  - Comment
  
It has two foreign keys: 

    - Content (many to one)
    - Owner (many to one)
    
  - User
  
one common field: email.

Other fields are auto generated : user_name, password

  - Authentication
  
The authentication is managed by the jwt_auth library using a secret key and the HS256 encryption algorithm.
```python
payload = jwt.decode(token, settings.SECRET_KEY, ["HS256"])
            user = User.objects.get(pk=payload.get('sub'))
```
### The Client
#### Home Page
The function sourceMapping transforms the newspaper URL into a readable format and It is used to print on the Home page in readable format.
```javascript
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
```
The first useEffect fetches news from an external API, the second gets the latest uploaded content and the list of categories.

Then I used the handleChange function to create a local storage item with the name of the category selected in the dropdown and navigate to the contents page.

Transform  is a helper function which allows me to use the Cloudinary API to transform an image directly on the cloud service.

In return I display the page using React Bootstrap. 
- The behavior of the "upload" button is determined by the local storage variable "token". If not present then the user is directed to the login page.
- a check is made on the successful get request.
Object.values(contents).length > 0 || Object.values(categories) > 0

#### Contents Page
<img width="1440" alt="Screenshot 2022-09-24 at 19 25 35" src="https://user-images.githubusercontent.com/106544788/193091841-e96bae6d-7807-4cd8-ba8d-61b9be307dbf.png">

First I used the useEffect hook to get all the contents, then I filtered them using a local storage item  In the return part.
```javascript
const selectionCategory = localStorage.getItem('dropDownCategory')
```
The contents fetched from the API are filtered using the selectionCategory variable.
```javascript
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
```
The images are fetched from Cloudinary using a simple transform function to apply re-scaling.

#### UploadContent Page
This time I used the useEffect function to fetch the list of categories in order to populate a dropdown, eventually rendered with Bootstrap.
Then I built a post request that contains as body a FormData object (which includes the image file) to create a new content.

```javascript
const handleContentSubmit = async (event) => {
   try {
     var ct = new FormData()
     ct.append('full_name', contentData.full_name)
     ct.append('location', contentData.location)
     ct.append('description', contentData.description)
     ct.append('categories', contentData.categories)
     ct.append('owner', localStorage.getItem('userId'))
     ct.append('image', uploadImage[0])
    
     const { data } = await axios.post('/api/contents/', ct, {
       headers: {
         Authorization: `Bearer ${getToken()}`,
       },
     })
 
     return data.id
   } catch (err) {
     console.log(err.response.data)
     setErrors(err.response.data)
   }
 }
```

where the image is handled via a dedicated function:
```javascript
const handleUploadChange = (e) => {
   setUploadImage(e.target.files)
 }
```
Through the handleFundingSubmit function a post request is built to create a new funding campaign, using the user input and some information about the logged in user.
```javascript
const handleFundingSubmit = async (id) => {
   if (fundingDetails.text !== '') {
     const ownerId = localStorage.getItem('userId')
     const fundingBody = { ...fundingDetails, current_amout: 0, content: id , owner: ownerId }
     try {
       const { dataF } = await axios.post('/api/fundings/', fundingBody, {
         headers: {
           Authorization: `Bearer ${getToken()}`,
         },
       })
     } catch (err) {
       console.log(err.response.data)
       setErrors(err.response.data)
     }
   }
 }
```
As the name suggests, the validateForm  function performs some checks on the user input: If those are passed the submit function is called, otherwise an error message is set to be displayed on the page. 

I created a wrapper function that contains two functions that make the post requests: the Content request must come first and be successfully completed in order for the Funding request to be initiated. This is because the Funding table needs the newly created Content ID to create a new item.
The render method displays the input form: If the button for the funding campaign is clicked another subform is displayed to allow the creation of the funding.

```javascript
{funding ?
   <>
     <input type="text" name="text" placeholder="Why is the money needed" value={fundingDetails.text} onChange={handleFundingChange} />
     <input type="number" name="target_amount" placeholder="0$" value={fundingDetails.target_amount} onChange={handleFundingChange} />
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
```

#### SingleContent Page
First of all, I used the useEffect to get the data of a single content which includes the comments created for that content.
While the handleChange function is used to handle the user input about the donation amount which is memorized in the useState hook donation, the handleCommentChange function is used to handle the user input about the text of a comment which is memorized in the useState hook userInput.
Then the makeDonation function tries to do a post request to add the amount of money in the funding campaign: the input amount is sent to the API together with the other data present in the singleContent funding.

```javascript
 const makeDonation = async (e) => {
   const fundingItem = singleContent.fundings[0]
   const body = { ...fundingItem, current_amount: donation }
   try {
     const res = await axios.put(`/api/fundings/${fundingItem.id}/`, body, {
       headers: {
         Authorization: `Bearer ${getToken()}`,
       },
     })
     setMessage(`of ${donation}`)
     setDonation('')
   } catch (error) {
     setErrors(true)
     setMessage(error.response.data.detail)
   }
 }

```
I made a function to delete a content through a delete request for the whole content.
The management of the comment took place through two main functions:
  1) createComment where the app tries to create a new comment. The post request is built using the user text input together with the IDs for the content and two information (ID and Name) derived from local storage relative to the user who is currently logged in.

```javascript
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
     return 'Comment created'
   } catch (error) {
     setMessage(error.response.data.detail)
   }
 }

```

  2) deleteComment: which  builds a delete request for a comment. 

I rendered the contents on the page using Bootstrap Container with 3 Cards:
  - the first Card displays the image with its informations;
  - The second Card is only displayed if there is an active funding campaign. If that's the case an input form is displayed;
  - The third card displays the comments


<img width="301" alt="Screenshot 2022-09-24 at 19 20 24" src="https://user-images.githubusercontent.com/106544788/193090081-63b56fa5-7f99-4439-9978-5c6f1086a854.png">
<img width="301" alt="Screenshot 2022-09-24 at 19 17 09" src="https://user-images.githubusercontent.com/106544788/193090182-85ca434f-de6d-4918-8ba6-5b84ba72adb8.png">


### Challenges
The main challenge encountered on this project has been the image upload functionality. I’ve implemented a multi-part form to handle the file uploaded by the user.
```javascript
 const handleContentSubmit = async (event) => {
   try {
     var ct = new FormData()
	.
	.
     ct.append('image', uploadImage[0])
```
```javascript
 const handleUploadChange = (e) => {
   setUploadImage(e.target.files)
 }
```
The file is then sent via the API to the backend server where the Cloudinary Python SDK (software development kit) sends the file to the cloud storage and returns an URL to the file. This partial URL is stored in my Postgre database to be called by the frontend client API.


### Wins
What I consider the main new lesson of this project is the form validation functions I’ve implemented to check the validity of the user inputs. More generally I’ve appreciated the importance of data and input validation on the front-end. 
For example the validateForm function is implemented as follows
```javascript
 const validateForm = (event) => {
   event.preventDefault()
   setMessage('')
   if (contentData.full_name === '') {
     setMessage('Name is required')
   } else
   if (contentData.location === '') {
     setMessage('Location is required')
   } else
   if (contentData.description === '') {
     setMessage('Description is required')
   } else
   if (uploadImage.length < 1) {
     setMessage('Image is required')
   } else
   if (contentData.categories === '') {
     setMessage('Please select a category')
   } else {
     handleSubmit(event)
   }
 }
```
Here I’m preventing the POST request if any of the mandatory fields has not been populated by the user. More checks could be easily added to prevent other kinds of input to be passed through the POST request.

On other occasions however, such as the user registration form, I’ve relied on the errors returned by the back-end API. This is the case for example when a user tries to register with an already taken email. 
I’ve designed the code to make requests only when the user input could make sense, while showing the user a parsed error message from the server when a request is returned with an error.
```javascript
   } catch (error) {
     console.log(error)
     setErrors(error.response.data.detail)
   }
```
```javascript
{errors && <div className='error text-danger'>{errors}</div>}
```

### Key Learning/Takeaways
  - I learned to use Cloudinary
  - Adding external APIs on a website can be a winning choice

### Bugs
I managed to eliminate all the obvious bugs that appeared during the creation of the project.

### Future Improvements
I would like to add more functionalities to the page as:
  - A part dedicated to the collection of ideas to fight the climate change,
  - Community rooms.
