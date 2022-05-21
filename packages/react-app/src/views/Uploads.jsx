import { Upload, message } from 'antd';
import { useState } from 'react';
import sjcl from 'sjcl'

const { Dragger } = Upload;


function Uploads({address}) {
  const [fileName, setFileName] = useState("");
  const [fileHash, setFileHash] = useState("");

  const hashFunction = ({ file, onSuccess }) => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setFileHash(sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(address + String(reader.result))));
    }
    
    setTimeout(() => {
      onSuccess("ok");
    }, 5000);
  };
  
  const onChange = (info) => {
    const {status} = info.file;
    if (status === 'done') {
      setFileName(info.file.name);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  const onRemove = (info) => {
    setFileName("");
  }

  return (
    <div style={{display:"flex", flexDirection:"row", height:"100%"}}>
        <Dragger multiple={false} maxCount={1} customRequest={hashFunction} 
        style={{width:"50vw", height:"100%"}} onChange={onChange} onRemove={onRemove}>
            {(fileName === "") ? <p>Step 1</p> : <p>Step 1: Completed</p>}
            {(fileName === "") ? <p>Drag and drop a file here or click to upload.</p> : <p>{fileName + " Uploaded"}</p>}
        </Dragger>
        <div style={{display:"flex", flexDirection:"column", height:"100%"}}>
            <p>Upload!</p>
            <p>{fileName}</p>
            <p>{fileHash}</p>
        </div>
    </div>
  )
}

export default Uploads;