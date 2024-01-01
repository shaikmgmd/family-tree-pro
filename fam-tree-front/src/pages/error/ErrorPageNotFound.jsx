import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams, useNavigate, Link} from "react-router-dom";
import {confirmRelationshipAction} from "../../store/features/slices/tree";

const ErrorPageNotFound = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {confirmationCode} = useParams();
    const confirmationPayload = useSelector((state) => state.tree.relationConfirmation.payload);
    const userData = JSON.parse(localStorage.getItem('userData'));
    const navigationsConnected = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256">
                <path
                    d="M198.1,62.6a76,76,0,0,0-140.2,0A72.27,72.27,0,0,0,16,127.8C15.89,166.62,47.36,199,86.14,200A71.68,71.68,0,0,0,120,192.49V232a8,8,0,0,0,16,0V192.49A71.45,71.45,0,0,0,168,200l1.86,0c38.78-1,70.25-33.36,70.14-72.18A72.26,72.26,0,0,0,198.1,62.6ZM169.45,184a55.61,55.61,0,0,1-32.52-9.4q-.47-.3-.93-.57V132.94l43.58-21.78a8,8,0,1,0-7.16-14.32L136,115.06V88a8,8,0,0,0-16,0v51.06L83.58,120.84a8,8,0,1,0-7.16,14.32L120,156.94V174q-.47.27-.93.57A55.7,55.7,0,0,1,86.55,184a56,56,0,0,1-22-106.86,15.9,15.9,0,0,0,8.05-8.33,60,60,0,0,1,110.7,0,15.9,15.9,0,0,0,8.05,8.33,56,56,0,0,1-22,106.86Z"></path>
            </svg>,
            title: "Mon arbre généalogique",
            desc: "Plongez dans l'histoire de votre famille et découvrez vos racines et votre héritage.",
            href: "/family-tree"
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256">
                <path
                    d="M216,48H40A16,16,0,0,0,24,64V224a15.84,15.84,0,0,0,9.25,14.5A16.05,16.05,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78.69.69,0,0,0,.13-.11L82.5,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H82.5a16,16,0,0,0-10.3,3.75l-.12.11L40,224V64H216Z"></path>
            </svg>,
            title: "Discussions",
            desc: "Échangez des histoires, partagez des expériences et connectez-vous avec d'autres membres de la communauté.",
            href: "/chat-list"
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256">
                <path
                    d="M144,80a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H152A8,8,0,0,1,144,80Zm104,40H152a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Zm0,48H176a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16Zm-96.25,22a8,8,0,0,1-5.76,9.74,7.55,7.55,0,0,1-2,.26,8,8,0,0,1-7.75-6c-6.16-23.94-30.34-42-56.25-42s-50.09,18.05-56.25,42a8,8,0,0,1-15.5-4c5.59-21.71,21.84-39.29,42.46-48a48,48,0,1,1,58.58,0C129.91,150.71,146.16,168.29,151.75,190ZM80,136a32,32,0,1,0-32-32A32,32,0,0,0,80,136Z"></path>
            </svg>,
            title: "Utilisateurs",
            desc: "Rencontrez et interagissez avec des utilisateurs partageant les mêmes idées et élargissez votre réseau familial.",
            href: "/user/all-except-current"
        },
    ];

    const navigationsDeconnected = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256">
                <path
                    d="M141.66,133.66l-40,40a8,8,0,0,1-11.32-11.32L116.69,136H24a8,8,0,0,1,0-16h92.69L90.34,93.66a8,8,0,0,1,11.32-11.32l40,40A8,8,0,0,1,141.66,133.66ZM192,32H136a8,8,0,0,0,0,16h56V208H136a8,8,0,0,0,0,16h56a16,16,0,0,0,16-16V48A16,16,0,0,0,192,32Z"></path>
            </svg>,
            title: "Connexion",
            desc: "Accédez à votre espace personnel et retrouvez vos informations en un clic.",
            href: "/login"
        }
    ];

    return (
        <>
            <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
                <div className="max-w-lg mx-auto text-gray-600">
                    <div className="space-y-3 text-center">
                        <h3 className="text-indigo-600 font-semibold" style={{color: "#4CC425"}}>
                            Erreur 404
                        </h3>
                        <p className="text-gray-800 text-2xl font-semibold sm:text-3xl">
                            Page non trouvée
                        </p>
                        <p className="text-sm">
                            Désolé, la page que vous recherchez est introuvable ou a été supprimée.
                        </p>
                    </div>
                    <div className="mt-12">
                        <ul className="divide-y">
                            {(userData ? navigationsConnected : navigationsDeconnected).map((item, idx) => (
                                <li key={idx} className="flex gap-x-4 py-6">
                                    <div style={{backgroundColor: "#4CC425"}}
                                         className="flex-none w-14 h-14 rounded-full text-white flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-gray-800 font-medium">{item.title}</h4>
                                        <p>{item.desc}</p>
                                        <Link to={item.href} style={{color: "#4CC425"}}
                                              className="text-sm text-indigo-600 duration-150 hover:text-indigo-400 font-medium inline-flex items-center gap-x-1">
                                            En savoir plus
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                 fill="#4CC425" className="w-5 h-5">
                                                <path fillRule="evenodd"
                                                      d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ErrorPageNotFound;
