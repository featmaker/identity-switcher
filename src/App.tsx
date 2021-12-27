import { Button } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import "./App.css";
import DetectList from "./component/DetectList";
import { DetectRecord } from "./interfaces/index";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [records, setRecords] = useState<DetectRecord[]>([]);
  // const [loading, setLoading] = useState(true);

  const addRecord = () => {
    setRecords([
      {
        key: uuidv4(),
        detectDomain: "https://staging.shiyanlou.com",
        targetDomain: "localhost",
        cookie: "lqtoken",
      },
    ]);
  };

  const syncWithBackground = (records: DetectRecord[]) => {
    chrome.runtime.sendMessage({
      key: "syncRecords",
      records,
    });
  };

  useEffect(() => {
    chrome.storage.sync.get("detectRecords", ({ detectRecords }) => {
      if (detectRecords) {
        const parsed = JSON.parse(detectRecords);
        setRecords(parsed);
        syncWithBackground(parsed);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ detectRecords: JSON.stringify(records) });
    syncWithBackground(records);
  }, [records]);

  return (
    <div className="App">
      <DetectList records={records} setRecords={setRecords} />
      <div style={{ marginTop: 20 }}>
        <Button onClick={addRecord}>添加记录</Button>
      </div>
    </div>
  );
}

export default App;
