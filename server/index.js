import express from 'express';
import mongoose from "mongoose";

import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';

import {errorMiddleware} from "./middleware/error.js";
import cloudinary from "cloudinary";
import fileupload from "express-fileupload";
import router from "./routes/mainRoute.js";

import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(cookieParser());

app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(bodyParser.json({limit: "50mb", extended: true}));

app.use(cors( {
    credentials: true,
    origin: [`http://localhost:8080`, `https://localhost:6000`, `https://6qhfhu.csb.app`],
    ///..other options
  }));

app.use(fileupload());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET  
});

// xử lý lỗi như er is not defined
process.on('uncaughtException', (err) => {
    console.log(`ERROR : ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});


router(app);
app.get('/', (req, res)=>{
    res.send('Hello commerce pack');
});

// xử lý lỗi err cho controllers
app.use(errorMiddleware);


mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() =>app.listen(process.env.PORT || 4000, ()=>{
        console.log(`you are listening on port 4000 and connect mongodb success!`)
    }))
    .catch(err => console.error(err));