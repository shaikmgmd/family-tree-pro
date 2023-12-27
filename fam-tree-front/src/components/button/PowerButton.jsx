// components/PowerButton.js
import React, { useState } from 'react';
import { Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import './PowerButton.css';

const PowerButton = ({ index, onClick, text, duration, icon }) => {
  const [loading, setLoading] = useState(false);

  const enterLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onClick) onClick(index);
    }, duration);
  };

  return (
    <Button
      type="primary"
      className="billyButton"
      loading={loading}
      onClick={enterLoading}
      icon={icon}
    >
      {text}
    </Button>
  );
};

export default PowerButton;