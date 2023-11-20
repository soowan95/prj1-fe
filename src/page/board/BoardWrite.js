import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useImmer } from "use-immer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [write, updateWrite] = useImmer({
    title: "",
    content: "",
    files: null,
  });

  const navigate = useNavigate();

  const toast = useToast();

  function handleSubmit() {
    setIsSubmitting(true);
    axios
      .postForm("/api/board/add", { ...write })
      .then(() => {
        toast({
          description: "새 글이 저장되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((e) => {
        if (e.response.status === 400) {
          toast({
            description: "작성한 내용을 확인해주세요.",
            status: "error",
          });
        } else {
          toast({
            description: "저장 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => setIsSubmitting(false));
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
          <FormLabel>이미지</FormLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              updateWrite((draft) => {
                draft.files = e.target.files;
              })
            }
          />
          <FormHelperText>
            한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부하세요.
          </FormHelperText>
        </FormControl>

        <Button
          isDisabled={isSubmitting}
          onClick={handleSubmit}
          colorScheme="blue"
        >
          저장
        </Button>
      </Box>
    </Box>
  );
}
