const express = require('express');
const bodyPaser = require('body-parser')
const axios = require('axios');

const app = express();
app.use(bodyPaser.json());

app.post('/event',async (req,res)=>{
    const {type,data} = req.body;
    if(type === 'CommentCreated'){
        const status =  data.content.includes('orange')?'Rejected':'Approve';
        console.log(data);
        await axios.post('http://event-bus-srv:4005/event',{
            type:'CommentUpdated',
            data:{
                id:data.id,
                postId:data.postId,
                status,
                content:data.content
            }
        })

    }
    res.send({});
});
app.listen(4003,()=>{
    console.log('Listning on port 4003');
})