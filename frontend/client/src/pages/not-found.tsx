import { Result, Button } from 'antd';
import { useLocation } from 'wouter';

export default function NotFound() {
  const [_, setLocation] = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => setLocation('/')}>
            Back Home
          </Button>
        }
      />
    </div>
  );
}