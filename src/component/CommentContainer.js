import { Box, Button, Input, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { useImmer } from "use-immer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CommentForm({ boardId }) {
  const [comment, updateComment] = useImmer({ boardId, comment: "" });

  function handleSubmit() {
    axios.post("/api/comment/add", { ...comment });
  }

  return (
    <Box>
      <Textarea
        value={comment.comment}
        onChange={(e) =>
          updateComment((draft) => {
            draft.comment = e.target.value;
          })
        }
      />
      <Button onClick={handleSubmit}>쓰기</Button>
    </Box>
  );
}

function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get("/api/comment/list/" + id)
      .then(({ data }) => setCommentList(data));
  }, []);

  return <Box>댓글 리스트</Box>;
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
