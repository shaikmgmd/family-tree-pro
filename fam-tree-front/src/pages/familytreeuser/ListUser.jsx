import React, {useEffect, useState} from 'react';
import {Avatar, Button, List, Skeleton} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {
    setUsers,
    addUsers,
    setLoading,
    setHasMore, getAllUsersExceptCurrentAction, getAllUsersAction, resetAllUsersExceptCurrent,
} from '../../store/features/slices/user';
import PowerButton from "../../components/button/PowerButton";
import './ListUser.css';
import {useNavigate, useParams} from 'react-router-dom';
import {ListUserWrapper} from "../../components/wrapper/ListUserWrapper";
import {AllUsersLoadedMessage} from "../../components/popup/AllUsersLoadedMessage";
import {PlusCircleFilled} from "@ant-design/icons";

const ListUser = () => {
    const {data, loading, hasMore, page} = useSelector((state) => state.user.allUsersExceptCurrent);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('lastName'); // État pour gérer le critère de tri

    const [searchLastName, setSearchLastName] = useState('');
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchSSN, setSearchSSN] = useState('');  // Numéro de Sécurité Sociale
    const [searchPublicCode, setSearchPublicCode] = useState('');


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
        if (data.length === 0) {
            // If there's no data, load the first page
            loadUsers(0);
        } else {
            // If there's already data, reset it and load the first page
            dispatch(resetAllUsersExceptCurrent());
            loadUsers(0);
        }
    }, [dispatch]); // Only run this effect when the component mounts


    const loadUsers = async (page) => {
        await dispatch(getAllUsersExceptCurrentAction({page, size: pageSize}));
    };

    const onLoadMore = () => {
        if (!hasMore || loading) return;
        loadUsers(page).then(() => {
        });
        //loadUsers(page);
    };

    const handleSearchLastNameChange = (e) => setSearchLastName(e.target.value.toLowerCase());
    const handleSearchFirstNameChange = (e) => setSearchFirstName(e.target.value.toLowerCase());
    const handleSearchSSNChange = (e) => setSearchSSN(e.target.value);
    const handleSearchPublicCodeChange = (e) => setSearchPublicCode(e.target.value);

    // Mettre à jour le critère de tri
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const filteredData = data.filter(item =>
        item.lastName.toLowerCase().includes(searchLastName) &&
        item.firstName.toLowerCase().includes(searchFirstName) &&
        item.socialSecurityNumber.includes(searchSSN) &&
        item.publicCode.includes(searchPublicCode)

    ).sort((a, b) => {
        // Trier en fonction du critère sélectionné
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
    });

    const sortedAndFilteredData = data
        .filter(
            (item) =>
                item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.socialSecurityNumber.includes(searchQuery) ||
                item.publicCode.includes(searchQuery)
        )
        .sort((a, b) => {
            // Trier en fonction du critère sélectionné
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });

    const loadMore = !loading && hasMore ? (
        <div
            style={{
                textAlign: "center",
                marginTop: 12,
                height: 32,
                lineHeight: "32px",
            }}
        >
            <PowerButton onClick={onLoadMore} text={"Charger plus d'utilisateurs"} duration={100}
                         icon={<PlusCircleFilled/>}></PowerButton>
        </div>
    ) : null;

    const handlePowerButtonClick = (userId) => {
        //navigate(`/family-tree/user/${userId}`);
        navigate(`/family-tree/user/${userId}`);
    };

    const showAllUsersLoadedMessage = !loading && !hasMore && data.length > 0;


    return (
        <ListUserWrapper title={"Liste des utilisateurs disponible sur l'application"}
                         description={"N'hésitez pas à jeter un coup d'oeil à l'arbre généalogique des autres utilisateurs !"}
                         userCount={userCount.data.length}>
            <div className="search-fields-container">
                <input type="text" placeholder="Nom" value={searchLastName} onChange={handleSearchLastNameChange}/>
                <input type="text" placeholder="Prénom" value={searchFirstName} onChange={handleSearchFirstNameChange}/>
                <input type="text" placeholder="N° Sécurité Sociale" value={searchSSN}
                       onChange={handleSearchSSNChange}/>
                <input type="text" placeholder="Code Public" value={searchPublicCode}
                       onChange={handleSearchPublicCodeChange}/>
                <select onChange={handleSortChange} value={sortBy}>
                    <option value="lastName">Nom</option>
                    <option value="firstName">Prénom</option>
                    <option value="socialSecurityNumber">Numéro de Sécurité Sociale</option>
                    <option value="publicCode">Code Public</option>
                </select>
            </div>
            <List
                className="demo-loadmore-list"
                loading={loading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={filteredData}
                renderItem={(item) => {
                    console.log(item)
                    return (
                        <List.Item>
                            <Skeleton avatar title={false} loading={loading} active>
                                <List.Item.Meta
                                    className="custom-list-item-meta"
                                    avatar={<Avatar className="custom-avatar" src={item.photoPath}/>}
                                    title={<div className="font-bold">{item.firstName}</div>}
                                    description={"Utilisateur n°" + item.id + " : " + item.lastName + " " + item.firstName + " | Orignaire du pays " + item.nationality + ", il est né le " + item.birthDate + ". "
                                        + "Son arbre a été crée le " + item.createdAt}
                                />
                            </Skeleton>

                            <PowerButton index={item.id} onClick={() => handlePowerButtonClick(item.id)}
                                         text="Voir l'arbre" duration={1000}/>
                        </List.Item>
                    );
                }}
            />
            {showAllUsersLoadedMessage && <AllUsersLoadedMessage/>}
        </ListUserWrapper>
    );
};

export default ListUser;
