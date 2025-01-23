import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db';
import router from './routes/route.routes';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import 'dotenv/config'


const app = express();


const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(helmet());

app.use(bodyParser.json());
const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,
}
app.use(
    cors(corsOptions)
);

// Routes
app.use('/api', router);




connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));
