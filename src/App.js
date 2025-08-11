import logo from './logo.svg';
import './App.css';
import {ethers} from "ethers"
import kavach from "@lighthouse-web3/kavach"
import React, { useState } from "react"
import lighthouse from '@lighthouse-web3/sdk'

function App() {

  const [file, setFile] = useState(null)
  const apiKey = "7a6bf0c7.beaf501b421145e3a9cfbdecb9f31ed0"

  const signAuthMessage = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        if (accounts.length === 0) {
          throw new Error("No accounts returned from Wallet.")
        }
        const signerAddress = accounts[0]
        const { message } = (await lighthouse.getAuthMessage(signerAddress)).data
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, signerAddress],
        })
        return { signature, signerAddress }
      } catch (error) {
        console.error("Error signing message with Wallet", error)
        return null
      }
    } else {
      console.log("Please install Wallet!")
      return null
    }
  }

  const uploadEncryptedFile = async () => {
    if (!file) {
      console.error("No file selected.")
      return
    }

    try {
      // This signature is used for authentication with encryption nodes
      // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
      const encryptionAuth = await signAuthMessage()
      if (!encryptionAuth) {
        console.error("Failed to sign the message.")
        return
      }

      const { signature, signerAddress } = encryptionAuth

      // Upload file with encryption
      const output = await lighthouse.uploadEncrypted(
        file,
        apiKey,
        signerAddress,
        signature,
      )
      console.log("Encrypted File Status:", output)
      /* Sample Response
        {
          data: [
            Hash: "QmbMkjvpG4LjE5obPCcE6p79tqnfy6bzgYLBoeWx5PAcso",
            Name: "izanami.jpeg",
            Size: "174111"
          ]
        }
      */
      // If successful, log the URL for accessing the file
      console.log(
        `Decrypt at https://decrypt.mesh3.network/evm/${output.data[0].Hash}`
      )
    } catch (error) {
      console.error("Error uploading encrypted file:", error)
    }
  }

  // Function to handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const testAPI = async() =>{
    // const response = await lighthouse.getUploads("0c955011.2164a6c7ab9248e2ad986fab281bec29")
    // console.log(response)
    const cid = "QmeMsykMDyD76zpAbinCy1cjb1KL6CVNBfB44am15U1XHh"
    const fileInfo = await lighthouse.getFileInfo(cid)
    console.log(fileInfo)
    const balance = await lighthouse.getBalance("0c955011.2164a6c7ab9248e2ad986fab281bec29")
    console.log(balance)
    const status = await lighthouse.dealStatus('QmPCM9nLb4CdtWH9M5iD4oi32ARtaFxgUfgr1eMViU8dfZ')
    console.log(status)

  }

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
    const output = await lighthouse.upload(e.target.files, "46c716ab.1b5886afd61d4f80b75eded178305a24", progressCallback);
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
