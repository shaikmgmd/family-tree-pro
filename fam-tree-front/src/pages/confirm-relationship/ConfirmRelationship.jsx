import React, {useEffect, useRef, useState} from 'react';

import {
    confirmRelationshipAction
} from "../../store/features/slices/tree";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {Link, useNavigate} from "react-router-dom";


const ConfirmRelationship = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {confirmationCode} = useParams();
    const confirmationPayload = useSelector((state) => state.tree.relationConfirmation.payload);

    const handleConfirmRelationship = data => {
        const response = dispatch(confirmRelationshipAction(data));
        console.log("response useEffect =>", response)
        /*if(response) {
            navigate("/home")
        }*/
    }

    useEffect(() => {
        handleConfirmRelationship(confirmationCode);
    }, [])

    return (
        <div>
            <pre>{confirmationPayload}</pre>
            <Link to={"/home"}>
                Revenir à l'accueil
            </Link>
        </div>
    )
}

export default ConfirmRelationship;