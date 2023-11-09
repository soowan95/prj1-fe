import { Box, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardView() {
  const [board, setBoard] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    axios.get("/api/board/id?id=" + id).then(({ data }) => setBoard(data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>글 보기</h1>
      <p>번호: {board.id}</p>
      <p>제목: {board.title}</p>
      <p>본문: {board.content}</p>
      <p>작성자: {board.writer}</p>
      <p>작성일시: {board.inserted}</p>
    </Box>
  );
}
