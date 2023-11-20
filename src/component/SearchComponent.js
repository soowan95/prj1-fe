import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchComponent() {
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("k", keyword);

    navigate("/?" + params);
  }

  return (
    <Flex>
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <Button onClick={handleSearch}>검색</Button>
    </Flex>
  );
}
