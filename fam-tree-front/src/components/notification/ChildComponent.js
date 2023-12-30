import React, {useState} from "react";
import {useSubscription} from "react-stomp-hooks";
import {Store} from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.compat.css';

const ChildComponent = () => {
    const [message, setMessage] = useState("");

    useSubscription('/topic/notifications', (message) => {
        const newMessage = message.body;
        setMessage(newMessage);

        // Afficher la notification
        Store.addNotification({
            title: "Nouveau message !",
            message: newMessage,
            type: "success",
            insert: "top",
            container: "top-full", // Emplacement de la notification
            animationIn: ["animate__animated", "animate__fadeIn"], // Classe pour l'animation d'entrée
            animationOut: ["animate__animated", "animate__fadeOut"], // Classe pour l'animation de sortie
            dismiss: {
                duration: 4000,
                onScreen: true
            },
            touchSlidingExit: {
                swipe: {
                    duration: 400,
                    timingFunction: 'ease-out',
                    delay: 0,
                },
                fade: {
                    duration: 400,
                    timingFunction: 'ease-out',
                    delay: 0
                }
            }
        });
    });

    return (
        <>
        </>
    )
}

export default ChildComponent;
