import { Button, Form, Space } from "@douyinfe/semi-ui";
import React, { useEffect, useRef, useState } from "react";
import DetectList from "./component/DetectList";
import { DetectRecord } from "./interfaces/index";
import { v4 as uuidv4 } from "uuid";
import { IconPlus, IconSync, IconTick } from "@douyinfe/semi-icons";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";

function App() {
  const [records, setRecords] = useState<DetectRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeRecord, setActiveRecord] = useState<DetectRecord | null>(null);
  const [success, setSuccess] = useState(false);

  const formApi = useRef<FormApi>();

  const syncWithBackground = (records: DetectRecord[]) => {
    if (records.length) {
      chrome.runtime?.sendMessage({
        key: "syncRecords",
        records,
      });
      setSuccess(true);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    }
  }, [success]);

  useEffect(() => {
    if (activeRecord) {
      setShowForm(true);
      setTimeout(() => {
        formApi.current?.setValues(activeRecord);
      }, 0);
    }
  }, [activeRecord]);

  useEffect(() => {
    chrome.storage?.sync.get("detectRecords", ({ detectRecords }) => {
      if (detectRecords) {
        const parsed = JSON.parse(detectRecords);
        setRecords(parsed);
      }
    });
  }, []);

  useEffect(() => {
    if (!showForm) {
      formApi.current?.reset();
      setActiveRecord(null);
    }
  }, [showForm]);

  useEffect(() => {
    chrome.storage?.sync.set({ detectRecords: JSON.stringify(records) });
    syncWithBackground(records);
  }, [records]);

  const handleSubmit = (values: Record<string, any>) => {
    if (activeRecord) {
      setRecords(
        records.map((r) =>
          r.key === activeRecord.key ? (values as DetectRecord) : r
        )
      );
    } else {
      setRecords([...records, { key: uuidv4(), ...(values as DetectRecord) }]);
    }
    setShowForm(false);
  };

  const domainValidator = (_rules: any, value: string) =>
    /^https?:\/\/.+/.test(value);

  return (
    <div className="App">
      <DetectList
        records={records}
        setRecords={setRecords}
        setActiveRecord={setActiveRecord}
      />

      {showForm ? (
        <Form
          getFormApi={(api) => (formApi.current = api)}
          style={{ width: "100%" }}
          onSubmit={(values) => handleSubmit(values)}
        >
          <Form.Input
            field="detectDomain"
            label="检测域名"
            trigger="blur"
            rules={[
              { required: true, message: "请输入检测域名" },
              {
                validator: domainValidator,
                message: "域名格式不正确",
              },
            ]}
          />
          <Form.Input
            field="targetDomain"
            label="目标域名"
            trigger="blur"
            rules={[
              { required: true, message: "请输入目标域名" },
              {
                validator: domainValidator,
                message: "域名格式不正确",
              },
            ]}
          />
          <Form.Input
            field="cookie"
            label="Cookie"
            trigger="blur"
            rules={[{ required: true, message: "请输入 Cookie 名" }]}
          />
          <div style={{ margin: "20px 0" }}>
            <Button
              type="danger"
              style={{ marginRight: 15 }}
              onClick={() => setShowForm(false)}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </Form>
      ) : (
        <div style={{ margin: "20px 0" }}>
          <Space>
            <Button icon={<IconPlus />} onClick={() => setShowForm(true)}>
              添加记录
            </Button>
            <Button
              icon={<IconSync />}
              onClick={() => syncWithBackground(records)}
            >
              同步 Cookie
            </Button>
            {success && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 12,
                  color: "#08bf91",
                }}
              >
                <IconTick size="small" />
                &nbsp; 已同步
              </span>
            )}
          </Space>
        </div>
      )}
    </div>
  );
}

export default App;
