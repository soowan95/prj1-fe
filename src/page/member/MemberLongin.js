import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useImmer } from "use-immer";
import axios from "axios";

export function MemberLongin() {
  const [userInfo, updateUserInfo] = useImmer({ id: "", password: "" });

  function handleLogin() {
    // todo: 로그인 후 성공, 실패, 완료 코드 추가
    axios
      .post("/api/member/login", { ...userInfo })
      .then(() => console.log("good"))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
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
