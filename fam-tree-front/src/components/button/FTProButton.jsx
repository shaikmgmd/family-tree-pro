import React, {useState} from 'react';
import {Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import './PowerButton.css';

const FTProButton = ({
                         content = "",
                         noMarginTop = false,
                         isDanger = false,
                         icon = (<></>),
                         className,
                         ...props
                     }) => {

    return (
        <button type="default" htmlType="submit"
                className={`${!noMarginTop && 'mt-6'} w-full transition-all ease-in-out hover:animate-bounce text-white ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-green-ftpro hover:bg-green-ftpro-h'} transition duration-75 px-3.5 py-1.5 rounded-md ${className}`}
                {...props}
        >
            <div className="whitespace-nowrap"><p>{icon} {content}</p></div>
        </button>
    );
};

export default FTProButton;