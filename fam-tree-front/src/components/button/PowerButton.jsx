// components/PowerButton.js
import React, { useState } from 'react';
import { Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import './PowerButton.css';

const PowerButton = ({ index, onClick, text = "Voir l'arbre" }) => {
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
      loading={loading}
      onClick={enterLoading}
    >
      {text}
    </Button>
  );
};

export default PowerButton;