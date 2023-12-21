import React, {useEffect, useState} from "react";
import {Divider} from "antd";

export const MainWrapper = ({title = "", description = "", children} ) => {
    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <h2 className="text-sm">{description}</h2>
            <Divider/>
            {children}
        </div>
    );
}
