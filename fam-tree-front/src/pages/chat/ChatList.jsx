import React from 'react';
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import Chat from "./Chat";

const ChatList = () => {
    return (
        <MainWrapper title={'Liste de chats'} description={'Discussion'}>
            <Chat />
        </MainWrapper>
    );
}

export default ChatList;
