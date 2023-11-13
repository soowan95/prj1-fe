import {
  Box,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);

  useEffect(() => {
    axios.get("/api/board/list").then(({ data }) => setBoardList(data));
  }, []);

  const navigate = useNavigate();

  if (boardList === null) return <Spinner />;

  return (
    <Box>
      <h1>게시물 목록</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>title</Th>
              <Th>by</Th>
              <Th>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map(({ id, title, writer, inserted }) => (
              <Tr
                key={id}
                onClick={() => navigate("/board/" + id)}
                _hover={{ cursor: "pointer" }}
              >
                <Td>{id}</Td>
                <Td>{title}</Td>
                <Td>{writer}</Td>
                <Td>{inserted}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
