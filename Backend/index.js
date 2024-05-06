const express =require("express");
const app = express();
const cors = require("cors");


require('dotenv').config();

// const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 5001;

// const app = require('./app');

app.listen(PORT,() => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});