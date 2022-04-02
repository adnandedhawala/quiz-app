import {doc, setDoc} from "firebase/firestore";
import formidable from "formidable";
import XLSX from "xlsx";
import {firestore} from "../../firebase/firebaseConfig";

function formidablePromise(req, opts) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm(opts);

    form.parse(req, (error, fields, files) => {
      if (error) {
        return reject(error);
      }
      resolve({fields, files});
    });
  });
}

const handler = async (req, res) => {
  // const form = new formidable.IncomingForm();
  if (req.method === "POST") {
    try {
      const {files} = await formidablePromise(req, {});
      const sampleData = XLSX.readFile(files.file.filepath);
      const data = [];

      const sheets = sampleData.SheetNames;

      for (let i = 0; i < sheets.length; i++) {
        const temp = XLSX.utils.sheet_to_json(
          sampleData.Sheets[sampleData.SheetNames[i]]
        );
        temp.forEach((response) => {
          data.push(response);
        });
      }

      res.status(200).json({data});
    } catch (error) {
      res.status(500).json({error: error});
    }
  } else {
    res.status(404).json({msg: "api not found"});
  }
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
