import React, {useState, useEffect} from 'react';
import {Table, Button, Space, Tabs} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {
    getApprovedAdhesionAction,
    getPendingAdhesionAction,
    getRejectedAdhesionAction
} from "../../store/features/slices/adhesion";
import AdhesionTable from "./AdhesionTable";
import {MainWrapper} from "../../components/wrapper/MainWrapper";

export const AdhesionDashboard = () => {
    const dispatch = useDispatch();
    const pendingAdhesions = useSelector((state) => state.adhesion.pendingAdhesions);
    const approvedAdhesions = useSelector((state) => state.adhesion.approvedAdhesions);
    const rejectedAdhesions = useSelector((state) => state.adhesion.rejectedAdhesions);
    const [trigger, setTrigger] = useState(0);
    const {TabPane} = Tabs;

    const handleTabChange = (key) => {
        switch (key) {
            case "1":
                dispatch(getPendingAdhesionAction());
                break;
            case "2":
                dispatch(getApprovedAdhesionAction());
                break;
            case "3":
                dispatch(getRejectedAdhesionAction());
                break;
            default:
                break;
        }
    }

    const tabStyle = {
        color: '#4CC425', // Définissez la couleur de texte de l'onglet actif
    };

    const tabBarStyle = {
        backgroundColor: '#4CC425', // Définissez la couleur de fond de la barre sous l'onglet actif
    };


    useEffect(() => {
        dispatch(getPendingAdhesionAction());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getPendingAdhesionAction());
        dispatch(getApprovedAdhesionAction());
        dispatch(getRejectedAdhesionAction());
    }, [trigger]);

    return (
        <>
            <style>
                {`
                .ant-tabs-tab-active .ant-tabs-tab-btn,
                .ant-tabs-tab:hover .ant-tabs-tab-btn {
                    color: #4CC425 !important; /* Change la couleur du texte de l'onglet actif et au survol */
                }

                .ant-tabs-ink-bar {
                    background-color: #4CC425 !important; /* Change la couleur de la barre sous l'onglet actif */
                }

                .ant-tabs-tab:hover {
                    color: #4CC425 !important; /* Change la couleur de l'onglet au survol */
                }
                `}
            </style>
            <MainWrapper title={"Demandes d'adhésions"}
                         description={"Consultez les demande d'adhésions en attente, acceptées ou refusées :"}>
                <Tabs defaultActiveKey="1" onChange={handleTabChange}>
                    <TabPane tab="En attente" key="1">
                        <AdhesionTable data={pendingAdhesions?.payload} setTrigger={setTrigger} showActions={true}/>
                    </TabPane>
                    <TabPane tab="Approuvé" key="2">
                        <AdhesionTable data={approvedAdhesions?.payload} setTrigger={setTrigger} showActions={false}
                                       showAdminAction={true}/>
                    </TabPane>
                    <TabPane tab="Rejeté" key="3">
                        <AdhesionTable data={rejectedAdhesions?.payload} setTrigger={setTrigger} showActions={false}/>
                    </TabPane>
                </Tabs>
            </MainWrapper>
        </>
    );
}

export default AdhesionDashboard;