if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const passport = require('passport');
// const cors = require('cors');
// const helmet = require('helmet');
// const csurf = require('csurf');


const error = require('./middlewares/error');
const userRoutes = require('./routes/user');

const dbUrl = process.env.ATLAS_URL ;
mongoose.connect(dbUrl)
    .then(() => {
        console.log('mongo database connected');
    })
    .catch((err) => {
        console.log('mongo connection error!!');
        console.log(err);
    })



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
// app.use(helmet());
// app.use(csurf({ cookie: true }));
app.use(passport.initialize());




app.use('/api/v0',userRoutes)

app.use(error);



const port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})