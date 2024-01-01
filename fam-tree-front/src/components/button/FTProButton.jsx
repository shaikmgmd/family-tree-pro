import React, {useState} from 'react';
import {Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import './PowerButton.css';
import {Link} from "react-router-dom";

const FTProButton = ({
                         content,
                         noMarginTop = false,
                         isDanger = false,
                         icon,
                         className = "",
                         link = false,
                         path = "",
                         isReverse = false,
                         ...props
                     }) => {
    const stringClassName = `${noMarginTop ? '' : 'mt-6'} w-full transition-all ease-in-out text-white 
        ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-green-ftpro hover:bg-green-ftpro-h'} 
        transition duration-75 px-3.5 py-1.5 rounded-md ${className}`;

    const buttonContent = isReverse ? (
        <div className={`flex items-center justify-center whitespace-nowrap ${icon && content && "space-x-3"}`}>
            <span>{content}</span>
            <span>{icon}</span></div>
    ) : (
        <div className={`flex items-center justify-center whitespace-nowrap ${icon && content && "space-x-3"}`}><span>{icon}</span>
            <span>{content}</span>
        </div>
    );

    return (
        <>
            {link ? (
                <div className={stringClassName}>
                    <Link to={path}
                          {...props} >
                        {buttonContent}
                    </Link>
                </div>
            ) : (
                <button type="default" htmlType="submit"
                        className={stringClassName}
                        {...props}
                >
                    {buttonContent}
                </button>
            )}
        </>
    );
};

export default FTProButton;
