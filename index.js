const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
//const fs=require('fs');
//const https=require('https');

const app=express();
const authRoute=require('./routes/auth');
const getAuth=require('./routes/getauth');


//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/', authRoute);
app.use('/',getAuth);


app.listen(process.env.PORT||5000,()=>console.log('server connected at 5000'));

//Port creation for https server
/* https.createServer({
    key:fs.readFileSync('server.key'),
    cert:fs.readFileSync('server.cert')
},app).listen(process.env.PORT||5000,()=>{
    console.log('server connected at 5000');
}) */








