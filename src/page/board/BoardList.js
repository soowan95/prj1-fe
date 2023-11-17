import {
  Badge,
  Box,
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const page = useRef(1);
  const [params] = useSearchParams();

  useEffect(() => {
    axios
      .get("/api/board/list?" + params)
      .then(({ data }) => setBoardList(data));
  }, [page.current]);

  const navigate = useNavigate();

  if (boardList === null) return <Spinner />;

  function handlePaging(e) {
    page.current = e;
    navigate("/?p=" + e);
  }

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
              ({ id, title, nickName, ago, commentCount, likeCount }) => (
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
                        <ChatIcon color={"skyblue"} />
                        {commentCount}
                      </Badge>
                    )}
                    {likeCount > 0 && (
                      <Badge>
                        <FontAwesomeIcon icon={faHeart} color="red" />
                        {likeCount}
                      </Badge>
                    )}
                  </Td>
                  <Td>{nickName}</Td>
                  <Td>{ago}</Td>
                </Tr>
              ),
            )}
          </Tbody>
        </Table>
      </Box>
      <Box>
        <Button value="1" onClick={(e) => handlePaging(e.target.value)}>
          1
        </Button>
        <Button value="2" onClick={(e) => handlePaging(e.target.value)}>
          2
        </Button>
        <Button value="3" onClick={(e) => handlePaging(e.target.value)}>
          3
        </Button>
        <Button value="4" onClick={(e) => handlePaging(e.target.value)}>
          4
        </Button>
        <Button value="5" onClick={(e) => handlePaging(e.target.value)}>
          5
        </Button>
        <Button value="6" onClick={(e) => handlePaging(e.target.value)}>
          6
        </Button>
        <Button value="7" onClick={(e) => handlePaging(e.target.value)}>
          7
        </Button>
        <Button value="8" onClick={(e) => handlePaging(e.target.value)}>
          8
        </Button>
        <Button value="9" onClick={(e) => handlePaging(e.target.value)}>
          9
        </Button>
        <Button value="10" onClick={(e) => handlePaging(e.target.value)}>
          10
        </Button>
      </Box>
    </Box>
  );
}
