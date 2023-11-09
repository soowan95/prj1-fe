import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useImmer } from "use-immer";

export function BoardView() {
  const [board, setBoard] = useState(null);
  const [updateData, updateUpdateData] = useImmer({
    title: "",
    content: "",
    writer: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id } = useParams();

  const navigate = useNavigate();

  const toast = useToast();

  useEffect(() => {
    axios.get("/api/board/id/" + id).then(({ data }) => setBoard(data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/board/remove/" + id)
      .then(
        () =>
          toast({
            description: id + "번 정보가 삭제됐습니다.",
            status: "success",
          }),
        navigate("/"),
      )
      .catch(() =>
        toast({
          description: "삭제 중 문제가 발생했습니다.",
          status: "error",
        }),
      )
      .finally(() => onClose());
  }

  function handleUpdateButton() {
    axios
      .put("/api/board/update/" + id, { ...updateData })
      .then(
        () =>
          toast({
            description: "수정 되었습니다.",
            status: "success",
          }),
        navigate("/"),
      )
      .catch(() =>
        toast({
          description: "수정 중 문제가 발생했습니다.",
          status: "error",
        }),
      );
  }

  return (
    <Box>
      <h1>글 보기</h1>
      <FormControl>
        <FormLabel>번호</FormLabel>
        <Input value={board.id} />
      </FormControl>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          defaultValue={board.title}
          onChange={(e) =>
            updateUpdateData((draft) => {
              draft.title = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea
          defaultValue={board.content}
          onChange={(e) =>
            updateUpdateData((draft) => {
              draft.content = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input
          defaultValue={board.writer}
          onChange={(e) =>
            updateUpdateData((draft) => {
              draft.writer = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>작성일시</FormLabel>
        <Input value={board.inserted} />
      </FormControl>
      <Button colorScheme="purple" onClick={handleUpdateButton}>
        수정
      </Button>
      <Button colorScheme="red" onClick={onOpen}>
        삭제
      </Button>

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
