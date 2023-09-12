import "./App.css";
import React from "react";
import { Buffer } from "buffer";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
const { Client } = require("box-typescript-sdk-gen/lib/client.generated.js");
const {
  DeveloperTokenAuth,
} = require("box-typescript-sdk-gen/lib/developerTokenAuth.js");

let auth = new DeveloperTokenAuth({
  token: "ty693Dnm4P7I3UI4ttRSekRv0CiCqu5e",
});
let client = new Client({ auth });
function App() {
  async function readByteStream(byteStream) {
    const buffers = [];
    for await (const data of byteStream) {
      buffers.push(data);
    }
    return Buffer.concat(buffers);
  }
  const [items, setItems] = React.useState([]);
  const [token, setToken] = React.useState("");
  let getFiles = async (folderId) => {
    let entries = (await client.folders.getFolderItems(folderId)).entries;
    setItems(entries);
  };
  let promptAndDownloadFile = async () => {
    const fileId = window.prompt("Enter file ID to download");
    if (fileId) {
      await downloadFile(fileId);
    }
    console.log(process.version);
  };
  let downloadFile = async (fileId) => {
    const fileInfo = await client.files.getFileById(fileId);
    const result = await client.downloads.downloadFile(fileId);
    const blob = new Blob([await readByteStream(result)], {
      type: "text/plain",
    });
    const blobUrl = window.URL.createObjectURL(blob);
    // Create a hidden anchor element to trigger the download
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = blobUrl;
    anchor.download = fileInfo.name; // Specify the desired file name

    // Trigger a click event on the anchor element to initiate the download
    document.body.appendChild(anchor);
    anchor.click();

    // Clean up by revoking the Blob URL when no longer needed
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="App">
      <header className="App-header">
        <TextField
          label="Developer Token"
          variant="outlined"
          onChange={(value) => {
            setToken(value.target.value);
            auth = new DeveloperTokenAuth({
              token: value.target.value,
            });
            client = new Client({ auth });
          }}
        ></TextField>
        <br />
        <Button variant="contained" onClick={() => getFiles("0")}>
          Get Files
        </Button>
        {/* <button onClick={promptAndDownloadFile}>DownloadFile</button> */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={`${item.type}-${item.id}`}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    {item.type === "file" ? (
                      <button onClick={() => downloadFile(item.id)}>
                        Download
                      </button>
                    ) : item.type === "folder" ? (
                      <button onClick={() => getFiles(item.id)}>Open</button>
                    ) : item.type === "web_link" ? (
                      <a href={item.url} target="_blank" rel="noreferrer">
                        <button>Open</button>
                      </a>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </header>
    </div>
  );
}

export default App;
