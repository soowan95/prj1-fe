import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useImmer } from "use-immer";

export function BoardWrite() {
  const [write, updateWrite] = useImmer({ title: "", content: "", writer: "" });

  function handleSubmit() {
    axios
      .post("/api/board/add", { write })
      .then(() => console.log("잘됨"))
      .catch(() => console.log("안됨"))
      .finally(() => console.log("끝"));
  }

  return (
    <Box>
      <h1>게시물 작성</h1>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            value={write.title}
            onChange={(e) =>
              updateWrite((draft) => {
                draft.title = e.target.value;
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea
            value={write.content}
            onChange={(e) =>
              updateWrite((draft) => {
                draft.content = e.target.value;
              })
            }
          ></Textarea>
        </FormControl>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input
            value={write.writer}
            onChange={(e) =>
              updateWrite((draft) => {
                draft.writer = e.target.value;
              })
            }
          />
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="blue">
          저장
        </Button>
      </Box>
    </Box>
  );
}
