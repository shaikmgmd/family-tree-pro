import React, {useEffect, useState} from 'react';
import {Avatar, Button, List, Skeleton} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {
    setUsers,
    addUsers,
    setLoading,
    setHasMore,
} from '../../store/features/slices/familytreeuser';
import {getAllUsersExceptCurrent} from "../../api/feature/user";
import PowerButton from "../../components/button/PowerButton";
import './ListUser.css';
import {getTreeByUserIdAction} from "../../store/features/slices/tree";
import {getTreeByUserId} from "../../api/feature/tree";

const ListUser = () => {
    const {data, loading, hasMore} = useSelector((state) => state.familytreeuser);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState({
        page: 0,
        size: 2
    });

    useEffect(() => {
        dispatch(setLoading(true));
        getAllUsersExceptCurrent(currentPage.page, currentPage.size)
            .then((res) => {
                console.log("data:", res.data);
                dispatch(setUsers(res.data));
                dispatch(setLoading(false));
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des utilisateurs", error);
                dispatch(setLoading(false));
            });
    }, [dispatch, currentPage.page]);
    const onLoadMore = () => {
        if (!hasMore) return;
        dispatch(setLoading(true));

        const nextPage = currentPage.page + 1;
        console.log("Chargement de la page : ", nextPage);
        getAllUsersExceptCurrent(nextPage, currentPage.size)
            .then((res) => {
                if (res.data.length === 0) {
                    dispatch(setHasMore(false));
                } else {
                    dispatch(addUsers(res.data));
                    setCurrentPage((prevState) => ({
                        ...prevState,
                        page: prevState.page + 1 // mise à jour correcte de la page
                    }));
                }
                dispatch(setLoading(false));
            })
            .catch((error) => {
                console.error("Erreur lors du chargement de plus d'utilisateurs", error);
                dispatch(setLoading(false));
            });
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
            <Button onClick={onLoadMore}>loading more</Button>
        </div>
    ) : null;

    return (
        <List
            className="demo-loadmore-list"
            loading={loading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={data}
            renderItem={(item) => (
                <List.Item
                >
                    <Skeleton avatar title={false} loading={loading} active>
                        <List.Item.Meta
                            className="custom-list-item-meta"
                            avatar={<Avatar className="custom-avatar" src={item.photoPath}/>}
                            title={<div>{item.firstName}</div>}
                        />
                    </Skeleton>
                    <PowerButton onClick={() => getTreeByUserId(item.id)} index={item.id} />
                </List.Item>
            )}
        />
    );
};

export default ListUser;
