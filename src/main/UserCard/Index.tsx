import { Avatar, Tag } from "@douyinfe/semi-ui";
import { IconTickCircle, IconClear } from "@douyinfe/semi-icons";

import "./index.scss";
import type { User } from "../Index";

export default function UserCard({
  user,
  index,
  selectedIndex,
  setSelectedIndex,
  removeUser,
}: {
  index: number;
  user: User;
  selectedIndex: number;
  setSelectedIndex: Function;
  removeUser: Function;
}) {
  const handleDelete = (e: any) => {
    e.preventDefault();
    removeUser(index);
  };

  const isSelected = index === selectedIndex;

  return (
    <div
      className={["user-card", isSelected ? "selected" : ""].join(" ")}
      onClick={() => setSelectedIndex(index)}
    >
      <Tag className={["env-label", user.env].join(" ")}>{user.env}</Tag>
      <IconClear className="btn-x" onClick={handleDelete} />
      <div className="avatar-wrap flex flex-col">
        <Avatar size="large" style={{ margin: 4 }} alt="User">
          <img src={user.avatar_url} alt={user.name} />
        </Avatar>
        <span className="user-name" title={user.name}>
          {user.name}
        </span>
      </div>
      {isSelected && (
        <div className="emoji-wrap text-align">
          <IconTickCircle className="selected-emoji" size="large" />
        </div>
      )}
    </div>
  );
}
