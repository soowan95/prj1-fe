import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useImmer } from "use-immer";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../../component/LoginProvider";
import { useNavigate } from "react-router-dom";

export function MemberLongin() {
  const [userInfo, updateUserInfo] = useImmer({ id: "", password: "" });

  const { fetchLogin } = useContext(LoginContext);

  const navigate = useNavigate();

  const toast = useToast();

  function handleLogin() {
    axios
      .post("/api/member/login", { ...userInfo })
      .then(() => {
        toast({
          description: "로그인 되었습니다.",
          status: "info",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "아이디와 암호를 다시 확인해주세요.",
          status: "warning",
        });
      })
      .finally(() => fetchLogin());
  }

  return (
    <Box>
      <h1>로그인</h1>
      <FormControl>
        <FormLabel>ID</FormLabel>
        <Input
          value={userInfo.id}
          onChange={(e) =>
            updateUserInfo((draft) => {
              draft.id = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>PASSWORD</FormLabel>
        <Input
          type="password"
          value={userInfo.password}
          onChange={(e) =>
            updateUserInfo((draft) => {
              draft.password = e.target.value;
            })
          }
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleLogin}>
        로그인
      </Button>
    </Box>
  );
}
