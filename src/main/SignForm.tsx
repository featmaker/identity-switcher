import { Button, Form, SideSheet, Notification } from "@douyinfe/semi-ui";
import { useState, useRef } from "react";
import Request from "../utils/request";
import Cookie from "../utils/cookie";
import { IconSend } from "@douyinfe/semi-icons";
import type { User } from "./Index";

export const baseUrl = {
  staging: "https://staging.shiyanlou.com",
  production: "https://www.lanqiao.cn",
};

export const ssoBaseUrl = {
  staging: "https://razor.shiyanlou.com",
  production: "https://passport.lanqiao.cn",
};

export const loginApi = {
  staging: `${ssoBaseUrl.staging}/api/v1/login/`,
  production: `${ssoBaseUrl.production}/api/v1/login/`,
};

export const userApi = {
  staging: `${baseUrl.staging}/api/v2/user/`,
  production: `${baseUrl.production}/api/v2/user/`,
};

interface SubmitValues {
  env: "staging" | "production";
  login_str: string;
  password: string;
}

export default function SignForm({
  visible,
  setVisible,
  addUser,
}: {
  visible: boolean;
  setVisible: Function;
  addUser: Function;
}) {
  const [loading, setLoading] = useState(false);
  const formApi = useRef<any>();

  const handleSubmit = async (values: SubmitValues) => {
    setLoading(true);
    const { ok, message } = await Request.post(loginApi[values.env], values);

    if (ok) {
      const { ok, data } = await Request.get(userApi[values.env]);
      if (ok) {
        setLoading(false);
        setVisible(false);
        storeUserInfo(data, values.env);
      }
    } else {
      setLoading(false);
      Notification.open({
        title: "请求失败",
        content: message,
        duration: 3,
      });
    }
  };

  const storeUserInfo = async (
    userInfo: User,
    env: "production" | "staging"
  ) => {
    const cookie = await Cookie.get(baseUrl[env], "lqtoken");

    if (cookie) {
      addUser({ ...userInfo, env, lqtoken: cookie });
    }
  };

  const handleCancel = () => {
    formApi.current.reset();
    setVisible(false);
  };

  return (
    <SideSheet
      title="登录"
      visible={visible}
      onCancel={handleCancel}
      placement="bottom"
      width="100%"
      height="100%"
    >
      <Form
        onSubmit={(values) => handleSubmit(values as SubmitValues)}
        getFormApi={(api) => (formApi.current = api)}
        style={{ width: 400, margin: `0 auto` }}
      >
        {({ formState, values, formApi }) => (
          <>
            <Form.Input
              field="login_str"
              label="邮箱或电话号码"
              style={{ width: "100%" }}
              placeholder="请输入邮箱或电话号码"
              rules={[{ required: true, message: "请输入邮箱或电话号码" }]}
            ></Form.Input>
            <Form.Input
              field="password"
              label="密码"
              type="password"
              style={{ width: "100%" }}
              placeholder="请输入密码"
              rules={[{ required: true, message: "请输入密码" }]}
            ></Form.Input>
            <Form.Select
              label="环境选择"
              field="env"
              initValue="staging"
              style={{ width: "100%" }}
            >
              <Form.Select.Option value="staging">
                测试环境(Staging)
              </Form.Select.Option>
              <Form.Select.Option value="production">
                生产环境(Production)
              </Form.Select.Option>
            </Form.Select>
            <div className="flex justify-center" style={{ marginTop: 25 }}>
              <Button
                htmlType="submit"
                type="primary"
                icon={<IconSend />}
                loading={loading}
              >
                登录{loading ? "中..." : ""}
              </Button>
            </div>
          </>
        )}
      </Form>
    </SideSheet>
  );
}
