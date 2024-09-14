import multer, { diskStorage } from "multer";
import { join, extname } from "node:path";

const __dirname = import.meta.dirname;

// console.log(join(__dirname, "..", "public"));
const storage = diskStorage({
  destination: join(__dirname, "..", "public"),
  filename: (_, f, cb) => {
    // console.log(file.originalname);
    cb(null, `${Date.now()}_${f.fieldname}${extname(f.originalname)}`);
  },
});
const upload = multer({
  storage,
});

export default upload;
