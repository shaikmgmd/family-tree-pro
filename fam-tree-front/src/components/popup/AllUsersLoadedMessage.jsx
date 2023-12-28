import React from "react";
import "./AllUsersLoadedMessage.css";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";

export const AllUsersLoadedMessage = () => {
    return (
        <Result
            title="Tous les utilisateurs ont été chargés avec succès !"
            icon={<SmileOutlined/>}
            style={{fontSize: "30px"}}
        />
    );
}
export default AllUsersLoadedMessage;