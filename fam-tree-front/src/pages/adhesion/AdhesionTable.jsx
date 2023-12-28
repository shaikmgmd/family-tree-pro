import React, {useState} from 'react';
import {Table, Button, Space, Modal} from 'antd';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import {
    approveAdhesionAction, getApprovedAdhesionAction,
    getPendingAdhesionAction, getRejectedAdhesionAction,
    rejectAdhesionAction
} from "../../store/features/slices/adhesion";
import {addNewAdminAction, removeAdminAction} from "../../store/features/slices/role";
import {toast} from "react-toastify";
import FTProButton from "../../components/button/FTProButton";
import {
    Check,
    X,
    UserCircleGear, UserCircleMinus
} from "@phosphor-icons/react";
import FTProFancyButton from "../../components/button/FTProFancyButton";
import FTProGlassButton from "../../components/button/FTProGlassButton";

const AdhesionTable = ({data, showActions, setTrigger, showAdminAction = false}) => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [selectedColumn, setSelectedColumn] = useState(null);

    const showModal = (imageUrl) => {
        setCurrentImage(imageUrl);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const selectColumn = (dataIndex) => {
        setSelectedColumn(dataIndex);
    };


    const columns = [
        {
            title: 'Numéro de sécurité sociale',
            dataIndex: 'socialSecurityNumber',
            showSorterTooltip: true,
            sorter: (a, b) => a.socialSecurityNumber.localeCompare(b.socialSecurityNumber),
            onHeaderCell: () => ({
                onClick: () => selectColumn('socialSecurityNumber'),
            }),
            className: selectedColumn === 'socialSecurityNumber' ? 'selected-column' : '',
        },
        {
            title: 'Nom',
            dataIndex: 'lastName',
            defaultSortOrder: 'descend',
            showSorterTooltip: true,
            sorter: (a, b) => a.lastName.localeCompare(b.lastName),
            onHeaderCell: () => ({
                onClick: () => selectColumn('lastName'),
            }),
            className: selectedColumn === 'lastName' ? 'selected-column' : '',
        },
        {
            title: 'Prénom',
            dataIndex: 'firstName',
            showSorterTooltip: true,
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
            onHeaderCell: () => ({
                onClick: () => selectColumn('firstName'),
            }),
            className: selectedColumn === 'firstName' ? 'selected-column' : '',
        },
        {
            title: 'Date de naissance',
            dataIndex: 'birthDate',
            showSorterTooltip: true,
            sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate),
            onHeaderCell: () => ({
                onClick: () => selectColumn('birthDate'),
            }),
            className: selectedColumn === 'birthDate' ? 'selected-column' : '',
        },
        {
            title: 'Nationalité',
            dataIndex: 'nationality',
            showSorterTooltip: true,
            sorter: (a, b) => a.nationality.localeCompare(b.nationality),
            onHeaderCell: () => ({
                onClick: () => selectColumn('nationality'),
            }),
            className: selectedColumn === 'nationality' ? 'selected-column' : '',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            showSorterTooltip: true,
            sorter: (a, b) => a.email.localeCompare(b.email),
            onHeaderCell: () => ({
                onClick: () => selectColumn('email'),
            }),
            className: selectedColumn === 'email' ? 'selected-column' : '',
        },
        {
            title: 'CNI',
            dataIndex: 'cni',
            render: (text, record) => (
                <Space size="middle">
                    <FTProGlassButton content="Voir CNI" onClick={() => showModal(record.idCardPath)}/>
                </Space>
            ),
        },
        {
            title: 'Photo',
            dataIndex: 'photo',
            render: (text, record) => (
                <Space size="middle">
                    <FTProGlassButton content="Voir Photo" noMarginTop onClick={() => showModal(record.photoPath)}/>
                </Space>
            ),
        },
    ];

    if (showActions) {
        columns.push({
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <FTProButton noMarginTop
                                 icon={<Check size={20} color="#ffffff"/>}
                                 onClick={async () => {
                                     await dispatch(approveAdhesionAction(record.id))
                                     setTrigger((v) => v + 1);
                                 }}/>
                    <FTProButton isDanger noMarginTop
                                 icon={<X size={20} color="#ffffff"/>}
                                 onClick={async () => {
                                     await dispatch(rejectAdhesionAction(record.id))
                                     setTrigger((v) => v + 1);
                                 }}/>
                </Space>
            ),
        });

    }
    if (showAdminAction) {
        columns.push({
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <FTProButton noMarginTop
                                 icon={<UserCircleGear size={20} color="#ffffff"/>}
                                 onClick={async () => {
                                     await dispatch(addNewAdminAction(record.id))
                                         .then(() => {
                                             toast.success("Nouveau admin ajouté!", {
                                                 position: "top-right",
                                                 autoClose: 5000,
                                                 hideProgressBar: false,
                                                 closeOnClick: true,
                                                 pauseOnHover: true,
                                                 draggable: true,
                                                 progress: undefined,
                                             });
                                         })
                                 }}/>
                    <FTProButton isDanger noMarginTop
                                 icon={<UserCircleMinus size={20} color="#ffffff"/>}
                                 onClick={async () => {
                                     await dispatch(removeAdminAction(record.id))
                                         .then(() => {
                                             toast.success("Nouveau admin retiré!", {
                                                 position: "top-right",
                                                 autoClose: 5000,
                                                 hideProgressBar: false,
                                                 closeOnClick: true,
                                                 pauseOnHover: true,
                                                 draggable: true,
                                                 progress: undefined,
                                             });
                                         })
                                 }}/>
                </Space>
            ),
        });
    }

    return (
        <>
            <style>
                {`
                /* Couleur de l'en-tête */
                .ant-table-thead > tr > th {
                    background-color: #b7eb8f !important;
                }
                
                /* Couleur de fond au survol pour chaque ligne */
                .ant-table-tbody > tr:hover > td {
                    background-color: #e6f7bf !important; /* Vert plus clair au survol */
                }
                
                .selected-column {
                    background-color: #ebf8cb !important; /* Couleur verte claire pour la colonne sélectionnée */
                }
    
                `}
            </style>
            <Modal
                title="Aperçu de l'image"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <img alt="Aperçu" src={currentImage} style={{width: '100%'}}/>
            </Modal>
            <Table columns={columns} dataSource={data}/>
        </>
    );
};

export default AdhesionTable;