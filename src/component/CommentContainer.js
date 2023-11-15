import { Box, Button, Input, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { useImmer } from "use-immer";

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

function CommentList() {
  return <Box>댓글 리스트</Box>;
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList />
    </Box>
  );
}
