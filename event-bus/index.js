const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const events = [];
const app = express();
app.use(bodyParser.json())
app.use(cors());
app.post('/event',(req,res)=>{
    const event = req.body;
    events.push(event);
    axios.post('http://post-cluster-ip-srv:4000/event',event);
    axios.post('http://comments-srv:4001/event',event);
    axios.post('http://equery-srv:4002/event',event);
    axios.post('http://emoderation-srv:4003/event',event);
    res.send({status:'OK'})
});
app.get('/events',(req,res)=>{
   res.send(events);
})
app.listen(4005,()=>{
    console.log('listning port 4005')
})