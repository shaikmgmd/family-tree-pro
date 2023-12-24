import React, {useEffect, useState} from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {Divider} from "antd";
import {MainWrapper} from "../../components/wrapper/MainWrapper";

var stompClient = null;
const Chat = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });
    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/api/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage = (event) => {
        const {value} = event.target;
        setUserData({...userData, "message": value});
    }
    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""});
        }
    }

    const sendPrivateValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""});
        }
    }

    const handleUsername = (event) => {
        const {value} = event.target;
        setUserData({...userData, "username": value});
    }

    const registerUser = () => {
        connect();
    }
    return (

        <div className="relative">
            {userData.connected ?
                <div className="shadow-lg m-10 p-10 flex flex-row h-screen">
                    <div className="w-1/5">
                        <ul>
                            <li onClick={() => {
                                setTab("CHATROOM")
                            }}
                                className={`cursor-pointer p-2 m-2 ${tab === "CHATROOM" ? "bg-purple-600 text-white" : "bg-gray-200"}`}>Chatroom
                            </li>
                            {[...privateChats.keys()].map((name, index) => (
                                <li onClick={() => {
                                    setTab(name)
                                }}
                                    className={`cursor-pointer p-2 m-2 ${tab === name ? "bg-purple-600 text-white" : "bg-gray-200"}`}
                                    key={index}>{name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {tab === "CHATROOM" && <div className="w-4/5 ml-2">
                        <ul className="h-4/5 border p-2 overflow-y-auto">
                            {publicChats.map((chat, index) => (
                                <li className={`flex ${chat.senderName === userData.username ? "justify-end" : ""}`}
                                    key={index}>
                                    {chat.senderName !== userData.username &&
                                        <div
                                            className="bg-blue-500 text-white p-2 rounded-full">{chat.senderName}</div>}
                                    <div className="p-2">{chat.message}</div>
                                    {chat.senderName === userData.username &&
                                        <div
                                            className="bg-green-500 text-white p-2 rounded-full self-end">{chat.senderName}
                                        </div>
                                    }
                                </li>
                            ))}
                        </ul>

                        <div className="flex">
                            <input type="text" className="flex-1 p-2 rounded"
                                   placeholder="Enter the message"
                                   value={userData.message} onChange={handleMessage}/>
                            <button type="button" className="bg-green-500 text-white p-2 rounded ml-2"
                                    onClick={sendValue}>Send
                            </button>
                        </div>
                    </div>}
                    {tab !== "CHATROOM" && <div className="w-4/5 ml-2">
                        <ul className="h-4/5 border p-2 overflow-y-auto">
                            {[...privateChats.get(tab)].map((chat, index) => (
                                <li className={`flex ${chat.senderName === userData.username ? "justify-end" : ""}`}
                                    key={index}>
                                    {chat.senderName !== userData.username &&
                                        <div
                                            className="bg-blue-500 text-white p-2 rounded-full">{chat.senderName}
                                        </div>
                                    }
                                    <div className="p-2">{chat.message}</div>
                                    {chat.senderName === userData.username &&
                                        <div
                                            className="bg-green-500 text-white p-2 rounded-full self-end">{chat.senderName}
                                        </div>
                                    }
                                </li>
                            ))}
                        </ul>

                        <div className="flex">
                            <input type="text" className="flex-1 p-2 rounded"
                                   placeholder="Enter the message"
                                   value={userData.message} onChange={handleMessage}/>
                            <button type="button" className="bg-green-500 text-white p-2 rounded ml-2"
                                    onClick={sendPrivateValue}>Send
                            </button>
                        </div>
                    </div>
                    }
                </div>
                :
                <div
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg p-6 flex flex-col items-center">
                    <input
                        className="p-2 mb-4 text-lg"
                        placeholder="Enter your name"
                        value={userData.username}
                        onChange={handleUsername}
                    />
                    <button type="button" className="bg-green-500 text-white p-2 rounded"
                            onClick={registerUser}>
                        Connect
                    </button>
                </div>
            }
        </div>

    );
}

export default Chat
