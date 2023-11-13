import { useSearchParams } from "react-router-dom";

export function MemberView() {
  const [param] = useSearchParams();

  return <div>{param.get("id")} 회원 정보 보기</div>;
}
