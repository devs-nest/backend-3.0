const express = require('express');
const getRoutes = require('./routes/getRoutes')
const app = express();
const ngrok = require('ngrok');
const PORT = process.env.PORT || 3000;
//middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/', getRoutes);

app.listen(PORT,()=>{
    console.log(`started at ${PORT}`);      
});
//connecting ngrok 
//you can signup to ngrok website and get your own authToken
(async function(){
    const url = await ngrok.connect({
        proto:'http',
        addr:PORT,
        authtoken:'2ItcO1pxPHwKl81EJuLodWGgOVi_5sd5GCq3BQbR1a2jJuFr3'
    });
    console.log(url);
})();
