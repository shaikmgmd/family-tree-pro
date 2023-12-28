import React, {useEffect, useState} from "react";
import {Divider} from "antd";

export const MainWrapper = ({ title = "", description = "", children, buttonComponent }) => {
    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <h2 className="text-sm">{description}</h2>
                </div>
                {buttonComponent && <div>{buttonComponent}</div>}
            </div>
            <Divider/>
            {children}
        </div>
    );
}

