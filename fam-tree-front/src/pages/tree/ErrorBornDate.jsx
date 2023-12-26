// src/components/ErrorBornDate/ErrorBornDate.jsx
import React from "react";
import { Result, Button } from "antd";
import ErrorBornDateButton from "../../components/button/ErrorBornDateButton"; // Assurez-vous que le chemin est correct
import '../../components/button/PowerButton.css';
const ErrorBornDate = ( {onHide}) => (
    <Result
        status="500"
        title="Vos données sont incohérentes"
            subTitle="Assurez vous de résoudre les erreurs listées ci-dessous"
        extra={[
            <Button type="primary" key="console" className="billyButton" onClick={onHide}>
                FTPro
            </Button>,
        ]}
    >
        <ErrorBornDateButton />
    </Result>
);

export default ErrorBornDate;
