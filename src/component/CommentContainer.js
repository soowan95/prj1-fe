import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  Textarea,
} from "@chakra-ui/react";
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
        onChange={(e) => {
          updateComment((draft) => {
            draft.comment = e.target.value;
          });
        }}
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

  return (
    <Card>
      <CardHeader>
        <Heading size={"md"}>댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={"4"}>
          {/* todo: 댓글 작성 후 re render */}
          {commentList !== null &&
            commentList.map((comment) => (
              <Box>
                <Flex justifyContent={"space-between"}>
                  <Heading size={"xs"}>{comment.memberId}</Heading>
                  <Text fontSize={"xs"}>{comment.inserted}</Text>
                </Flex>
                <Text sx={{ whiteSpace: "pre-wrap" }} pt={"2"} fontSize={"sm"}>
                  {comment.comment}
                </Text>
              </Box>
            ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
