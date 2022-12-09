// replit link: https://replit.com/@MuhammadImran31/SimpleAPIRequests#index.js

// We can't use fetch() directly in node. This is because fetch is a Web API and it is not supported in the version of the Node.js installed on your machine.

// Starting version 18, Node.js has started supporting fetch API.

// Previous to the release of Node.js v18, the most popular way to use fetch in Node.js is to install the node-fetch library.

// npm i node-fetch@2

// import the node-fetch package 

const fetch = require('node-fetch')


// GET request to /posts endpoint

fetch('https://jsonplaceholder.typicode.com/posts')
.then(res => res.json())
.then(data => console.log(data))


// GET request to /posts/id endpoint

fetch('https://jsonplaceholder.typicode.com/posts/1')
.then(res => res.json())
// .then(data => console.log(data))


// GET request to /posts/id/comments endpoint

fetch('https://jsonplaceholder.typicode.com/posts/1/comments')
.then(res => res.json())
// .then(data => console.log(data))


// GET request to /comments endpoint with an optional postId query

fetch('https://jsonplaceholder.typicode.com/comments/?postId=1')
.then(res => res.json())
// .then(data => console.log(data))


// POST request sending a sample object to be created to /posts endpoint

const sampleObject = {
  title: 'foo',
  body: 'bar',
  userId: 1,
}

fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify(sampleObject),
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
// .then(data => console.log(data))


// PUT request updating an existing object in /posts/postId

const newData = {
    id: 1,
    title: 'foo',
    body: 'bar',
    userId: 1,
  }

fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'PUT',
  body: JSON.stringify(newData),
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
// .then(data => console.log(data))


// DELETE  request to delete an existing object from /posts/id endpoint

fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'DELETE'
})
.then(res => res.json())
// .then(data => console.log(data))


