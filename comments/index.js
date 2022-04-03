const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
app.use(cors())

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content,status:'pending' });

  commentsByPostId[req.params.id] = comments;
  await axios.post('http://event-bus-srv:4005/event',{type:'CommentCreated',data:{id:commentId,content,postId:req.params.id}});
  res.status(201).send(comments);
});
app.post('/event',async (req,res)=>{
  console.log('Event Created',req.body.type);
  const {type , data} = req.body;
  if(type === 'CommentUpdated'){
    const {postId,id,status,content} = data;
    console.log(data)
    const comments = commentsByPostId[postId];
    comment = comments.find(com=>com.id === id);
    console.log(comment);
    comment.status = status

    await axios.post('http://event-bus-srv:4005/event',{
      type:'CommentUpdated',
      data:{
        id,
        status,
        postId,
        content
      }
    })
  }
  res.send({})
})
app.listen(4001, () => {
  console.log('Listening on 4001');
});
