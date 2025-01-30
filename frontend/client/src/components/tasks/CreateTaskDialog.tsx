import { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface CreateTaskDialogProps {
  onSubmit: (title: string) => void;
}

export function CreateTaskDialog({ onSubmit }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.title);
      form.resetFields();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
        New Task
      </Button>
      <Modal
        title="Create New Task"
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText="Create Task"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please enter a task title' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}