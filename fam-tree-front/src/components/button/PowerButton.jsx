// components/LoadingButton.js
import React, { useState } from 'react';
import { Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';

const LoadingButton = ({ index }) => {
  const [loading, setLoading] = useState(false);

  const enterLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Button
      type="primary"
      icon={<PoweroffOutlined />}
      loading={loading}
      onClick={enterLoading}
    >
      Click me!
    </Button>
  );
};

export default LoadingButton;
