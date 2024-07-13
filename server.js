
import dotenv from "dotenv";
dotenv.config();



import express from 'express';
import colors from 'colors';
import connectDB from "./config/db.js";
import morgan from "morgan";
import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cors from "cors"
import bodyParser from 'body-parser';

//configure env


//databse config
connectDB();


const app = express();



// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse application/json
app.use(bodyParser.json());

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
app.get("/", (req, res) => {
    res.send("<h1>Welcome to ecommerce app</h1>");
});


const PORT = process.env.PORT || 8080;




//run listen
app.listen(PORT, () => {
    console.log(
        `Server Running on port ${PORT}`.bgCyan
            .white
    );
});
