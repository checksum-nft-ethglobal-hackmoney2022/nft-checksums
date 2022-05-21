import { Upload, message, Button } from 'antd';
import { useState, useEffect} from 'react';
import sjcl from 'sjcl'
const { Dragger } = Upload;


function Uploads({
  address
}) {
  const [fileName, setFileName] = useState("");
  const [fileString, setFileString] = useState("");
  const [fileHash, setFileHash] = useState("None");

  const hashFunction = ({ file, onSuccess }) => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setFileString(reader.result);
      onSuccess("ok");
    }
  };
  
  const onChange = (info) => {
    const {status} = info.file;
    if (status === 'done') {
      setFileName(info.file.name);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      setFileHash("None");
      setFileName("");
      setFileString("");
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  const onRemove = () => {
    setFileName("");
    setFileString("");
    setFileHash("None");
  }

  useEffect(() => {
    if ((fileName !== "")&&(address !== undefined)){
      setFileHash(sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(address + fileString)));
    }else{
      setFileHash("None");
    }
    
  }
  ,[address, fileString])

  return (
    <div style={{display:"flex", flexDirection:"row", height:"50vh"}}>
        <Dragger multiple={false} maxCount={1} customRequest={hashFunction} 
        style={{width:"50vw", height:"100%"}} onChange={onChange} onRemove={onRemove}>
            {(fileName === "") ? <h4>Step 1</h4> : <h4>Step 1: Completed</h4>}
            {(fileName === "") ? <p>Drag and drop a file here to generate checksum</p> : <p>{fileName + " Uploaded"}</p>}
        </Dragger>
        <div style={{display:"flex", flexDirection:"column", height:"100%", width:"50vw"}}>
            <div style={{height:"25vh"}}>
              {(address === undefined) ? <h4>Step 2</h4> : <h4>Step 2: Completed</h4>}
              {(address === undefined) ? <p>Click on top right button to connect to your wallet</p> : 
              <p>{"Address: " + address.substring(0, 15) + "..."}</p>}
            </div>
            <div style={{height:"25vh"}}>
              <h4>Step 3</h4>
              <div style={{display:"flex", flexDirection:"row", height:"100%"}}>
                <div style={{width:"25vw"}}>
                  <h5>Hash</h5>
                  <p style={{wordWrap:"break-word", padding:10}}>{fileHash}</p>
                </div>
                <div style={{width:"25vw", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                  {(fileHash !== "None") ?
                    <Button type='primary'>
                      Submit
                    </Button>:
                    <Button type='primary' disabled>
                      Please Complete Previous Steps
                    </Button>
                  }
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Uploads;