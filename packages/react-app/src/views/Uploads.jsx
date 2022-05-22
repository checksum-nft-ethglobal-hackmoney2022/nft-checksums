import { Upload, message, Button, Divider } from 'antd';
import { useContractLoader } from 'eth-hooks';
import { useState, useEffect, useMemo} from 'react';
import { Transactor } from '../helpers';
import sjcl from 'sjcl'
const { Dragger } = Upload;


function Uploads({
  address,
  provider,
  chainId,
  contractConfig,
  signer,
  gasPrice,
}) {
  const [fileName, setFileName] = useState("");
  const [fileString, setFileString] = useState("");
  const [fileHash, setFileHash] = useState("None");
  const [output, setOutput] = useState("");

 

  const hashFunction = ({ file, onSuccess }) => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setFileString(reader.result);
      onSuccess("ok");
    }
  };
  
  const onChange = (info) => {
    setOutput("")
    const {status} = info.file;
    if (status === 'done') {
      setFileName(info.file.name);
      message.success(`${info.file.name} file loaded successfully.`);
    } else if (status === 'error') {
      setFileHash("None");
      setFileName("");
      setFileString("");
      message.error(`${info.file.name} file load failed.`);
    }
  }

  const onRemove = () => {
    setOutput("")
    setFileName("");
    setFileString("");
    setFileHash("None");
  }

  const tx = Transactor(provider, gasPrice);
  let contract = useContractLoader(provider, contractConfig, chainId)["CheckSumContract"];
  
  const add = useMemo(()=>{
    if (contract) {
      return contract.connect(signer)["add(string)"]
    }
    
  } , [contract]);


  const onUpload = async () => {
    try{
      setOutput("Loading...")
      await add(fileHash)
      setOutput("Uploaded successfully.")
      message.success(`Push to blockchain successfully.`);
    }catch(e){
      message.error('Push to blockchain failed');
      setOutput(JSON.stringify(e))
    }
  }

  useEffect(() => {
    if ((fileName !== "")&&(address !== undefined)){
      setFileHash(sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(address + fileString)));
    }else{
      setFileHash("None");
    }
    if (address === undefined){
      setOutput("")
    }
  }
  ,[address, fileName])

  return (
    <div style={{display:"flex", flexDirection:"row", height:"50vh"}}>
      <Dragger multiple={false} maxCount={1} customRequest={hashFunction}
        style={{ width: "50vw", height: "100%" }} onChange={onChange} onRemove={onRemove}>
        {(fileName === "") ? <h4>Step 1</h4> : <h4>Step 1: Completed</h4>}
        {(fileName === "") ? <p>Drag and drop a file here to generate checksum</p> : <p>{fileName + " Uploaded"}</p>}
      </Dragger>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "50vw" }}>
        <div>
          {(address === undefined) ? <h4>Step 2</h4> : <h4>Step 2: Completed</h4>}
          {(address === undefined) ? <p>Click on top right button to connect to your wallet</p> :
            <p>{"Address: " + address.substring(0, 15) + "..."}</p>}
          <Divider />
        </div>
        <div style={{ height: "25vh" }}>
          <h4>Step 3</h4>
          <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
            <div style={{
              height: "100%", width: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", flexDirection: "column"
            }}>
              <h5>Hash</h5>
              <p style={{ wordWrap: "break-word", padding: 10, width: "100%" }}>{fileHash}</p>
            </div>
            <div style={{ height: "100%", width: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {(fileHash !== "None") ?
                ((output === "Uploaded successfully.") ? 
                  <Button type='primary' disabled>
                    Uploaded
                  </Button>:
                  ((output === "Loading...") ?
                  <Button type='primary' loading>
                    Loading
                  </Button>:
                  <Button type='primary' onClick={()=>{onUpload()}}>
                    Upload
                  </Button>)
                  ):
                <Button type='primary' disabled>
                  Please Complete Previous Steps
                </Button>
              }
            </div>
          </div>
        </div>
        <div>
          <h4 style={{wordWrap: "break-word", padding: 20}}>{output}</h4>
        </div>
      </div>
    </div>
  )
}

export default Uploads;