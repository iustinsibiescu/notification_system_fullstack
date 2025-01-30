export interface User {
  id: number;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  status: 'running' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  task_id: number;
  is_read: boolean;
  notification_type: number;
  created_at: string;
}

export const api = {
  users: {
    list: () =>
      fetch(`/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
      create: (userEmail: string) =>
        fetch(`/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
          }),
        }),
  },
  tasks: {
    list: (userEmail: string) => 
      fetch(`/tasks?user_email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    create: (title: string, userEmail: string) =>
      fetch(`/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          user_email: userEmail,
        }),
      }),
  },
  notifications: {
    list: (userEmail: string) =>
      fetch(`/notifications?user_email=${encodeURIComponent(userEmail)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    }),
    markAllRead: (userEmail: string) =>
      fetch(`/notifications/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      }),
  },
};