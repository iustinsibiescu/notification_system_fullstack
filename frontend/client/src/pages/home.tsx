import { useQuery, useMutation } from '@tanstack/react-query';
import { api, type Task, type Notification } from '@/lib/api';
import { useTaskStore } from '@/stores/taskStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useUserStore } from '@/stores/userStore';
import { TaskTable } from '@/components/tasks/TaskTable';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { UserSelector } from '@/components/users/UserSelector';
import { Layout, Typography, Space } from 'antd';
import { useEffect } from 'react';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Home() {
  const { currentUser } = useUserStore();
  const { tasks, setTasks, addTask } = useTaskStore();
  const { notifications, setNotifications, markAllAsRead } = useNotificationStore();

  const { data: tasksData } = useQuery<Task[]>({
    queryKey: ["/tasks", currentUser?.email] as const,
    queryFn: async () => {
      if (!currentUser?.email) {
        throw new Error("No user is logged in");
      }
  
      const response = await api.tasks.list(currentUser.email);
      return response.json();
    },
    enabled: !!currentUser?.email,
    refetchInterval: 1000,
  });

  const { data: notificationsData } = useQuery<Notification[]>({
    queryKey: ["/notifications", currentUser?.email],
    queryFn: async () => {
      if (!currentUser?.email) {
        throw new Error("No user is logged in");
      }

      const response = await api.notifications.list(currentUser.email);
      return response.json();
    },
    enabled: !!currentUser?.email,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData);
    }
  }, [tasksData, setTasks]);

  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData);
    }
  }, [notificationsData, setNotifications]);

  const createTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!currentUser?.email) {
        throw new Error("No user is logged in");
      }
  
      const response = await api.tasks.create(title, currentUser.email);
      const responseData = await response.json();
      return responseData as Task;
    },
    onSuccess: (data) => {
      addTask(data);
    },
    onError: (error: Error) => {
      console.error(`Failed to create task: ${error.message}`);
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser?.email) {
        throw new Error("No user is logged in");
      }
  
      return api.notifications.markAllRead(currentUser.email);
    },
    onSuccess: () => {
      markAllAsRead();
    },
    onError: (error: Error) => {
      console.error(`Failed to mark notifications as read: ${error.message}`);
    },
  });

  if (!currentUser) {
    return <UserSelector />;
  }

  return (
    <Layout>
      <Content className="layout-container">
        <div className="header-content">
          <Title level={2}>{currentUser.email}'s tasks</Title>
          <Space size="middle">
            <NotificationDropdown
              notifications={notifications}
              tasks={tasks}
              onMarkAllRead={() => markReadMutation.mutate()}
            />
            <CreateTaskDialog
              onSubmit={(title) => createTaskMutation.mutate(title)}
            />
          </Space>
        </div>

        <TaskTable tasks={tasks} />
      </Content>
    </Layout>
  );
}