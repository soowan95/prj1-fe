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
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { SearchComponent } from "../../component/SearchComponent";
import {
  faAngleLeft,
  faAngleRight,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();

  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    navigate("/?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function Pagination({ pageInfo }) {
  const pageNumbers = [];

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageInfo.prevPageNumber && (
        <PageButton variant="ghost" pageNumber={pageInfo.prevPageNumber}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </PageButton>
      )}

      {pageNumbers.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          variant={
            pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
          }
          pageNumber={pageNumber}
        >
          {pageNumber}
        </PageButton>
      ))}

      {pageInfo.nextPageNumber && (
        <PageButton variant="ghost" pageNumber={pageInfo.nextPageNumber}>
          <FontAwesomeIcon icon={faAngleRight} />
        </PageButton>
      )}
    </Box>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const [params] = useSearchParams();

  const location = useLocation();

  useEffect(() => {
    axios.get("/api/board/list?" + params).then(({ data }) => {
      setBoardList(data.boardList);
      setPageInfo(data.pageInfo);
    });
  }, [location]);

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
              ({
                id,
                title,
                nickName,
                ago,
                commentCount,
                likeCount,
                imageCount,
              }) => (
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
                    {imageCount > 0 && (
                      <Badge>
                        <FontAwesomeIcon icon={faImage} color="green" />
                        {imageCount}
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

      <SearchComponent />

      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
