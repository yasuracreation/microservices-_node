const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const { default: axios } = require('axios');
const app = express();
app.use(cors())
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title
  };
  await axios.post('http://event-bus-srv:4005/event',{type:'PostCreated',data:{id,title}});

  res.status(201).send(posts[id]);
});
app.post('/event',(req,res)=>{
  console.log('Event Created',req.body.type);
  res.send({})
})
app.listen(4000, () => {
  console.log("v1")
  console.log('Listening on 4000');
});
