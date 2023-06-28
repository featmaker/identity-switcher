import React, { useEffect, useState } from "react";
import UserCard from "./UserCard/Index";
import { Button, Empty, Tabs, TabPane, Spin } from "@douyinfe/semi-ui";
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
  httpOnly?: boolean;
  sameSite: "strict" | "lax" | "none";
  secure: boolean;
  session: boolean;
  storeId: string;
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
  const [loading, setLoading] = useState(true);

  const [stagingUsers, setStagingUsers] = useState<User[]>([]);
  const [productionUsers, setProductionUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("staging");

  const addUser = (user: User) => {
    const newUsers = [...users, user];
    setUsers(newUsers);
    setSelectedToken(user.lqtoken!.value);
  };

  const removeUser = (token: string) => {
    setUsers(users.filter((u) => u.lqtoken.value !== token));
  };

  const initSelectedToken = async () => {
    const storedLqtoken = await Storage.get(LQTOKEN);

    if (storedLqtoken) {
      setSelectedToken(storedLqtoken[LQTOKEN].value);
    }
  };

  useEffect(() => {
    setLoading(true);

    const restoreUsers = async () => {
      const storedUsers = await Storage.get(USERS);
      if (storedUsers && storedUsers[USERS]?.length) {
        setUsers(storedUsers[USERS]);
        initSelectedToken();
      }
    };
    restoreUsers();
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, []);

  useEffect(() => {
    Storage.set(USERS, users);
    setStagingUsers(users.filter((user) => user.env === "staging"));
    setProductionUsers(users.filter((user) => user.env === "production"));
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

        // 清除缓存的用户信息
        Cookie.remove(baseUrl[user.env!], "auth_user_basic");
        Cookie.remove(baseUrl[user.env!], "auth_updated_at");

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

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <>
      {users.length ? (
        <Tabs
          className="align-center"
          activeKey={activeTab}
          onChange={onTabChange}
        >
          <TabPane tab={<span>测试环境</span>} itemKey="staging">
            <div className="user-list" style={{ display: "flex" }}>
              {loading ? (
                <div style={{ width: "100%" }}>
                  <Spin
                    tip="加载中..."
                    style={{ width: "100%", height: "100px" }}
                  />
                </div>
              ) : stagingUsers.length ? (
                stagingUsers.map((user, index) => (
                  <UserCard
                    key={user.lqtoken.value}
                    user={user}
                    selectedToken={selectedToken}
                    setSelectedToken={setSelectedToken}
                    removeUser={removeUser}
                  />
                ))
              ) : (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <Empty
                    image={
                      <IllustrationNoContent
                        style={{ width: 150, height: 150 }}
                      />
                    }
                    title="暂无用户"
                    description="点击下方登录按钮添加用户"
                  ></Empty>
                </div>
              )}
            </div>
          </TabPane>
          <TabPane tab={<span>生产环境</span>} itemKey="production">
            <div className="user-list">
              {productionUsers.length ? (
                productionUsers.map((user, index) => (
                  <UserCard
                    key={user.lqtoken.value}
                    user={user}
                    selectedToken={selectedToken}
                    setSelectedToken={setSelectedToken}
                    removeUser={removeUser}
                  />
                ))
              ) : (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <Empty
                    image={
                      <IllustrationNoContent
                        style={{ width: 150, height: 150 }}
                      />
                    }
                    title="暂无用户"
                    description="点击下方登录按钮添加用户"
                  ></Empty>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      ) : (
        !loading && (
          <Empty
            image={
              <IllustrationNoContent style={{ width: 150, height: 150 }} />
            }
            title="暂无用户"
            description="点击下方登录按钮添加用户"
            style={{ marginBottom: 20, marginTop: 40 }}
          ></Empty>
        )
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setVisible={setSignFormVisible}
        addUser={addUser}
      />
    </>
  );
}

export default App;
