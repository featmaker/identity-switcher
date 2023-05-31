import React, { useEffect, useState } from "react";
import UserCard from "./UserCard/Index";
import { Button, CardGroup, Select, Empty } from "@douyinfe/semi-ui";
import { IconUserAdd } from "@douyinfe/semi-icons";
import { IllustrationNoContent } from "@douyinfe/semi-illustrations";
import SignForm from "./SignForm";
import { baseUrl } from "./SignForm";
import Storage from "../utils/storage";
import "./index.scss";
import Cookie from "../utils/cookie";

const USERS = "users";
const LQTOKEN = "lqtoken";

export interface ICookie {
  expirationDate: number;
  name: string;
  value: string;
  domain: string;
  hostOnly?: boolean;
  path?: string;
}
export interface User {
  lqtoken?: ICookie;
  env?: "staging" | "production";
  id: number;
  name: string;
  avatar_url: string;
}

function App() {
  const [signFormVisible, setSignFormVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [users, setUsers] = useState<User[]>([]);
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);

  const addUser = (user: User) => {
    const newUsers = [...users, user];
    setUsers(newUsers);
    setSelectedIndex(newUsers.length - 1);
  };

  const removeUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const initSelectedIndex = async (users: User[]) => {
    const storedLqtoken = await Storage.get(LQTOKEN);
    if (storedLqtoken) {
      setSelectedIndex(
        users.findIndex(
          (user) => user.lqtoken?.value === storedLqtoken[LQTOKEN].value
        )
      );
    }
  };

  useEffect(() => {
    console.log("restoreUsers");

    const restoreUsers = async () => {
      const storedUsers = await Storage.get(USERS);
      if (storedUsers && storedUsers[USERS].length) {
        setUsers(storedUsers[USERS]);
        initSelectedIndex(storedUsers[USERS]);
      }
    };
    restoreUsers();
  }, []);

  useEffect(() => {
    console.log("store users", users);

    Storage.set(USERS, users);
    setDisplayUsers(users);
  }, [users]);

  useEffect(() => {
    console.log("selectedIndex", selectedIndex);
    console.log("users", users);

    if (users.length && selectedIndex > -1) {
      if (users[selectedIndex]) {
        const user = users[selectedIndex];
        const lqtoken = users[selectedIndex].lqtoken as ICookie;

        if (lqtoken) {
          Storage.set(LQTOKEN, lqtoken);

          // 同步 cookie 到目标环境
          Cookie.syncToTarget({
            name: lqtoken.name,
            value: lqtoken.value,
            path: lqtoken.path,
            domain: lqtoken.domain,
            expirationDate: lqtoken.expirationDate,
            url: baseUrl[user.env!],
          });

          // 测试环境自动同步本地
          if (user.env === "staging") {
            // 同步到本地
            Cookie.syncToTarget({
              name: lqtoken.name,
              value: lqtoken.value,
              domain: "localhost",
              url: "http://localhost",
              expirationDate: lqtoken.expirationDate,
            });
          }
        }
      }
    }
  }, [selectedIndex, users]);

  const onSelectChange = (env: any) => {
    if (env === "all") {
      setDisplayUsers(users);
    } else {
      setDisplayUsers(users.filter((user) => user.env === env));
    }
  };

  return (
    <>
      {users.length ? (
        <Select
          defaultValue="all"
          style={{ width: 200, marginBottom: 20 }}
          onChange={onSelectChange}
        >
          <Select.Option value="all">全部(All)</Select.Option>
          <Select.Option value="staging">测试环境(Staging)</Select.Option>
          <Select.Option value="production">生产环境(Production)</Select.Option>
        </Select>
      ) : null}
      {displayUsers.length ? (
        <div className="user-list">
          <CardGroup spacing={20}>
            {displayUsers.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                index={index}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                removeUser={removeUser}
              />
            ))}
          </CardGroup>
        </div>
      ) : (
        <Empty
          image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
          title="暂无用户"
          description="点击下方登录按钮添加用户"
        ></Empty>
      )}
      <div className="operate-btns">
        <Button
          theme="solid"
          type="primary"
          icon={<IconUserAdd />}
          onClick={() => setSignFormVisible(true)}
        >
          登录用户
        </Button>
      </div>
      <SignForm
        visible={signFormVisible}
        setVisible={setSignFormVisible}
        addUser={addUser}
      />
    </>
  );
}

export default App;
