import {Card, message, Upload} from "antd";
import {useState} from "react";
import {InboxOutlined} from "@ant-design/icons";
import {firestore} from "../firebase/firebaseConfig";
import {doc, setDoc} from "firebase/firestore";

const Dragger = Upload.Dragger;

export const uploadFileDataToUsersDb = () => {
  const [excelFile, setexcelFile] = useState(null);

  const draggerProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    onChange(info) {
      const {status} = info.file;
      if (status !== "uploading") {
        setexcelFile(info.file);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();
    // @ts-ignore: Object is possibly 'null'.
    formData.append("file", excelFile.originFileObj);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    const apiResult = await fetch("/api/dataUpload", requestOptions).then(
      (data) => data.json()
    );
    addDataToDb(apiResult.data);
  };

  const addDataToDb = async (fileData) => {
    // setDisplayLoader(true)
    fileData.map(async (val) => {
      let id = String(val["ITS_ID"]);
      await setDoc(doc(firestore, "users_db", id), val);
      console.log("true");
      return true;
    });
    // setDisplayLoader(false)
    console.log("file fields", fileData);
  };

  return (
    <Card
      className="border-radius-10"
      extra={
        <button
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 text-white p-2 rounded"
          disabled={!excelFile}
          onClick={handleFileSubmit}
          type="primary"
        >
          Submit
        </button>
      }
      title="Upload Excel File"
    >
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p>Click or drag file to this area to upload</p>
      </Dragger>
    </Card>
  );
};
