const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = multer.memoryStorage();
const upload = multer({ storage });


app.use(express.static(path.join(__dirname, 'public')));

app.use("/",(req,res)=>{
  res.send('Hello,server is running!!');
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
    if (error || !result) {
      console.error('Error uploading to Cloudinary:', error);
      return res.status(500).json({ error: 'Error uploading image' });
    }

    res.json({ url: result.secure_url });
  }).end(req.file.buffer);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
