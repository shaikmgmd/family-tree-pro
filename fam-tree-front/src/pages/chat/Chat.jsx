import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {Divider} from "antd";
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import {
    getChatMessagesAction,
    getUserChatsWithMessagesAction,
    sendChatMessageAction,
    startChatAction
} from "../../store/features/slices/chat";
import {getAllUsersExceptCurrentNoPaginationAction, getConnectedUserAction} from "../../store/features/slices/user";
import {FTProLoader} from "../../components/loader/FTProLoader";
import FTProFancyButton from "../../components/button/FTProFancyButton";
import {Paperclip, PaperPlaneRight} from "@phosphor-icons/react";

const Chat = () => {
    const [tab, setTab] = useState(null);
    const [userData, setUserData] = useState({
        username: '',
        message: ''
    });
    const [currChatUsersIds, setCurrChatUsersIds] = useState({
        userId1: 0,
        userId2: 0
    });

    const [imageURL, setImageURL] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const user = useSelector((state) => state.user.getConnectedUser);
    const dispatch = useDispatch();
    const {userChats, currentChat, chatMessages} = useSelector(state => state.chat);
    const allUsers = useSelector(state => state.user.allUsersExceptCurrentNP);


    /*    useEffect(() => {
            if (user.payload) {
                dispatch(getUserChatsWithMessagesAction(user.payload.id));
            }
        }, [user, dispatch]);*/

    useEffect(() => {
        dispatch(getConnectedUserAction());
        dispatch(getAllUsersExceptCurrentNoPaginationAction());
    }, [])

    useEffect(() => {
        if (tab && tab !== "CHATROOM") {
            dispatch(getChatMessagesAction(tab));
        }
    }, [tab, dispatch]);

    const simulateImageUpload = (pics) => {
        setIsUploading(true); // Indique que l'upload a commencé

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "ftpropp");
            data.append("cloud_name", "dfxdhqrqu");

            fetch("https://api.cloudinary.com/v1_1/dfxdhqrqu/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("data", data)
                    setImageURL(data.url.toString());
                    setUserData({...userData, message: data.url.toString()}); // Mettre à jour le message avec l'URL de l'image
                    setIsUploading(false); // Indique que l'upload est terminé
                })
                .catch((err) => {
                    console.error(err);
                    setIsUploading(false); // Indique que l'upload est terminé même en cas d'erreur

                });
        } else {
            return setIsUploading(false); // Indique que l'upload est terminé
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = await simulateImageUpload(file);
            setImageURL(imageUrl);
            setUserData({...userData, message: imageUrl});
        }
    };


    const handleMessage = (event) => {
        const {value} = event.target;
        setUserData({...userData, message: value});
    };

    const sendMessage = async () => {
        if (userData.message.trim() !== '' && tab && user.payload) {
            console.log("currusersIds", currChatUsersIds)
            const payload = {
                chatId: Number(tab),
                message: userData.message,
                senderId: Number(currChatUsersIds.userId1),
                receiverId: Number(currChatUsersIds.userId2),
            }
            await dispatch(sendChatMessageAction(payload));
            setUserData({...userData, message: ""});
            setImageURL(null);
            await dispatch(getChatMessagesAction(tab));
        }
    };

    const handleUsername = (event) => {
        const {value} = event.target;
        setUserData({...userData, username: value});
    };

    const registerUser = () => {
        if (userData.username.trim() !== '' && user.payload) {
            dispatch(getUserChatsWithMessagesAction(user.payload.id));
            // Pas besoin de définir connected ici, utilisez l'état user pour déterminer si l'utilisateur est connecté
        }
    };

    const handleUserClick = (otherUserId) => {
        // Assurez-vous que l'utilisateur est bien connecté avant de démarrer une discussion
        if (user.payload && user.payload.id) {
            const userId1 = user.payload.id;
            const userId2 = otherUserId;

            dispatch(startChatAction({userId1, userId2}))
                .then((action) => {
                    if (action.payload && action.payload.id) {
                        // Mettez à jour l'ID de la conversation actuelle (tab) et les IDs des utilisateurs de la conversation actuelle
                        setTab(action.payload.id);
                        setCurrChatUsersIds({userId1: userId1, userId2: userId2});
                    }
                });
        }
    };

    return (
        <>
            {user.payload ?
                <div className="shadow-md mx-5 mt-1 p-5 flex flex-row h-screen">
                    <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                        <div className="border-b-2 py-4 px-2">
                            <input
                                type="text"
                                placeholder="search chatting"
                                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                            />
                        </div>
                        {allUsers.payload && allUsers.payload.map((userItem, index) => (
                            <div
                                className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 ${
                                    (currChatUsersIds.userId2 === userItem.id) || (currChatUsersIds.userId1 === userItem.id) ? "bg-gray-300 border-green-ftpro" : "hover:bg-gray-200"
                                } cursor-pointer`}
                                onClick={() => handleUserClick(userItem.id)}
                                key={index}
                            >
                                <div className="w-1/4">
                                    <img
                                        src={userItem.photoPath}
                                        className="object-cover h-12 w-12 rounded-full"
                                        alt={userItem.firstName}
                                    />
                                </div>
                                <div className="w-full">
                                    <div
                                        className="text-lg font-semibold user-select-none">{userItem.firstName} {userItem.lastName}</div>
                                    {/*<span className="text-gray-500">test</span>*/}
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="w-full px-5 flex flex-col justify-between ">
                        <div className="flex flex-col mt-5 overflow-y-auto">
                            {tab && chatMessages.payload && chatMessages.payload.map((message, index) => (
                                <div key={index}
                                     className={`flex flex-col mb-4 ${message.senderName === user.payload.lastName ? "items-end" : "items-start"}`}>

                                    {/* Afficher le nom de l'expéditeur au-dessus du message */}
                                    <div className="text-sm text-gray-600 mb-1">
                                        {message.senderName}
                                    </div>

                                    {/* Structure flex pour le message et l'image */}
                                    <div
                                        className={`flex ${message.senderName === user.payload.lastName ? "justify-end" : "justify-start"}`}>
                                        {message.senderName !== user.payload.lastName && (
                                            <img
                                                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                                className="object-cover h-8 w-8 rounded-full mr-2"
                                                alt=""
                                            />
                                        )}

                                        {message.message.startsWith("http://res.cloudinary.com/") ? (
                                            <div
                                                className={`py-2 px-4 text-white rounded-3xl ${message.senderName === user.payload.lastName ? "bg-green-500 rounded-br-none" : "bg-gray-400 rounded-bl-none"}`}>
                                                <img
                                                    src={message.message}
                                                    alt="Contenu envoyé"
                                                    className="h-15 w-15 object-cover rounded-3xl"
                                                    style={{height: "50", width: "50"}}
                                                />
                                            </div>

                                        ) : (
                                            <div
                                                className={`py-2 px-4 text-white rounded-3xl ${message.senderName === user.payload.lastName ? "bg-green-500 rounded-br-none" : "bg-gray-400 rounded-bl-none"}`}>
                                                {message.message}
                                            </div>
                                        )}

                                        {message.senderName === user.payload.lastName && (
                                            <img
                                                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                                className="object-cover h-8 w-8 rounded-full ml-2"
                                                alt=""
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {tab && (
                            <div className="flex py-3 space-x-2">
                                <FTProFancyButton icon={<Paperclip size={20} color="#ffffff"/>}
                                                  onClick={() => document.getElementById('fileInput').click()}/>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isUploading}
                                    className="hidden"
                                />
                                <input
                                    className="w-full bg-gray-300 py-3 px-3 rounded-md"
                                    type="text"
                                    placeholder="Message"
                                    value={imageURL?.startsWith("http://res.cloudinary.com/") ? "Image chargé" : userData.message}
                                    onChange={(e) => setUserData({...userData, "message": e.target.value})}
                                    disabled={imageURL || isUploading}
                                />
                                <FTProFancyButton icon={<PaperPlaneRight size={20} color="#ffffff"/>}
                                                  onClick={sendMessage}/>
                            </div>
                        )}
                    </div>
                </div>
                :
                <FTProLoader/>
            }
        </>
    );
}

export default Chat
