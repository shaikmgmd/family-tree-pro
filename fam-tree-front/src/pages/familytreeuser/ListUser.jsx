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
import {postRecordViewAction} from "../../store/features/slices/stats";

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
    const pageSize = 10;
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

    const handlePowerButtonClick = async (userId) => {
        //navigate(`/family-tree/user/${userId}`);
        await dispatch(postRecordViewAction(userId));
        navigate(`/family-tree/user/${userId}`);
    };

    const showAllUsersLoadedMessage = !loading && !hasMore && data.length > 0;


    return (
        <ListUserWrapper title={"Liste des utilisateurs disponible sur l'application"}
                         description={"N'hésitez pas à jeter un coup d'oeil à l'arbre généalogique des autres utilisateurs !"}
                         userCount={userCount.data.length}>
            <div className="flex flex-wrap -mx-3 mb-6">
                {/* Nom */}
                <div className="w-1/5 px-3 mb-6 md:mb-0 relative">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="lastName">
                        Nom
                    </label>
                    <div className="relative">
                        <svg
                            className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                            xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                            <path
                                d="M256,136a8,8,0,0,1-8,8H200a8,8,0,0,1,0-16h48A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path>
                        </svg>
                        <input
                            className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 pl-12 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                            id="lastName" type="text" placeholder="Nom" value={searchLastName}
                            onChange={handleSearchLastNameChange}
                        />
                    </div>
                </div>

                {/* Prénom */}
                <div className="w-1/5 px-3 mb-6 md:mb-0 relative">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="firstName">
                        Prénom
                    </label>
                    <div className="relative">
                        <svg
                            className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                            xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                            <path
                                d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path>
                        </svg>
                        <input
                            className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 pl-12 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                            id="firstName" type="text" placeholder="Prénom" value={searchFirstName}
                            onChange={handleSearchFirstNameChange}
                        />
                    </div>
                </div>

                {/* N° Sécurité Sociale */}
                <div className="w-1/5 px-3 mb-6 md:mb-0 relative">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="socialSecurityNumber">
                        N° Sécurité Sociale
                    </label>
                    <div className="relative">
                        <svg
                            className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                            xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                            <path
                                d="M224,128a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM104,72H216a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16ZM216,184H104a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM43.58,55.16,48,52.94V104a8,8,0,0,0,16,0V40a8,8,0,0,0-11.58-7.16l-16,8a8,8,0,0,0,7.16,14.32ZM79.77,156.72a23.73,23.73,0,0,0-9.6-15.95,24.86,24.86,0,0,0-34.11,4.7,23.63,23.63,0,0,0-3.57,6.46,8,8,0,1,0,15,5.47,7.84,7.84,0,0,1,1.18-2.13,8.76,8.76,0,0,1,12-1.59A7.91,7.91,0,0,1,63.93,159a7.64,7.64,0,0,1-1.57,5.78,1,1,0,0,0-.08.11L33.59,203.21A8,8,0,0,0,40,216H72a8,8,0,0,0,0-16H56l19.08-25.53A23.47,23.47,0,0,0,79.77,156.72Z"></path>
                        </svg>
                        <input
                            className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 pl-12 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                            id="socialSecurityNumber" type="text" placeholder="N° Sécurité Sociale" value={searchSSN}
                            onChange={handleSearchSSNChange}
                        />
                    </div>
                </div>

                {/* Code Public */}
                <div className="w-1/5 px-3 mb-6 md:mb-0 relative">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="publicCode">
                        Code Public
                    </label>
                    <div className="relative">
                        <svg
                            className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                            xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                            <path
                                d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                        </svg>
                        <input
                            className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 pl-12 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                            id="publicCode" type="text" placeholder="Code Public" value={searchPublicCode}
                            onChange={handleSearchPublicCodeChange}
                        />
                    </div>
                </div>

                {/* Filtrer par */}
                <div className="w-1/5 px-3 mb-6 md:mb-0 relative">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="filterBy"
                    >
                        Filtrer par
                    </label>
                    <div className="relative">
                        <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                             xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                            <path
                                d="M88,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H96A8,8,0,0,1,88,64Zm128,56H96a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H96a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM56,56H40a8,8,0,0,0,0,16H56a8,8,0,0,0,0-16Zm0,64H40a8,8,0,0,0,0,16H56a8,8,0,0,0,0-16Zm0,64H40a8,8,0,0,0,0,16H56a8,8,0,0,0,0-16Z"></path>
                        </svg>
                        <style>
                            {`
                                    #filterBy:focus {
                                        border-color: #4CC425;
                                        outline: none;
                                    }
                                `}
                        </style>
                        <select
                            className="appearance-none block w-full bg-white text-gray-500 border border-gray-200 rounded py-3 px-4 pl-12 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                            id="filterBy" onChange={handleSortChange} value={sortBy}>
                            <option value="lastName">Nom</option>
                            <option value="firstName">Prénom</option>
                            <option value="socialSecurityNumber">Numéro de Sécurité Sociale</option>
                            <option value="publicCode">Code Public</option>
                        </select>
                    </div>

                </div>
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
                                    avatar={<Avatar className="h-16 w-16 rounded-full" src={item.photoPath}/>}
                                    title={<div
                                        className="font-bold text-lg">{item.firstName + " " + item.lastName}</div>}
                                    description={
                                        <div className="text-base text-gray-500">
                                            {/*<strong>{item.firstName} {item.lastName}</strong>, */}
                                            Est originaire
                                            de <strong>{item.nationality}</strong> et est né
                                            le <strong>{new Date(item.birthDate).toLocaleDateString()}</strong>. Cet
                                            utilisateur, dont le numéro de sécurité sociale est
                                            le <strong>{item.socialSecurityNumber}</strong> et le code public
                                            est <strong>{item.publicCode}</strong>. Il réside à
                                            '<strong>{item.address}</strong>' et peut être contacté par email à
                                            '<strong>{item.email}</strong>' ou par téléphone
                                            au <strong>{item.phone}</strong>.
                                        </div>
                                    }
                                />
                            </Skeleton>
                            <PowerButton index={item.id} onClick={() => handlePowerButtonClick(item.id)}
                                         text="Voir l'arbre" duration={1000}/>
                        </List.Item>

                    );
                }}
            />
            {
                showAllUsersLoadedMessage && <AllUsersLoadedMessage/>
            }
        </ListUserWrapper>
    )
        ;
};

export default ListUser;
