const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname))); // Serve static files from root directory

// Route to serve the index.html on default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () =>{
    console.log("Application listening port 3000");
});