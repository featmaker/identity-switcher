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
  lqtoken: ICookie;
  env?: "staging" | "production";
  id: number;
  name: string;
  avatar_url: string;
}

function App() {
  const [signFormVisible, setSignFormVisible] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);

  const addUser = (user: User) => {
    const newUsers = [...users, user];
    setUsers(newUsers);
    setSelectedToken(user.lqtoken!.value);
  };

  const removeUser = (token: string) => {
    setUsers(users.filter((u => u.lqtoken.value !== token)));
  };

  const initSelectedToken = async () => {
    const storedLqtoken = await Storage.get(LQTOKEN);

    if (storedLqtoken) {
      setSelectedToken(storedLqtoken[LQTOKEN].value);
    }
  };

  useEffect(() => {
    const restoreUsers = async () => {
      const storedUsers = await Storage.get(USERS);
      if (storedUsers && storedUsers[USERS].length) {
        setUsers(storedUsers[USERS]);
        initSelectedToken();
      }
    };
    restoreUsers();
  }, []);

  useEffect(() => {
    Storage.set(USERS, users);
    setDisplayUsers(users);
  }, [users]);

  useEffect(() => {
    if (users.length && selectedToken) {
      const user = users.find((user) => user.lqtoken.value === selectedToken);

      if (user) {
        const lqtoken = user.lqtoken as ICookie;
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
  }, [selectedToken, users]);

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
                selectedToken={selectedToken}
                setSelectedToken={setSelectedToken}
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
