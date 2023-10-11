import React from 'react';
import {Button} from "@mui/material";
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-2">Arbre Généalogique</h1>
                <h2 className="text-2xl font-semibold">Pro++</h2>
                <p className="text-xl mt-4">2023-2024</p>
            </div>

            <Button
                variant="contained"
                color="primary"
                className="text-white"
            >
                <Link to={'/adhesion/apply'}>Faire une demande d'adhésion</Link>
            </Button>
        </div>
    );
}

export default Home;
