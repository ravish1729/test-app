import './App.css';
import React, { useState } from "react"
import lighthouse from '@lighthouse-web3/sdk'

function App() {

  const progressCallback = (progressData) => {
    console.log(progressData)
  };

  // const progressCallback = (progressData) => {
  //   console.log(progressData)
  //   let percentageDone =
  //     100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
  //   console.log(percentageDone);
  // };

  const uploadFile = async(e) =>{
    e.persist()
    console.log("uploading")
    const output = await lighthouse.upload(e.target.files, "46c716ab.1b5886afd61d4f80b75eded178305a24", 1, progressCallback);
    console.log('File Status:', output);
  }

  return (
    <div className="App">
      {/* <input type="file" onChange={handleFileChange} /> */}
      {/* <button onClick={uploadEncryptedFile} disabled={!file}>
        Upload Encrypted File
      </button> */}
      {/* <button onClick={testAPI}>Test call</button> */}
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <input onChange={e=>uploadFile(e)} type="file" directory="true" webkitdirectory="true" />
      </div>
    </div>
  );
}

export default App;
