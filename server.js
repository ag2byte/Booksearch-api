const axios = require('axios')
const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000
const {OAuth2Client} = require('google-auth-library')
const Searchhistory = require('./models/searchhistory')
const bodyParser = require('body-parser')
const session = require('express-session')
const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID)


const dburi = process.env.MONGODB_CONNECTION_STRING
mongoose.connect(dburi) // connect to the mogodb database
.then((res) => {
  console.log("Database connection successfull")
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
  })
})
.catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))


app.get("/",(req,res)  =>{
  
  res.send("Server up")
})

 async function addtoDatabase(req){ //adds multiple records to the database at once
       await Searchhistory.insertMany(req.session.searches)
        .then((response) => {
          console.log(`Added records`)
          req.session.searches = []
        })
        .catch((err) => console.log(err))
}

app.get('/history',(req,res) =>{//this can be used to get the history of searches made by the current user
  if(req.session.user)
  {Searchhistory.find().where('useremail').equals(req.session.user.email)
    .then(response => res.send(response))
    .catch(err => console.log(err))}
  else{
    res.send('Authentication required.')
  }
})



app.post('/verifyToken',async (req,res) =>{//verify OAuth token for valid user
  const {token} = req.body
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID
  });
  const { name, email, picture } = ticket.getPayload();    
  var user = { 
      name:name,
      email:email,
      picture:picture
  }
  req.session.user = user
  req.session.searches = []
  
  res.send(user)
  

})

app.get('/logout',(req,res)=>{//logout user
  if(req.session.user)
  {
  
    if(req.session.searches.length != 0)
      addtoDatabase(req)
    req.session.user = null
    req.session.searches =[]
    res.send('logout success')}
    else
      res.send("Logged out already")
  }
  
)

app.get('/getbooklist', (req, res) => {//returns a book list wrt the queryTerm
  if(req.session.user)
  {const queryTerm = req.query.queryTerm
    req.session.searches.push({username:req.session.user.name,useremail:req.session.user.email,queryTerm:queryTerm})
    if(req.session.searches.length == 5)
      addtoDatabase(req)
    // add to database after every 5 searches to avoid multiple hits to database
  axios.get('https://www.googleapis.com/books/v1/volumes?q=intitle:'+queryTerm+'&orderBy=relevance&key='+process.env.GOOGLE_BOOKS_API_KEY)
  .then(response => {
    res.send(response.data.items)
  }) 
  .catch(err => console.log(err))}
  else{
    res.send('Authentication required.')
  }

})

app.get('/getbook',(req,res) =>{//get details of a particular bool by volumeId
  if(req.session.user){
  const volumeId = req.query.volumeId
  axios.get(`https://www.googleapis.com/books/v1/volumes/${volumeId}?key=`+process.env.GOOGLE_BOOKS_API_KEY)
  .then(response =>
        res.send(response.data)
        
      )
  .catch(err => console.log(err))
  }
  else{
    res.send('Authentication required')
  }
})

