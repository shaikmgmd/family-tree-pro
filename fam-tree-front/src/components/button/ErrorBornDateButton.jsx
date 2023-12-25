// src/components/ErrorMessage/ErrorMessage.jsx
import React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Result, Typography } from "antd";

const { Paragraph, Text } = Typography;

const ErrorBornDateButton = () => (
    <div className="desc">
        <Paragraph>
            <Text
                strong
                style={{
                    fontSize: 16,
                }}
            >
                Le contenu que vous avez soumis comporte l'erreur suivante :
            </Text>
        </Paragraph>
        <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" style={{ color: 'red' }}/> La date de naissance d'un parent doit être antérieure à la date de naissance de ses enfants.{" "}
            <a href="#">Modifier&gt;</a>
        </Paragraph>
    </div>
);

export default ErrorBornDateButton;
