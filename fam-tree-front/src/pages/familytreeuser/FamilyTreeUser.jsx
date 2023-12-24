import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTreeByUserId } from "../../api/feature/tree";
import ErrorBornDate from "../tree/ErrorBornDate";
import {useDispatch, useSelector} from "react-redux";
import {getTreeByUserIdAction} from "../../store/features/slices/tree";
import FamilyTreeComponent from "../tree/FamilyTreeComponent";
import PowerButton from "../../components/button/PowerButton";
import {Button} from "antd";
import { useNavigate } from "react-router-dom";

const FamilyTreeUser = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.getConnectedUser);
    const treeData = useSelector((state) => state.tree.getUserTree.payload);
    const navigate = useNavigate();

    useEffect( () => {
        if(userId) {
            fetch();
        }
    }, []);

    const fetch = async () => {
        const response = await dispatch(getTreeByUserIdAction(userId));
        console.log(response);
    }

    const handleRetour = () => {
        navigate('/user/all-except-current');
    };

    console.log("Arbre pour l'utilisateur ID:", userId); // Console log les données de l'arbre
    console.log("Données de l'arbre:", treeData);

    return (
        <div>
            {/*<ErrorBornDate />*/}
            {treeData ? <div>Arbre généalogique pour l'utilisateur {userId}</div> : <p> Arbre Vide</p>}
            <Button type="primary" key="console" onClick={handleRetour} className="billyButton" style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '20px' }}>
                Retour
            </Button>
            <FamilyTreeComponent isOwner={false} />
        </div>
    );
};

export default FamilyTreeUser;
