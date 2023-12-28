import React from "react";
import { Button } from "antd";
import ErrorBornDateButton from "../../components/button/ErrorBornDateButton";
import '../../components/button/PowerButton.css';

const ErrorBornDate = ({ onHide }) => (
    <div className="conteneur">
    <Result
        status="error"
        title="Vos données sont incohérentes"
            subTitle="Assurez vous de résoudre les erreurs listées ci-dessous"
        extra={[
            <Button type="primary" key="console" className="billyButton" onClick={onHide}>
                FTPro
            </Button>,
        ]}
    >
        <ErrorBornDateButton />
        <Button type="primary" key="console" className="billyButton okButton" onClick={onHide}>
            Ok
        </Button>
    </div>
);

export default ErrorBornDate;
