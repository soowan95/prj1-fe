import {
  Badge,
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
import { ChatIcon } from "@chakra-ui/icons";

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
            {boardList.map(
              ({ id, title, nickName, inserted, commentCount }) => (
                <Tr
                  key={id}
                  onClick={() => navigate("/board/" + id)}
                  _hover={{ cursor: "pointer" }}
                >
                  <Td>{id}</Td>
                  <Td>
                    {title}{" "}
                    {commentCount > 0 && (
                      <Badge>
                        <ChatIcon />
                        {commentCount}
                      </Badge>
                    )}
                  </Td>
                  <Td>{nickName}</Td>
                  <Td>{inserted}</Td>
                </Tr>
              ),
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
