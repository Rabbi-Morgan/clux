require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const session = require('express-session');
const uuid= require("uuid");


const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// Client Ui endpoints
app.get('/login', (req,res)=>{
    return res.render('login')
})

app.get('/addclass',(req,res)=>{
    return res.render('addclass');
})

app.get('/listclasses', (req,res)=>{
    return res.render('classes')
})

app.get('/', (req,res)=>{
    res.render('home');
})

// Api endpoints
app.get('/myclasses', async (req,res)=>{
    const config = {
        auth: {
            username: process.env.CLUX_USERNAME,
            password: process.env.CLUX_PASSWORD
          },
        headers: {
            'Accept-Encoding': 'application/json',
        }
    }

    try {
        const response = await axios.get(process.env.API_BASE_URL,config);
        res.json(response.data);
    }catch(error){
        console.log(error.message)
    }
});

app.get('/classes', async (req,res)=>{
    const {username, password} = req.session;
    if(!username || !password){
        return res.json({
            "error": true,
            "message": "Invalid session"
        })
    }
    const config = {
        auth: {
            username: req.session.username,
            password: req.session.password
          },
        headers: {
            'Accept-Encoding': 'application/json',
        }
    }

    try {
        const response = await axios.get(process.env.API_BASE_URL,config);
        res.json(response.data);
    }catch(error){
        console.log(error.message)
    }
})


app.post('/login', async (req,res)=>{
    const {username, password} = req.body;

    const config = {
        auth: {
            username: username,
            password: password
          },
        headers: {
            'Accept-Encoding': 'application/json',
        }
    }

    try {
        const response = await axios.get(process.env.API_BASE_URL,config);

        req.session.username = username
        req.session.password = password
        return res.json({
                "error": false,
                "message": "Authenticated",
        })
        
    }catch(error){
        if(typeof error.response != 'undefined' && error.response.status == 401){
            return res.json({
                "error": true,
                "message": "Check your email or pasword",
            })
        }else{
            console.log(error.message);
        }
        
    }
})

app.post('/addclass',async (req,res) => {
    const { description,start, end, max_participants, record_class }= req.body;

    const {username, password} = req.session;
    if(!username || !password){
        return res.json({
            "error": true,
            "message": "Forbidden!"
        })
    }
    const config = {
        auth: {
            username: req.session.username,
            password: req.session.password
          },
        headers: {
            'Accept-Encoding': 'application/json',
        }
    }
    console.log(end)
    const data = {
        "description":  description,
        "start": start,
        "end": end,
        "max_participants": max_participants,
        "record_class": record_class,
        "room_token": uuid.v4()
    }

    try {
        const response = await axios.post(process.env.API_BASE_URL,data,config);
        if(response.data){
            return res.json({
                "error": false,
                "message": "Class is successfully created"
            })
        }
    }catch(error){
        console.log(error.message)
    }

});




app.get('/class/delete/:uuid',async (req,res) => {

    const {username, password} = req.session;
    if(!username || !password){
        return res.redirect("/login")
    }
    const config = {
        auth: {
            username: req.session.username,
            password: req.session.password
          },
        headers: {
            'Accept-Encoding': 'application/json',
        }
    }

    
    try {
        const response = await axios.delete(`${process.env.API_BASE_URL}${req.params.uuid}/`,config);
        return res.redirect('/listclasses')
    }catch(error){
        if(typeof error.response != 'undefined' && error.response.status == 404){
            return res.json({
                "error": true,
                "message": "Class does not exist",
            })
        }else{
            console.log(error.message);
        }
    }

});

app.post('/class/edit/:uuid',async (req,res) => {

    const {username, password} = req.session;
    if(!username || !password){
        return res.redirect("/login")
    }
    const config = {
        auth: {
            username: req.session.username,
            password: req.session.password
          },
        headers: {
            'Accept-Encoding': 'application/json',
        }
    }
    
    try {
        const response = await axios.put(`${process.env.API_BASE_URL}${req.params.uuid}/`,req.body,config);
        return res.redirect('/listclasses')
    }catch(error){
        if(typeof error.response != 'undefined' && error.response.status == 404){
            return res.json({
                "error": true,
                "message": "Class does not exist",
            })
        }else{
            console.log(error.message);
        }
    }

});

app.post('/validate',(req,res)=>{
    console.log(req.query)
    return res.json({
        pub_key: process.env.CLUBX_PUBK,
        userid: req.query.userid,
        status: true,
        is_teacher: true
    })
})

app.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login")
    })
})

app.listen(PORT,()=>{
    console.log(`Server started running at port ${PORT}`);
})
