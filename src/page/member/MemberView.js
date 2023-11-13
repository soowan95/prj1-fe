import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export function MemberView() {
  const [member, setMember] = useState(null);

  const [param] = useSearchParams();

  const navigate = useNavigate();

  const toast = useToast();

  const deleteModal = useDisclosure();

  useEffect(() => {
    axios
      .get("/api/member?" + param.toString())
      .then(({ data }) => setMember(data));
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/member?" + param.toString())
      .then(() => {
        toast({
          description: "탈퇴 완료했습니다.",
          status: "success",
        });
        navigate("/");

        // todo: 로그아웃기능 추가하기
      })
      .catch((e) => {
        if (e.response.status === 401 || e.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "탈퇴 처리 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => deleteModal.onClose());
  }

  return (
    <Box>
      <h1>{member.id} 님 정보</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input type="text" value={member.password} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input value={member.email} readOnly />
      </FormControl>
      <Button colorScheme="purple">수정</Button>
      <Button onClick={deleteModal.onOpen} colorScheme="red">
        탈퇴
      </Button>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>탈퇴 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>탈퇴 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={deleteModal.onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              탈퇴
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
