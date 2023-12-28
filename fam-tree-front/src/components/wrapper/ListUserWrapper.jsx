import React, {useEffect, useState} from "react";
import {Badge, Divider, Space, Switch} from "antd";
import SearchButton from "../button/SearchButton";
import {SwapOutlined } from "@ant-design/icons";
export const ListUserWrapper = ({ title = "", description = "", userCount, children}) => {

    const [show, setShow] = useState(true);

    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <h2 className="text-sm">{description}</h2>
                </div>
                {/*<div>
                    <Space>
                        <Switch checked={show} onChange={() => setShow(!show)} />
                        <Badge count={show ? "User : " : "X"} showZero color="#faad14" />
                        <Badge count={show ?  1 : 0} />
                        <Badge
                            count={show ? <SwapOutlined  style={{ color: "#7F00FF" }} /> : 0}
                        />
                        <Badge
                            className="site-badge-count-109"
                            count={show ? userCount : 0}
                            style={{ backgroundColor: "#52c41a" }}
                        />
                    </Space>
                </div>
                <div className="search-button">
                    <SearchButton />
                </div>*/}
            </div>
            <Divider/>
            {children}
        </div>
    )
};

