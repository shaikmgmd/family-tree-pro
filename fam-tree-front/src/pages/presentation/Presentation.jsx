import React from 'react';
import {Divider} from "antd";
import { ReactComponent as LoginIcon } from '../../assets/ui/svg/login/login-page-3.svg';
import { ReactComponent as LoginIconBis } from '../../assets/ui/svg/login/login-page-2.svg';
import { ReactComponent as LoginIconBisBis } from '../../assets/ui/svg/login/login-page.svg';

const Presentation = () => {
    return (
        <div className="flex flex-col h-auto p-10 bg-gray-100 overflow-y-scroll">
            <div className="text-center mb-5">
                <h1 className="text-4xl font-bold mb-2">Arbre Généalogique</h1>
                <h2 className="text-2xl font-semibold">Pro++</h2>
                <p className="text-xl mt-4">2023-2024</p>
            </div>
            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Section 1 */}
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3">Titre section 1</h3>
                    <p className="text-lg">Description ou contenu relatif à la section 1.</p>
                </div>
                <div className="flex justify-center items-center">
                    <LoginIcon />
                </div>

                {/* Section 2 */}
                <div className="flex justify-center items-center order-last md:order-none">
                    <LoginIconBis />
                </div>
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3">Titre section 2</h3>
                    <p className="text-lg">Description ou contenu relatif à la section 2.</p>
                </div>

                {/* Section 1 */}
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3">Titre section 3</h3>
                    <p className="text-lg">Description ou contenu relatif à la section 3.</p>
                </div>
                <div className="flex justify-center items-center">
                    <LoginIconBisBis />
                </div>

                {/* Répétez le motif ci-dessus pour autant de sections que nécessaire */}
            </div>
        </div>
    );
}

export default Presentation;
