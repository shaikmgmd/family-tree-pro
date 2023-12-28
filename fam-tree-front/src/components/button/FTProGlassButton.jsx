import React, {useState} from 'react';
import {Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import './PowerButton.css';

const FTProGlassButton = ({
                         content = "",
                         noMarginTop = false,
                         isDanger = false,
                         icon = (<></>),
                         className,
                         ...props
                     }) => {

    return (
        <button type="button" htmlType="button"
                className="px-3.5 py-1.5 font-medium bg-green-100 hover:bg-green-200 hover:text-green-ftpro-h text-green-ftpro rounded-md text-sm" {...props}
        >
            <div className="whitespace-nowrap"><p>{icon} {content}</p></div>
        </button>
    );
};

export default FTProGlassButton;