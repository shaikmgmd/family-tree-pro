import React from 'react';
import {Table, Button, Space} from 'antd';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import {
    approveAdhesionAction, getApprovedAdhesionAction,
    getPendingAdhesionAction, getRejectedAdhesionAction,
    rejectAdhesionAction
} from "../../store/features/slices/adhesion";
import {addNewAdminAction, removeAdminAction} from "../../store/features/slices/role";
import {toast} from "react-toastify";

const AdhesionTable = ({data, showActions, showAdminAction = false}) => {
    const dispatch = useDispatch();

    const columns = [
        {
            title: 'Numéro de sécurité sociale',
            dataIndex: 'socialSecurityNumber',
            showSorterTooltip: true,  // Ajouté pour le tri
            sorter: (a, b) => a.socialSecurityNumber.localeCompare(b.socialSecurityNumber),  // Exemple de tri
        },
        {
            title: 'Nom',
            dataIndex: 'lastName',
            defaultSortOrder: 'descend',
            showSorterTooltip: true,
            sorter: (a, b) => a.lastName.localeCompare(b.lastName),
        },
        {
            title: 'Prénom',
            dataIndex: 'firstName',
            showSorterTooltip: true,
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
        },
        {
            title: 'Date de naissance',
            dataIndex: 'birthDate',
            showSorterTooltip: true,
            sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate),
        },
        {
            title: 'Nationalité',
            dataIndex: 'nationality',
            showSorterTooltip: true,
            sorter: (a, b) => a.nationality.localeCompare(b.nationality),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            showSorterTooltip: true,
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
    ];

    if (showActions) {
        columns.push({
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        icon={<CheckOutlined/>}
                        onClick={() => {
                            dispatch(approveAdhesionAction(record.id))
                                .then(async () => {
                                    // Une fois l'adhésion approuvée, rechargez les données.
                                    dispatch(getApprovedAdhesionAction());
                                    dispatch(getPendingAdhesionAction());
                                    dispatch(getRejectedAdhesionAction());
                                });
                        }}
                    >
                        Accepter
                    </Button>
                    <Button
                        danger
                        icon={<CloseOutlined/>}
                        onClick={() => {
                            dispatch(rejectAdhesionAction(record.id))
                                .then(() => {
                                    // Une fois l'adhésion refusée, rechargez les données.
                                    dispatch(getApprovedAdhesionAction());
                                    dispatch(getPendingAdhesionAction());
                                    dispatch(getRejectedAdhesionAction());
                                });
                        }}
                    >
                        Refuser
                    </Button>
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
                    <Button
                        icon={<CheckOutlined/>}
                        onClick={() => {
                            dispatch(addNewAdminAction(record.id))
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
                        }}
                    >
                        Admin
                    </Button>
                    <Button
                        danger
                        icon={<CloseOutlined/>}
                        onClick={() => {
                            dispatch(removeAdminAction(record.id))
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
                        }}
                    >
                        Admin
                    </Button>
                </Space>
            ),
        });
    }

    return <Table columns={columns} dataSource={data}/>;
};

export default AdhesionTable;
