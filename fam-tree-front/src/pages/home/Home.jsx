import React from 'react';
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import {ReactComponent as TreeIcon} from '../../assets/ui/svg/home/tree.svg';

const Home = () => {
    return (
        <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
            <div className="text-center mb-10">
                <h1 className="text-2xl font-bold mb-0.5">Arbre Généalogique</h1>
                <h2 className="text-xl font-semibold">Pro++</h2>
                <p className="text-md mt-1">2023-2024</p>
            </div>
            <TreeIcon className="w-96 h-96"/>
            <button type="default" htmlType="submit"
                    className="mt-6 text-white bg-green-ftpro hover:bg-green-ftpro-h transition duration-75 px-3.5 py-1.5 rounded-md"
            >
                <Link to={'/adhesion/apply'}>Faire une demande d'adhésion</Link>
            </button>

        </div>
    );
}

export default Home;
