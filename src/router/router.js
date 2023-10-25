import express from "express";
import { PptToPdf } from "../controller/controller.js";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    console.log('File:', file)

    const folderPath = './uploads'; 

    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      try {
        // Create the folder if it doesn't exist
        fs.mkdirSync(folderPath);
        console.log('Folder created successfully.');
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    } else {
      console.log('Folder already exists.');
    }
    
    return cb(null, './uploads');
  },
  filename: (req, file, cb)=> {
    return cb(null, Date.now()+'-'+file.originalname);
  }
})

const upload = multer({storage: storage}).single('pdf');

const Router = express.Router();




// Convert PPT to PDF ---------------------------------
Router.post("/ppt-to-pdf", upload, PptToPdf);

export default Router;