import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getTreeByUserId} from "../../api/feature/tree";
import ErrorBornDate from "../tree/ErrorBornDate";
import {useDispatch, useSelector} from "react-redux";
import {getTreeByUserIdAction} from "../../store/features/slices/tree";
import FamilyTreeComponent from "../tree/FamilyTreeComponent";
import PowerButton from "../../components/button/PowerButton";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import {getUserByIdAction} from "../../store/features/slices/user";
import {FTProLoader} from "../../components/loader/FTProLoader";

const FamilyTreeUser = () => {
    const {userId} = useParams();
    const dispatch = useDispatch();
    const treeLoader = useSelector((state) => state.tree.getUserTree.loading);
    const userById = useSelector((state) => state.user.getUserById.payload);
    const treeData = useSelector((state) => state.tree.getUserTree.payload);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetch();
        }
    }, []);

    const fetch = async () => {
        await dispatch(getTreeByUserIdAction(userId));
        await dispatch(getUserByIdAction(userId))
    }

    const handleRetour = () => {
        navigate('/user/all-except-current');
    };

    return (
        <MainWrapper
            title={`${treeData ? `Arbre généalogique pour l'utilisateur ${userById?.firstName} ${userById?.lastName}` : "Il n'y aucun arbre associé à cet utilisateur"} `}
            description={`Voici l'arbre généalogique de ${userById?.firstName}, vous pouvez voir ses noeuds qui sont visible à tout le monde`}
            buttonComponent={<Button type="primary" key="console" onClick={handleRetour} className="billyButton"
                                     style={{marginTop: '20px', marginBottom: '20px', marginLeft: '20px'}}>
                Retour
            </Button>}
        >
            {treeLoader ? (
                <FTProLoader/>
            ) : (
                <FamilyTreeComponent isOwner={false} />
            )}

        </MainWrapper>
    );
};

export default FamilyTreeUser;
