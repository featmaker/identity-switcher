import { Avatar, Tag } from "@douyinfe/semi-ui";
import { IconTickCircle, IconClear } from "@douyinfe/semi-icons";
import dayjs from "dayjs";

import "./index.scss";
import type { User } from "../Index";

const ENV_MAP = {
  staging: "测试环境",
  production: "生产环境",
};

export default function UserCard({
  user,
  selectedToken,
  setSelectedToken,
  removeUser,
}: {
  user: User;
  selectedToken: string;
  setSelectedToken: Function;
  removeUser: Function;
}) {
  const isSelected = selectedToken === user.lqtoken.value;
  const isExpired = user.lqtoken.expirationDate * 1000 < Date.now();
  const expiredDays = dayjs(user.lqtoken.expirationDate * 1000).diff(
    dayjs(),
    "day"
  );

  const handleDelete = (e: any) => {
    e.preventDefault();
    removeUser(user.lqtoken.value);
  };

  const handleSelect = () => {
    if (!isExpired) {
      setSelectedToken(user.lqtoken.value);
    }
  };

  return (
    <div
      className={[
        "user-card",
        isSelected ? "selected" : "",
        isExpired ? "expired" : "",
      ].join(" ")}
      onClick={() => handleSelect()}
    >
      <div className="tags-wrap">
        <Tag className={["env-label", user.env].join(" ")}>
          {ENV_MAP[user.env]}
        </Tag>
      </div>
      <IconClear className="btn-x" onClick={handleDelete} />
      <div
        className={[
          "avatar-wrap",
          "flex",
          "flex-col",
          isSelected ? "selected" : "",
          isExpired ? "expired" : "",
        ].join(" ")}
      >
        <Avatar
          size="large"
          style={{ margin: 4 }}
          alt="User"
          className="avatar"
        >
          <img src={user.avatar_url} alt={user.name} />
        </Avatar>
        <span className="user-name" title={user.name}>
          {user.name}
        </span>
      </div>
      {isExpired ? (
        <div className="footer-wrap">
          <Tag color="red">已过期</Tag>
        </div>
      ) : isSelected ? (
        <div className="footer-wrap">
          <IconTickCircle className="selected-emoji" size="large" />
        </div>
      ) : (
        <div className="footer-wrap">
          <Tag color={expiredDays > 3 ? "green" : "yellow"}>
            有效期: {expiredDays}天
          </Tag>
        </div>
      )}
    </div>
  );
}
