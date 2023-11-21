import { Box, Button, Flex, Input, Select } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");

  const navigate = useNavigate();

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);

    navigate("/?" + params);
  }

  return (
    <Flex>
      <Select onChange={(e) => setCategory(e.target.value)}>
        <option selected value="all">
          전체
        </option>
        <option value="title">제목</option>
        <option value="content">본문</option>
      </Select>
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <Button onClick={handleSearch}>검색</Button>
    </Flex>
  );
}
