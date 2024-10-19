const express = require('express');
const cors = require('cors');
const path = require('path'); 

const app = express();

app.use(cors()); 
app.use(express.static(path.join(__dirname))); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () =>{
    console.log("Application listening port 3000");
});