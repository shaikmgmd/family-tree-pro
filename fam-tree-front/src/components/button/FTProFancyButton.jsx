import React, {useState} from 'react';
import {Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import './PowerButton.css';

const FTProFancyButton = ({
                              content = "",
                              isDanger = false,
                              icon = (<></>),
                              className,
                              ...props
                          }) => {

        return (
            <button type="button" {...props}
                    className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium rounded-lg shadow-2xl text-white bg-ftpro-green hover:bg-ftpro-green-h cursor-pointer">
                <span
                    className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 rounded-full blur-md ease bg-green-500"></span>
                <span
                    className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">        <span
                    className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-green-600 rounded-full blur-md"></span>        <span
                    className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-green-700 rounded-full blur-md"></span>      </span>
                <span className="relative"><div className="whitespace-nowrap"><p>{icon} {content}</p></div></span>
            </button>
        );

    }
;

export default FTProFancyButton;