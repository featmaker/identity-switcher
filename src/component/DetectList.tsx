import React from "react";
import { Table, Button, Space, Typography } from "@douyinfe/semi-ui";
import { DetectRecord } from "../interfaces/index";
import { ColumnProps } from "@douyinfe/semi-ui/lib/es/table";
const { Text } = Typography;

interface Props {
  records: DetectRecord[];
  setRecords: any;
  setActiveRecord: (r: DetectRecord) => any;
}

function DetectList({ records, setRecords, setActiveRecord }: Props) {
  const removeRecord = ({ key }: DetectRecord) => {
    setRecords(records.filter((r) => r.key !== key));
  };

  const columns: ColumnProps[] = [
    {
      title: "检测域名",
      width: 150,
      dataIndex: "detectDomain",
      render: (text) => {
        return (
          <Text ellipsis={{ showTooltip: true }} style={{ width: "150px" }}>
            {text}
          </Text>
        );
      },
    },
    {
      title: "目标域名",
      width: 150,
      dataIndex: "targetDomain",
      render: (text) => {
        return (
          <Text ellipsis={{ showTooltip: true }} style={{ width: "150px" }}>
            {text}
          </Text>
        );
      },
    },
    {
      title: "Cookie",
      dataIndex: "cookie",
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Space>
            <Button
              type="danger"
              theme="solid"
              size="small"
              onClick={() => removeRecord(record)}
            >
              移除
            </Button>
            <Button
              type="primary"
              theme="solid"
              size="small"
              onClick={() => setActiveRecord(record)}
            >
              编辑
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Table bordered columns={columns} dataSource={records} pagination={false} />
  );
}

export default DetectList;
