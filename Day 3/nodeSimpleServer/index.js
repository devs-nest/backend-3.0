// replit link: https://replit.com/@MuhammadImran31/APIQueryServer#index.js

const express = require('express')
const app = express()
const fetch = require('node-fetch')
require('dotenv').config()

app.use(express.json())

// sample get request:  https://url.com/?min=1&max=5
// The above get request will get all the objects in /posts of jsontypeholder which have an id from 1 to 5

app.get('/', (req, res) => {
  const minVal = req.query.min
  const maxVal = req.query.max
  
  for (let i=minVal; i<=maxVal; i++){
    fetch(`https://jsonplaceholder.typicode.com/posts/${i}`)
    .then(res => res.json())
    .then(data => console.log(data))
  }
  res.send('Please check server logs for queried results')
})


// Sending a POST request will create an object in the /posts endpoint with a postId corresponding to each value between the min and max value

app.post('/', (req, res) => {
  const minVal = req.query.min
  const maxVal = req.query.max

  for (let i=minVal; i<=maxVal; i++){
    fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => console.log(data))
  }
  res.send('Please check server logs for queried results')
})


// Sending a PUT request will update all the existing objects in the /posts/id endpoint with a postId corresponding to each value between the min and max value

app.put('/', (req, res) => {
  const minVal = req.query.min
  const maxVal = req.query.max
  
  for (let i=minVal; i<=maxVal; i++){
    fetch(`https://jsonplaceholder.typicode.com/posts/${i}`, {
      method: 'PUT',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => console.log(data))
  }
  res.send('Please check server logs for queried results')
})


// All the posts whose ids lie within the range provided will be deleted from the /posts/id endpoint

app.delete('/', (req, res) => {
  const minVal = req.query.min
  const maxVal = req.query.max
  
  for (let i=minVal; i<=maxVal; i++){
    fetch(`https://jsonplaceholder.typicode.com/posts/${i}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => console.log(data))
  }
  res.send('Please check server logs for queried results')
})

// set PORT value in secrets

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
})