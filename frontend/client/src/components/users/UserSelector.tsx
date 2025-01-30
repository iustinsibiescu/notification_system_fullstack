import { useState, useEffect } from 'react';
import { Select, Card, Button, Space, Typography, Form, Divider, Input } from 'antd';
import { api, User } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';

const { Title } = Typography;

export function UserSelector() {
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [createForm] = Form.useForm();
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const handleLogin = async () => {
    if (!selectedEmail) return;
    
    setLoading(true);
    try {
      const user = userList.find(u => u.email === selectedEmail);
      if (!user) throw new Error('User not found');
      setCurrentUser(user);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (values: { email: string }) => {
    setLoading(true);
    try {
      const data = await api.users.create(values.email);
      const newUser = await data.json();
      setCurrentUser(newUser);
      createForm.resetFields();
    } catch (error) {
      console.error('Create user failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUserList = async () => {
      const response = await api.users.list();
      const existingUserList = await response.json();
      setUserList(existingUserList);
    }
    
    getUserList();
  }, []);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <Card style={{ width: 400, padding: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Title level={3} style={{ margin: 0, textAlign: 'center' }}>
            Select User
          </Title>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Select
              style={{ width: '100%' }}
              placeholder="Select your email"
              onChange={setSelectedEmail}
              value={selectedEmail}
              options={userList.map(user => ({
                value: user.email,
                label: user.email,
              }))}
            />
            <Button 
              type="primary" 
              block 
              onClick={handleLogin}
              loading={loading}
              disabled={!selectedEmail}
            >
              Continue With Selected User
            </Button>
          </Space>

          <Divider>Or</Divider>

          <Form 
            form={createForm}
            onFinish={handleCreateUser}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="New User Email"
              rules={[
                { required: true, message: 'Please enter an email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Enter new user email" />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
                loading={loading}
              >
                Create & Login as New User
              </Button>
            </Form.Item>
          </Form>

        </Space>
      </Card>
    </div>
  );
}
