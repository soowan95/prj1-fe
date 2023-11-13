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
import { useImmer } from "use-immer";

export function MemberView() {
  const [member, setMember] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [updateData, updateUpdateData] = useImmer({});

  const [param] = useSearchParams();

  const navigate = useNavigate();

  const toast = useToast();

  const deleteModal = useDisclosure();
  const updateModal = useDisclosure();

  useEffect(() => {
    axios.get("/api/member?" + param.toString()).then(({ data }) => {
      setMember(data);
      updateUpdateData(data);
    });
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

  function handleUpdateButton() {
    axios
      .put("api/member?" + param.toString(), { ...updateData })
      .then(() => {
        toast({
          description: "수정이 완료됐습니다.",
          status: "success",
        });
        navigate("/member/list");
      })
      .catch((e) => {
        if (e.response.status === 401 || e.response.status === 403) {
          toast({
            description: "수정 권한이 없습니다.",
            status: "error",
          });
        } else if (e.response.status === 400) {
          toast({
            description: "중복된 email이 있습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "수정 중 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => updateModal.onClose());
  }

  let passwordChecked = false;

  if (passwordCheck === updateData.password) passwordChecked = true;

  if (updateData.password.length === 0) passwordChecked = true;

  return (
    <Box>
      <h1>{member.id} 님 정보</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="text"
          defaultValue={member.password}
          onChange={(e) => {
            updateUpdateData((draft) => {
              draft.password = e.target.value;
            });
          }}
        />
      </FormControl>
      {updateData.password.length > 0 && (
        <FormControl>
          <FormLabel>password 확인</FormLabel>
          <Input
            type="text"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </FormControl>
      )}
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input
          defaultValue={member.email}
          onChange={(e) => {
            updateUpdateData((draft) => {
              draft.email = e.target.value;
            });
          }}
        />
      </FormControl>
      <Button onClick={updateModal.onOpen} colorScheme="purple">
        수정
      </Button>
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

      <Modal isOpen={updateModal.isOpen} onClose={updateModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {(!passwordChecked && "비밀번호를 확인해주세요.") ||
              "수정 하시겠습니까?"}
          </ModalBody>
          <ModalFooter>
            <Button onClick={updateModal.onClose}>닫기</Button>
            <Button
              isDisabled={!passwordChecked && "disalbed"}
              onClick={handleUpdateButton}
              colorScheme="purple"
            >
              수정하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
