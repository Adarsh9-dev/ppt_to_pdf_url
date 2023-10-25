import libre from "libreoffice-convert"
import fs from 'fs/promises';
import {supabase} from "../config/supabase.js";
import fsCreate from "fs";

const convertToPdf = async (inputPath, outputPath) => {
  try {
    const stats = await fs.lstat(inputPath);
    if (!stats.isFile()) {
      throw new Error('Input path is not a file.');
    }

    const file = await fs.readFile(inputPath);
    console.log("file:",file);
    
    const pdfBuffer = await new Promise((resolve, reject) => {
      libre.convert(file, '.pdf', undefined, (err, done) => {
        console.log('file is converted', file);
        if (err) {
          reject(err);
        } else {
          resolve(done);
        }
      });
    });
    
    await fs.writeFile(outputPath, pdfBuffer);
    console.log('Conversion successful. PDF saved at:', outputPath);
  } catch (error) {
    console.error('Conversion error:', error);
  }
};

export const PptToPdf = async (req, res) => {
  try {
    //Checking valid video file or not
    if (!req.file) {
      return res.status(404).json({
        status: false, 
        message: "File Corrupted"
      });
    }
    console.log("Controller file details:",req.file);

    const pdfFilePath = `./${req.file.path}`;
    console.log("pdfFilePath:",pdfFilePath);

    const originalFileName = req.file.originalname;
    const fileName = originalFileName.split('.')[0]; 

    const outputPdfFolderPath = `./uploads/talkingPdf_${fileName}.pdf`;
    console.log("outputPdfFolderPath:",outputPdfFolderPath);

    await convertToPdf(pdfFilePath, outputPdfFolderPath);

    // Store pdf file in supabase
    // const pdfFile = await fs.readFile(outputPdfFolderPath);
    const pdfFile = fsCreate.readFileSync(outputPdfFolderPath);
    console.log("pdfFile:",pdfFile);

    const pdfName = `talkingPdf_${fileName}_${Date.now()}.pdf`;

    const { data, error } = await supabase.storage
      .from('pdf_url')
      .upload(pdfName, pdfFile);

    if (error) {
      return res.status(400).json({
        status: "false",
        message: "Error in uploading pdf file",
      })
    }

    const pdfUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/pdf_url/${pdfName}`;

    return res.status(200).json({
      status: "true",
      message: "Pdf to ppt conversion successful",
      filePath: pdfUrl
    })

  } catch(error) {
    //Error code
    return res.status(500).json({
      status: "false",
      message: "Something went wrong",
      error: error
    })
  }
}