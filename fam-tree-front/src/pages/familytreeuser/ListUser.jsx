import React, {useEffect, useState} from 'react';
import {Avatar, Button, List, Skeleton} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {
    setUsers,
    addUsers,
    setLoading,
    setHasMore, getAllUsersExceptCurrentAction, getAllUsersAction, resetAllUsersExceptCurrent,
} from '../../store/features/slices/user';
import {getAllUsersExceptCurrent} from "../../api/feature/user";
import PowerButton from "../../components/button/PowerButton";
import './ListUser.css';
import {getTreeByUserIdAction} from "../../store/features/slices/tree";
import {getTreeByUserId} from "../../api/feature/tree";
import {useNavigate, useParams} from 'react-router-dom';
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import {ListUserWrapper} from "../../components/wrapper/ListUserWrapper";
import {AllUsersLoadedMessage} from "../../components/popup/AllUsersLoadedMessage";
import {PlusCircleFilled} from "@ant-design/icons";
import SearchButton from "../../components/button/SearchButton";
import {getAllUsers} from "../../api/feature/user";

const ListUser = () => {
    const {data, loading, hasMore, page} = useSelector((state) => state.user.allUsersExceptCurrent);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.getConnectedUser);
    const userCount = useSelector((state) => state.user.allUsersExceptCurrent);
    const pageSize = 2;
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Users loaded:', data);
        console.log('Has more users:', hasMore);
    }, [data, hasMore]);

    useEffect(() => {
        return () => {
            // Dispatch an action to reset the state when the component unmounts
            dispatch(resetAllUsersExceptCurrent());
        };
    }, [dispatch]);

    const loadUsers = async (page) => {
        await dispatch(getAllUsersExceptCurrentAction({page, size: pageSize}));
    };

    const onLoadMore = () => {
        if (!hasMore || loading) return;
        console.log(`Loading users for page: ${page}`);
        loadUsers(page).then(() => {
        });
        //loadUsers(page);
    };

    const loadMore = !loading && hasMore ? (
        <div
            style={{
                textAlign: "center",
                marginTop: 12,
                height: 32,
                lineHeight: "32px",
            }}
        >
            <PowerButton onClick={onLoadMore} text={"Next"} duration={100} icon={<PlusCircleFilled />}></PowerButton>
        </div>
    ) : null;

    const handlePowerButtonClick = (userId) => {
        //navigate(`/family-tree/user/${userId}`);
        navigate(`/family-tree/user/${userId}`);
    };

    const allUsersLoadedMessage = !hasMore && data.length > 0 ? <AllUsersLoadedMessage /> : null;

    return (
        <ListUserWrapper title={"Liste des utilisateurs disponible sur l'application"}
                     description={"N'hésitez pas à jeter un coup d'oeil à l'arbre généalogique des autres utilisateurs !"}
                    userCount={userCount.data.length}>
            <List
                className="demo-loadmore-list"
                loading={loading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={data}
                renderItem={(item) => {
                    // Log l'item ici
                    console.log("item:", item);

                    return (
                        <List.Item>
                            <Skeleton avatar title={false} loading={loading} active>
                                <List.Item.Meta
                                    className="custom-list-item-meta"
                                    avatar={<Avatar className="custom-avatar" src={item.photoPath}/>}
                                    title={<div>{item.firstName}</div>}
                                    description={"Utilisateur n°" + item.id + " : " + item.lastName + " " + item.firstName + " | Orignaire du pays " + item.nationality + ", il est né le " + item.birthDate + ". "
                                    + "Son arbre a été crée le " + item.createdAt}
                                />
                            </Skeleton>
                            <PowerButton index={item.id} onClick={() => handlePowerButtonClick(item.id)} text="Voir l'arbre" duration={1000}/>
                        </List.Item>
                    );
                }}
            />
            {allUsersLoadedMessage}
        </ListUserWrapper>
    );
};

export default ListUser;
