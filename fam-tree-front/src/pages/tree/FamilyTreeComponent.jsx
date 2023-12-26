import React, {useEffect, useRef, useState} from 'react';
import FamilyTree from '@balkangraph/familytree.js';
import {useDispatch, useSelector} from "react-redux";
import './familyTreeComp.css'
import {addMemberToTreeAction, getTreeByUserIdAction} from "../../store/features/slices/tree";
import { useNavigate } from 'react-router-dom';

const FamilyTreeComponent = ({ familytree_id, isOwner, handleError }) => {
    const treeContainer = useRef(null); // Création d'une référence au conteneur
    const treeDataFromRedux = useSelector((state) => state.tree.getUserTree.payload);
    const [treeInstance, setTreeInstance] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const nodeBinding = {
        field_0: 'name',
        //field_1: 'born',
        img_0: 'photo'
    };

    const handleServerError = (error) => {
        console.log("Erreur complète:", error);
        if (error.payload.response.status === 400) {
            if (error.payload.response.data.content.includes("Relation parent-enfant invalide")) {
                setErrorMessage("La date de naissance de l'enfant est invalide par rapport à celle des parents.");
                //navigate('/family-tree/born-date-error');
                //setShowErrorBornDate(true);
                handleError(true);
            } else {
                setErrorMessage("Une erreur inattendue est survenue.");
            }
        }
        console.log("Message d'erreur : " + errorMessage);
    }

    useEffect(() => {
        dispatch(getTreeByUserIdAction(familytree_id));
    },[dispatch, familytree_id]);

    const addNode = (newNode) => {
        // Simuler un appel API pour ajouter un nœud
        setTimeout(() => {
            setData(currentData => [...currentData, newNode]);
        }, 1000); // Délai simulé de 1 seconde
    };

    function editHandler(nodeId) {
        console.log("nodeId",nodeId);
        var nodeData = treeInstance.current.get(nodeId);
        console.log("nodeData",nodeData);
    }

    const editNode = (nodeId, updatedNode) => {

        // Simuler un appel API pour éditer un nœud
        try {
            handleAddMember({updatedNode}).then(async r => {
                console.log("Response =>", r);
                await dispatch(getTreeByUserIdAction(1)); // familytree_id à la place du 1 ?? -> demander à shaikh
            });
            setTimeout(() => {
                setData(currentData =>
                    currentData.map(node => node.id === nodeId ? updatedNode : node)
                );
            }, 1000); // Délai simulé de 1 seconde
        }catch (error) {
            handleServerError(error);
        }
    };

    const deleteNode = (nodeId) => {
        try {
            // Simuler un appel API pour supprimer un nœud
            setTimeout(() => {
                setData(currentData =>
                    currentData.filter(node => node.id !== nodeId)
                );
            }, 1000); // Délai simulé de 1 seconde
        }catch(error){
            handleServerError(error);
        }
    };

    useEffect(() => {
        console.log("isOwner" + isOwner);
        if (treeContainer.current) {
            const tree = new FamilyTree(treeContainer.current, {

                mouseScroll: FamilyTree.none,
                mode: 'light',
                //miniMap: true,
                template: 'hugo',
                roots: [],
                nodeMenu: {
                    edit: {text: 'Modifier'},
                    details: {text: 'Détails'},
                },
                nodeTreeMenu: true,
                nodeBinding: nodeBinding,
                toolbar: {
                    layout: false,
                    zoom: true,
                    fit: true,
                    expandAll: false,
                    fullScreen: false
                },
                lazyLoading: true,
                nodeContextMenu: {
                    myMenuItem: {text:"My node menu Item", onClick: () => {}},
                },
                filterBy: ['name', 'gender', 'country'],
                /*filterBy: {
                    name: { 'femme 2': { checked: false, text: 'My text 2'} },
                    title: {}
                },*/
                editForm: {
                    readOnly: !isOwner, // Si isOwner est false, alors readOnly est true
                    titleBinding: "name",
                    photoBinding: "photo",
                    addMoreBtn: 'Ajouter élement',
                    addMore: 'Ajouter elements en plus',
                    addMoreFieldName: 'Element name',
                    saveAndCloseBtn: 'Confirmer',
                    generateElementsFromFields: false,
                    elements: [
                        {type: 'textbox', label: 'Full Name', binding: 'name'},
                        {type: 'textbox', label: 'Email Address', binding: 'email'},
                        [
                            {type: 'textbox', label: 'Phone', binding: 'phone'},
                            {type: 'date', label: 'Date Of Birth', binding: 'born'}
                        ],
                        [
                            {
                                type: 'select',
                                options: [{value: 'bg', text: 'Bulgaria'}, {value: 'ru', text: 'Russia'}, {
                                    value: 'gr',
                                    text: 'Greece'
                                }],
                                label: 'Country',
                                binding: 'country'
                            },
                            {type: 'textbox', label: 'City', binding: 'city'},
                        ],
                        {type: 'textbox', label: 'Photo Url', binding: 'photo', btn: 'Upload'},

                    ]
                },
                nodes: data
            });

            setTreeInstance(tree);
        }
    }, [treeContainer, isOwner]);

    useEffect(() => {
        if (treeInstance) {
            /*treeInstance.on('nodeAdd', (node) => {
                console.log('add node', node);
                addNode(node);
            });*/
            treeInstance.on('update', (nodeId, node) => {
                console.log('edit node', node);
                editNode(nodeId, node);
            });
            /*treeInstance.on('nodeDelete', (nodeId) => {
                console.log('delete node', nodeId);
                deleteNode(nodeId);
            });*/
        }
    }, [treeInstance]);
    const handleAddMember = async (data) => {
        try {
            const response = await dispatch(addMemberToTreeAction({ data }));
            console.log("Réponse handleAddMember =>", response);
            if(response) {
                handleServerError(response);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du membre:", error);
            handleServerError(error);
        }
    }
    useEffect(() => {
        if (treeDataFromRedux) {
            setData([...treeDataFromRedux]); // Créez une copie des données
        }
    }, [treeDataFromRedux]);

    useEffect(() => {
        if (treeInstance && data.length > 0) {
            treeInstance.load(data);
        }
    }, [treeInstance, data]);

    return <div id="tree" ref={treeContainer} className={isOwner ? 'owner' : 'viewer'}></div>; // Rendu du conteneur avec la référence
};

export default FamilyTreeComponent;
