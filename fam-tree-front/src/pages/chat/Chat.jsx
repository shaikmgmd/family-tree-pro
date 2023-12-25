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

const Chat = () => {
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        message: ''
    });
    const [currChatUsersIds, setCurrChatUsersIds] = useState({
        userId1: 0,
        userId2: 0
    });
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

            dispatch(startChatAction({ userId1, userId2 }))
                .then((action) => {
                    if (action.payload && action.payload.id) {
                        // Mettez à jour l'ID de la conversation actuelle (tab) et les IDs des utilisateurs de la conversation actuelle
                        setTab(action.payload.id);
                        setCurrChatUsersIds({ userId1: userId1, userId2: userId2 });
                    }
                });
        }
    };

    return (
        <div className="relative">
            {user.payload ?
                <div className="shadow-lg m-10 p-10 flex flex-row h-screen">
                    <div className="w-1/5">
                        <ul>
                            {allUsers.payload && allUsers.payload.map((userItem, index) => (
                                <li key={index}
                                    onClick={() => handleUserClick(userItem.id)}
                                    className="cursor-pointer p-2 m-2 bg-gray-200">
                                    {userItem.firstName} {userItem.lastName}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-4/5 ml-2">
                        <ul className="h-4/5 border p-2 overflow-y-auto">
                            {/* Affichez les messages du chat actuel */}
                            {chatMessages.payload && chatMessages.payload.map((message, index) => (
                                <li className={`flex ${message.senderName === user.payload.lastName ? "justify-end" : ""}`}
                                    key={index}>
                                    {message.senderName !== user.payload.lastName &&
                                        <div
                                            className="bg-blue-500 text-white p-2 rounded-full">{message.senderName}</div>}
                                    <div className="p-2">{message.message}</div>
                                    {message.senderName === user.payload.lastName &&
                                        <div
                                            className="bg-green-500 text-white p-2 rounded-full self-end">{message.senderName}
                                        </div>
                                    }
                                </li>
                            ))}
                        </ul>
                        <div className="flex">
                            <input type="text" className="flex-1 p-2 rounded"
                                   placeholder="Enter the message"
                                   value={userData.message}
                                   onChange={(e) => setUserData({...userData, "message": e.target.value})}/>
                            <button type="button" className="bg-green-500 text-white p-2 rounded ml-2"
                                    onClick={sendMessage}>Send
                            </button>
                        </div>
                    </div>
                </div>
                :
                <div
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg p-6 flex flex-col items-center">
                    <input
                        className="p-2 mb-4 text-lg"
                        placeholder="Enter your name"
                        value={userData.username}
                        onChange={(e) => setUserData({...userData, "username": e.target.value})}
                    />
                    <button type="button" className="bg-green-500 text-white p-2 rounded"
                            onClick={() => setUserData({...userData, connected: true})}>
                        Connect
                    </button>
                </div>
            }
        </div>
    );
}

export default Chat
