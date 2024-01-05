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

    const [filteredUsers, setFilteredUsers] = useState([]);

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

    const handleSearchUsersChatsChange = (e) => setFilteredUsers(e.target.value.toLowerCase());

    const filteredDatas = allUsers?.payload?.filter(item => item.firstName.toLowerCase().includes(filteredUsers) || item.lastName.toLowerCase().includes(filteredUsers))
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

    function formatToDDMMYYYY(dateStr) {
        // Créer un objet Date à partir de la chaîne
        const date = new Date(dateStr);

        // Extraire le jour, le mois et l'année
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() renvoie un index à partir de 0 pour janvier
        const year = date.getFullYear();

        // Construire et retourner la date formatée
        return `${day}-${month}-${year}`;
    }

    return (
        <>
            {user.payload ?
                <div className="shadow-md mx-5 p-5 flex flex-row h-screen">
                    {/*Liste utilisateur pour chatter*/}
                    <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                        <div className="border-b-2 py-4 px-2 relative">
                            <svg className="w-6 h-6 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
                                 xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                <path
                                    d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                            </svg>
                            <style>
                                {`
                                    #searchInput:focus {
                                        border-color: #4CC425;
                                        outline: none;
                                    }
                                `}
                            </style>
                            <input
                                id="searchInput"
                                type="text"
                                placeholder="Recherche"
                                className="py-2 pl-12 pr-2 border-2 border-gray-200 rounded-2xl w-full focus:border-green-500"
                                onChange={handleSearchUsersChatsChange}
                            />
                        </div>

                        {filteredDatas && filteredDatas.map((userItem, index) => (
                            <div
                                className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 rounded-md ${
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
                        {filteredDatas && filteredDatas.length === 0 && (
                            <div className="flex items-center justify-center my-10">Aucun chats trouvé</div>
                        )}
                    </div>
                    {/*Discussion*/}
                    <div className="w-full px-5 flex flex-col justify-between"
                         style={{
                             backgroundImage: "url('/images/floral-background.jpg')",
                             backgroundSize: "cover",
                         }}>
                        <div className="flex flex-col mt-5 overflow-y-auto">
                            {tab && chatMessages?.payload && chatMessages.payload.map((message, index) => (
                                <div key={index}
                                     className={`flex flex-col mb-4 ${message.senderName === user?.payload.lastName ? "items-end" : "items-start"}`}>

                                    {/* Afficher le nom de l'expéditeur au-dessus du message */}
                                    <div className="text-sm text-gray-600 mb-1">
                                        {message.senderName}
                                    </div>

                                    {/* Structure flex pour le message */}
                                    <div
                                        className={`py-2 px-4 text-white rounded-3xl ${message.senderName === user.payload.lastName ? "bg-green-500 rounded-br-none" : "bg-gray-400 rounded-bl-none"}`}>
                                        {/* Afficher le contenu du message ou l'image s'il s'agit d'un lien vers une image */}
                                        {message.message.startsWith("http://res.cloudinary.com/") ? (
                                            <img
                                                src={message.message}
                                                alt="Contenu envoyé"
                                                className="h-15 w-15 object-cover rounded-3xl"
                                                style={{height: "50", width: "50"}}
                                            />
                                        ) : (
                                            message.message
                                        )}
                                    </div>

                                    {/* Afficher la date formatée sous le message */}
                                    <div className="text-xs text-gray-500 mt-1">
                                        {formatToDDMMYYYY(message.date)}
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
                                    className="w-full py-3 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    type="text"
                                    placeholder="Message"
                                    value={imageURL?.startsWith("http://res.cloudinary.com/") ? "Image chargée" : userData.message}
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
