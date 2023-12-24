// components/PowerButton.js
import React, { useState } from 'react';
import { Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import './PowerButton.css';

const PowerButton = ({ index, onClick }) => {
  const [loading, setLoading] = useState(false);

  const enterLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onClick) onClick(index);
    }, 1000);
  };

  return (
    <Button
      type="primary"
      className="billyButton"
      icon={<PoweroffOutlined />}
      loading={loading}
      onClick={enterLoading}
    >
      My Tree :)
    </Button>
  );
};

export default PowerButton;