import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AddContext } from "../context/AppContext";
import axios from "axios";

const Profile = () => {
  const { state, setState } = React.useContext(AddContext);
  const [refresh, setRefresh] = useState(false);
  const [input, setInput] = useState("");
  const [inputKey, setInputKey] = useState(0);
  const [data, setData] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);
  const [iD, setId] = useState("");
  const deleteImage = (id) => {
    axios.delete(`http://localhost:4500/file/${id}`).then((res) => {
      if (res.data === "file deleted successfully") {
        setRefresh(!refresh);
        alert("file deleted successfully");
      } else {
        alert("error while deleting file");
      }
    });
  };

  const downloadImage = async (filecode, id) => {
    try {
      const response = await axios.get(
        `http://localhost:4500/file/${filecode}/download`,
        {
          responseType: "blob",
          headers: {
            authorization: state.token,
          },
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = URL.createObjectURL(blob);

      setDownloadLink(url);
      setId(id);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handelAddFile = () => {
    if (!input) {
      alert("select file first...");
    } else {
      let formData = new FormData();
      formData.append("file", input);

      axios
        .post("http://localhost:4500/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: state.token,
          },
        })
        .then((response) => {
          if (response.data.message == "File uploaded successfully") {
            setRefresh(!refresh);
            setInput("");
            setInputKey((prevKey) => prevKey + 1);
            alert("File uploaded successfully");
          } else {
            alert("error while uploading");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:4500/file", {
        headers: {
          Authorization: state.token,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, [refresh]);
  useEffect(() => {}, []);
  return (
    <div>
      <Heading>My profile</Heading>
      <Center>
        <Box p="20px">
          <Text p="10px" fontSize={"20px"} fontWeight={"bold"}>
            Add new file here...
          </Text>
          <Input
            key={inputKey}
            onChange={(e) => setInput(e.target.files[0])}
            type="file"
          />
          <Button m="10px" onClick={handelAddFile}>
            Add File
          </Button>
        </Box>
      </Center>
      <Table>
        <Thead>
          <Tr>
            <Th>Sr.No</Th>
            <Th>file_image</Th>
            <Th>Download</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((item, index) => {
            return (
              <Tr key={item._id}>
                <Td>{++index}</Td>
                <Td>{item.file}</Td>
                <Td>
                  <Button
                    onClick={() => downloadImage(item.filecode, item._id)}
                  >
                    {downloadLink && iD == item._id ? (
                      <a href={downloadLink} download>
                        Click again
                      </a>
                    ) : (
                      "Download"
                    )}
                  </Button>
                </Td>
                <Td onClick={() => deleteImage(item._id)}>
                  <Button>Delete</Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
};

export default Profile;
