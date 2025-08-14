import __dirname from "./index.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  let folder;
  if (file.fieldname === "petImage") {
   folder = path.join(__dirname, "../public/pets");
  } else if (file.fieldname === "documents") {
   folder = path.join(__dirname, "../public/documents");
  } else {
   folder = path.join(__dirname, "../public/others");
  }
  cb(null, folder);
 },
 filename: function (req, file, cb) {
  cb(null, `${Date.now()}-${file.originalname}`);
 },
});

const uploader = multer({ storage });

export default uploader;