import express from "express";
import cors from "cors";
import "dotenv/config";
import CentralRouter from "./router/router.js";

const app = express();
const port = process.env.PORT || 8880;
const uploadsDirectoryPath = './uploads';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(uploadsDirectoryPath));

app.get("/", (req,res)=>{
  res.status(200).json({
    status: "true",
    message: "APP is running like butter..."
  })
});

app.use('/api/convert', CentralRouter);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});