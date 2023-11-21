import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
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
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useImmer } from "use-immer";
import { LoginContext } from "../../component/LoginProvider";
import { CommentContainer } from "../../component/CommentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as likeHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as normalHeart } from "@fortawesome/free-regular-svg-icons";

export function BoardView() {
  const [board, setBoard] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const [wantFileUpdate, setWantFileUpdate] = useState(false);
  const [isAnyFile, setIsAnyFile] = useState(false);
  const [updateData, updateUpdateData] = useImmer({
    title: "",
    content: "",
    writer: "",
    file: null,
    isFileDelete: false,
  });

  const deleteModal = useDisclosure();
  const updateModal = useDisclosure();

  const { id } = useParams();

  const navigate = useNavigate();

  const toast = useToast();

  const { hasAccess, isAdmin } = useContext(LoginContext);

  useEffect(() => {
    axios.get("/api/board/id/" + id).then(({ data }) => setBoard(data));
  }, [isChange]);

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
      .finally(() => deleteModal.onClose());
  }

  function handleUpdateButton() {
    axios
      .putForm("/api/board/update/" + id, { ...updateData })
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

  function handleLike() {
    setIsChange(true);
    axios
      .post("/api/like", { boardId: board.id })
      .then(() => {
        toast({
          description: "좋아요!!",
          status: "info",
        });
      })
      .catch((e) => {
        if (e.response.status === 401)
          toast({
            description: "로그인 해주세요.",
            status: "error",
          });
        else
          toast({
            description: "좋아요 취소",
            status: "warning",
          });
      })
      .finally(() => {
        setIsChange(false);
      });
  }

  return (
    <Box>
      <Flex justifyContent={"space-between"}>
        <Heading size={"xl"}>{board.id} 번 글 보기</Heading>
        <Button variant={"ghost"} size={"xl"} onClick={handleLike}>
          <FontAwesomeIcon
            icon={board.isLike ? likeHeart : normalHeart}
            size="xl"
            color={board.isLike ? "red" : "black"}
          />
        </Button>
      </Flex>
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
      {board.files.map(({ url, id, name }) => (
        <Box key={id} my={"5px"} border={"3px solid black"}>
          <Image width={"100%"} src={url} alt={name} />
        </Box>
      ))}
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input value={board.nickName} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>작성일시</FormLabel>
        <Input value={board.inserted} readOnly />
      </FormControl>
      {(hasAccess(board.writer) || isAdmin()) && (
        <Box>
          <Button
            colorScheme="purple"
            onClick={() => {
              updateModal.onOpen();
              setWantFileUpdate(false);
            }}
          >
            수정
          </Button>
          <Button colorScheme="red" onClick={deleteModal.onOpen}>
            삭제
          </Button>
        </Box>
      )}

      {/* 삭제 모달 */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={deleteModal.onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={updateModal.isOpen} onClose={updateModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            수정 하시겠습니까?
            <Badge color={"purple"}>
              파일 수정
              <Checkbox
                colorScheme="purple"
                onChange={(e) => {
                  setWantFileUpdate(!wantFileUpdate);
                }}
              />
            </Badge>
            {wantFileUpdate || (
              <Badge color={"red"}>
                파일 삭제
                <Checkbox
                  colorScheme="red"
                  onChange={(e) =>
                    updateUpdateData((draft) => {
                      draft.isFileDelete = !draft.isFileDelete;
                    })
                  }
                />
              </Badge>
            )}
            {wantFileUpdate && (
              <FormControl>
                <Input
                  mt={"8px"}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    updateUpdateData((draft) => {
                      draft.file = e.target.files;
                    });
                    if (e.target.files.length > 0) setIsAnyFile(true);
                  }}
                />
                <FormHelperText color={"red"} textAlign={"center"}>
                  * 파일 수정 시 기존 파일은 삭제됩니다.
                </FormHelperText>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={updateModal.onClose}>닫기</Button>
            <Button
              isDisabled={wantFileUpdate && !isAnyFile}
              onClick={handleUpdateButton}
              colorScheme="purple"
            >
              수정하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CommentContainer boardId={board.id} />
    </Box>
  );
}
