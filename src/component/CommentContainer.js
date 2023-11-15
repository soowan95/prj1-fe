import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useImmer } from "use-immer";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { LoginContext } from "./LoginProvider";
import { DeleteIcon } from "@chakra-ui/icons";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, updateComment] = useImmer({ boardId, comment: "" });

  const { isAuthenticated } = useContext(LoginContext);

  function handleSubmit() {
    onSubmit(comment);
    updateComment((draft) => {
      draft.comment = "";
    });
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
      {isAuthenticated() && (
        <Button isDisabled={isSubmitting} onClick={handleSubmit}>
          쓰기
        </Button>
      )}
    </Box>
  );
}

function CommentList({ commentList, onDelete, onUpdate }) {
  const id = useRef(0);

  const { isAdmin, hasAccess } = useContext(LoginContext);

  const updateModal = useDisclosure();
  const deleteModal = useDisclosure();

  function handleDelete() {
    onDelete(id.current);
  }

  function handleUpdate(comment) {
    onUpdate(comment, id.current);
  }

  return (
    <Card>
      <CardHeader>
        <Heading size={"md"}>댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={"4"}>
          {commentList !== null &&
            commentList.map((comment) => (
              <Box key={comment.id}>
                <Flex mb={"4"} justifyContent={"space-between"}>
                  <Heading size={"xs"}>{comment.memberId}</Heading>
                  <Text fontSize={"xs"}>{comment.inserted}</Text>
                </Flex>
                <Flex position={"relative"}>
                  <Text
                    sx={{ whiteSpace: "pre-wrap" }}
                    pt={"2"}
                    fontSize={"sm"}
                  >
                    {comment.comment}
                  </Text>
                  {(isAdmin() || hasAccess(comment.memberId)) && (
                    <Box display={"flex"} position={"absolute"} right={"0%"}>
                      <Button
                        size={"sm"}
                        fontSize={"15px"}
                        onClick={() => {
                          id.current = comment.id;
                          updateModal.onOpen();
                        }}
                        _hover={{ bg: "purple.300", color: "white" }}
                      >
                        수정
                      </Button>
                      <Button
                        size={"sm"}
                        fontSize={"15px"}
                        onClick={() => {
                          id.current = comment.id;
                          deleteModal.onOpen();
                        }}
                        _hover={{
                          bg: "red.300",
                          color: "white",
                        }}
                      >
                        삭제
                      </Button>
                    </Box>
                  )}
                  <Modal
                    isOpen={updateModal.isOpen}
                    onClose={updateModal.onClose}
                    isCentered
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>수정할 내용을 입력해 주세요.</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Textarea
                          onChange={(e) => (comment.comment = e.target.value)}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button onClick={updateModal.onClose}>닫기</Button>
                        <Button
                          onClick={() => {
                            handleUpdate(comment);
                            updateModal.onClose();
                          }}
                          _hover={{ bg: "purple.300", color: "white" }}
                        >
                          수정
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  <Modal
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.onClose}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>삭제 확인</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>삭제하시겠습니까?</ModalBody>
                      <ModalFooter>
                        <Button onClick={deleteModal.onClose}>닫기</Button>
                        <Button
                          onClick={() => {
                            handleDelete(comment.id);
                            deleteModal.onClose();
                          }}
                          _hover={{ bg: "red.300", color: "white" }}
                        >
                          삭제
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Flex>
              </Box>
            ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toast = useToast();

  function handleSubmit(comment) {
    setIsSubmitting(true);
    axios
      .post("/api/comment/add", { ...comment })
      .finally(() => setIsSubmitting(false));
  }

  function handleDelete(id) {
    setIsDeleting(true);
    axios
      .delete("/api/comment/delete?id=" + id)
      .then(() => {
        toast({
          description: "삭제 되었습니다.",
          status: "error",
        });
      })
      .finally(() => setIsDeleting(false));
  }

  function handleUpdate(comment, commentId) {
    setIsUpdating(true);
    axios
      .put("/api/comment/update", { ...comment, id: commentId })
      .then(() => {
        toast({
          description: "수정 되었습니다.",
          status: "info",
        });
      })
      .finally(() => setIsUpdating(false));
  }

  const [commentList, setCommentList] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (!isSubmitting && !isDeleting && !isUpdating) {
      axios
        .get("/api/comment/list/" + id)
        .then(({ data }) => setCommentList(data));
    }
  }, [isSubmitting, isDeleting, isUpdating]);

  return (
    <Box>
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <CommentList
        commentList={commentList}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </Box>
  );
}
