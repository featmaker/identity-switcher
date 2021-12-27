import React from "react";
import { Table, Button } from "@douyinfe/semi-ui";
import { DetectRecord } from "../interfaces/index";

interface Column {
  title: string;
  dataIndex: string;
  render?: (text: any, record: any, index: any) => JSX.Element;
}

interface Props {
  records: DetectRecord[];
  setRecords: any;
}

function DetectList({ records, setRecords }: Props) {
  const removeRecord = ({ key }: DetectRecord) => {
    setRecords(records.filter((r) => r.key !== key));
  };

  const columns: Column[] = [
    {
      title: "检测域名",
      dataIndex: "detectDomain",
    },
    {
      title: "目标域名",
      dataIndex: "targetDomain",
    },
    {
      title: "Cookie",
      dataIndex: 'cookie',
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Button
            type="primary"
            theme="solid"
            size="small"
            onClick={() => removeRecord(record)}
          >
            移除
          </Button>
        );
      },
    },
  ];

  return (
    <Table bordered columns={columns} dataSource={records} pagination={false} />
  );
}

export default DetectList;
