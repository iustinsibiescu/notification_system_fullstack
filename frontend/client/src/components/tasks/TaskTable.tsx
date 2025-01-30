import { Task } from '@/lib/api';
import { Table, Tag } from 'antd';
import { format, isValid } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';

interface TaskTableProps {
  tasks: Task[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isValid(date) ? format(date, 'MMM d, yyyy HH:mm:ss') : 'Invalid date';
  };

  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const columns: ColumnsType<Task> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'warning'}>
          {status === 'completed' ? 'completed' : 'started running'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '25%',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: '25%',
      render: (date: string) => formatDate(date),
    },
  ];

  return <Table columns={columns} dataSource={sortedTasks} rowKey="id" />;
}