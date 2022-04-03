const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios')
const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {}
handleEvent = (type,data)=>{
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] }
    }
    if (type === 'CommentCreated') {
        const { id, content, postId ,status } = data;
        const post = posts[postId];
        post.comments.push({ id, content,status });
        
    }
    if(type === 'CommentUpdated'){
        const {id,content,postId,status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comm => comm.id === id);
        comment.status = status;
    }
}
app.get('/posts', (req, res) => {
    res.send(posts);
})

app.post('/event', (req, res) => {
    const { type, data } = req.body;
    handleEvent(type,data)
    console.log(posts);
    res.send({});
})

app.listen('4002',async () => {
    console.log('Listning on port 4002');
    const res = await  axios.get('http://event-bus-srv:4005/events');
    if(res){
         for(let event of res.data){
             console.log('Handling Event ',event.type);
             handleEvent(event.type,event.data);
         }
    }
})