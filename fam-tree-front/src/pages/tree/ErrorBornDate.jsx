import React from "react";
import {Button} from "antd";
import ErrorBornDateButton from "../../components/button/ErrorBornDateButton";
import '../../components/button/PowerButton.css';

const ErrorBornDate = ({onHide}) => (
    <div className="conteneur">
        <ErrorBornDateButton/>
        <Button type="primary" key="console" className="billyButton okButton" onClick={onHide}>
            Ok
        </Button>
    </div>
);

export default ErrorBornDate;
