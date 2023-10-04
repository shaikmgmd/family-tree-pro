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

    useEffect(() => {
        dispatch(getPendingAdhesionAction());
    }, [dispatch]);

    return (
        <MainWrapper title={"Demandes d'adhésions"}
                     description={"Consultez les demande d'adhésions en attente, acceptées ou refusées :"}>
            <Tabs defaultActiveKey="1" onChange={handleTabChange}>
                <TabPane tab="Pending" key="1">
                    <AdhesionTable data={pendingAdhesions?.payload} showActions={true}/>
                </TabPane>
                <TabPane tab="Approved" key="2">
                    <AdhesionTable data={approvedAdhesions?.payload} showActions={false}/>
                </TabPane>
                <TabPane tab="Rejected" key="3">
                    <AdhesionTable data={rejectedAdhesions?.payload} showActions={false}/>
                </TabPane>
            </Tabs>
        </MainWrapper>
    );
}

export default AdhesionDashboard;