import { Dropdown, Badge, Button, List, Typography, Tag, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Notification, Task } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';
import { useState, useCallback } from 'react';

interface NotificationDropdownProps {
  notifications: Notification[];
  tasks: Task[];
  onMarkAllRead: () => void;
}

export function NotificationDropdown({
  notifications,
  tasks,
  onMarkAllRead,
}: NotificationDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.is_read === false).length;

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open && dropdownOpen && unreadCount > 0) {
      onMarkAllRead();
    }
    setDropdownOpen(open);
  }, [dropdownOpen, unreadCount, onMarkAllRead]);

  const getTaskTitle = (taskId: number): string => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.title : 'Unknown Task';
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.is_read !== b.is_read) {
      return (a.is_read ? 1 : 0) -  (b.is_read ? 1 : 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const menu = {
    items: [
      {
        key: 'header',
        label: (
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
            <Typography.Text strong>Notifications</Typography.Text>
          </div>
        ),
      },
      {
        key: 'list',
        label: (
          <List
            style={{ maxHeight: '300px', overflow: 'auto', width: '400px' }}
            dataSource={sortedNotifications}
            renderItem={(notification) => {
              const taskTitle = getTaskTitle(notification.task_id);
              const isCompleted = notification.notification_type === 2;
              return (
                <List.Item 
                  style={{ 
                    padding: '12px',
                    backgroundColor: notification.is_read === false ? 'rgba(24, 144, 255, 0.1)' : 'transparent',
                    transition: 'background-color 0.3s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Space>
                      <span>{taskTitle}</span>
                      <Tag color={isCompleted ? 'success' : 'warning'}>
                        {isCompleted ? 'completed' : 'started running'}
                      </Tag>
                    </Space>
                    <Typography.Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>
                      {formatRelativeTime(notification.created_at)}
                    </Typography.Text>
                  </div>
                  {notification.is_read === false && (
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
                      <Tag color="blue">new</Tag>
                    </div>
                  )}
                </List.Item>
              );
            }}
            locale={{
              emptyText: (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <Typography.Text type="secondary">No notifications</Typography.Text>
                </div>
              )
            }}
          />
        ),
      },
    ],
  };

  return (
    <Dropdown 
      menu={menu} 
      trigger={['click']} 
      arrow 
      placement="bottomRight"
      onOpenChange={handleOpenChange}
      open={dropdownOpen}
    >
      <Badge count={unreadCount} offset={[-5, 5]}>
        <Button icon={<BellOutlined />} shape="circle" />
      </Badge>
    </Dropdown>
  );
}