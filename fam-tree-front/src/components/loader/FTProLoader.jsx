import React from 'react';
import { Circles } from "react-loader-spinner";

export const FTProLoader = () => (
    <div className="flex flex-col justify-center items-center mt-52">
        <Circles
            height="80"
            width="80"
            color="#0000FF"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
        <div className="text-center mt-4">
            <p className="text-xl font-bold">Family Tree Pro ++</p>
            <p>Loading...</p>
        </div>
    </div>
);
