import React, {useEffect, useRef, useState} from 'react';
import FamilyTree from '@balkangraph/familytree.js';
import {useDispatch, useSelector} from "react-redux";
import './familyTreeComp.css'
import {useNavigate} from 'react-router-dom';
import {
    addExistingMemberToTreeAction,
    addMemberToTreeAction,
    getTreeByUserIdAction
} from "../../store/features/slices/tree";
import familyTree from "./FamilyTree";
import {addExistingUserOnTree} from "../../api/feature/tree";
import {PencilSimple} from "@phosphor-icons/react";
import {countriesSelect} from "../../utils/countriesSelect";

const FamilyTreeComponent = ({isOwner, handleError}) => {
    const treeContainer = useRef(null); // Création d'une référence au conteneur
    const treeDataFromRedux = useSelector((state) => state.tree.getUserTree.payload);
    const userId = useSelector((state) => state.user.getConnectedUser.payload);
    const [treeInstance, setTreeInstance] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const [modalMode, setModalMode] = useState("edit")

    useEffect(() => {
        /*const newRoots = findUserAndParentRoots(data, userId);
        setTreeOptions(currentOptions => ({
            ...currentOptions,
            roots: newRoots,
        }));*/
    }, [data, userId]);

    const findUserAndParentRoots = (data, userId) => {
        let roots = [userId]; // Commencez avec le userId connecté

        // Trouvez les parents du userId connecté
        const userNode = data.find(node => node.id === userId);
        if (userNode) {
            if (userNode.mid) roots.push(userNode.mid);
            if (userNode.fid) roots.push(userNode.fid);
        }

        return roots;
    };


    const getBorderTag = (name) => {
        if (name != null) {
            if (name.endsWith('_t')) {
                return 'border-t'; // Tag pour les noms finissant par '_t'
            } else if (name.endsWith('_f')) {
                return 'border-f'; // Tag pour les noms finissant par '_f'
            }
            return ''; // Pas de tag spécifique si le nom ne correspond pas
        }
    };

    // const getBorderTag = (isRegistered) => {
    //         if (isRegistered != null) {
    //             if (isRegistered) {
    //                 return 'border-t'; // Tag pour les noms finissant par '_t'
    //             } else {
    //                 return 'border-f'; // Tag pour les noms finissant par '_f'
    //             }
    //         }
    //     };

    const getVisibilityTag = (visibility, currentUser, protectedUser) => {
        if(visibility != null) {
            if(!currentUser) {
                if(visibility === "PRIVATE") {
                    return "visibility-blur";
                }
                if(visibility === "PROTECTED" && !protectedUser) {
                    return "visibility-blur";
                }
            }
        }
    }

    const handleServerError = (error) => {
        console.log("Erreur complète:", error);
        if (error.type ===
            "add-member-to-tree/fulfilled") {
            return;
        }
        if (error.payload.response.status === 400) {
            if (error.payload.response.data.content.includes("Relation parent-enfant invalide")) {
                setErrorMessage("La date de naissance de l'enfant est invalide par rapport à celle des parents.");
                handleError(true);
            } else {
                setErrorMessage("Une erreur inattendue est survenue.");
            }
        }
        console.log("Message d'erreur : " + errorMessage);
    }

    /*const treeFetcher = async () => {
        await dispatch(getTreeByUserIdAction(familytree_id));
    }
    useEffect(() => {
        if (familytree_id) {
            treeFetcher();
            return;
        }
    }, [dispatch, familytree_id]);*/


    // function editHandler(nodeId) {
    //     console.log("nodeId",nodeId);
    //     var nodeData = treeInstance.current.get(nodeId);
    //     console.log("nodeData",nodeData);
    // }

    const editNode = (nodeId, updatedNode) => {
        try {
            handleAddMember({updatedNode}).then(async r => {
                console.log({updatedNode})
                await dispatch(getTreeByUserIdAction(userId?.id));
            });
        } catch (error) {
            handleServerError(error);
        }
    };

    // const editExistingNode = (nodeId, email) => {
    //     // Simuler un appel API pour éditer un nœud
    //     handleExistingMember({nodeId, email}).then(async r => {
    //         await dispatch(getTreeByUserIdAction(userId?.id));
    //     });
    // };

    useEffect(() => {
        if (treeContainer.current) {
            const tree = new FamilyTree(treeContainer.current, {
                mouseScroll: FamilyTree.none,
                mode: 'light',
                //miniMap: true,
                template: 'tommy',
                roots: [],
                nodeTreeMenu: true,
                nodeBinding: {
                    field_0: 'name',
                    //field_1: 'born',
                    img_0: 'photo'
                },
                toolbar: {
                    layout: false,
                    zoom: true,
                    fit: true,
                    expandAll: false,
                    fullScreen: false
                },
                lazyLoading: true,
                nodeContextMenu: {
                    myMenuItem: {
                        text: "My node menu Item", onClick: () => {
                        }
                    },
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
                    addMoreBtn: null,
                    addMore: null,
                    addMoreFieldName: null,
                    saveAndCloseBtn: 'Confirmer',
                    generateElementsFromFields: false,
                    buttons: {
                        share: null
                    },
                    elements:
                            [
                                {type: 'textbox', label: 'Nom entier', binding: 'name'},
                                {type: 'textbox', label: 'Adresse email', binding: 'email'},
                                [
                                    {type: 'textbox', label: 'Numéro de tel.', binding: 'phone',},
                                    {type: 'date', label: 'Date de naissance', binding: 'born'}
                                ],
                                [
                                    {
                                        type: 'select',
                                        options: countriesSelect,
                                        label: 'Pays',
                                        binding: 'country'
                                    },
                                    {type: 'textbox', label: 'Ville', binding: 'city'},
                                ],
                                {type: 'textbox', label: 'Lien photo', binding: 'photo', btn: 'Upload'},

                                [{
                                    type: 'select',
                                    options: [
                                        {value: 'PUBLIC', text: 'Public'},
                                        {value: 'PRIVATE', text: 'Privée'},
                                        {value: 'PROTECTED', text: 'Protegée'}
                                    ],
                                    label: 'Visibilité',
                                    binding: 'visibility'
                                }]
                            ]
                },
                nodes: data
            });
            setTreeInstance(tree);
        }
    }, [treeContainer, modalMode, isOwner]);

    function editHandler(nodeId) {
        if (treeInstance) {
            var nodeData = treeInstance.current.get(nodeId);
        } else {
            console.log("L'instance de l'arbre n'est pas encore prête.");
        }
    }


    /*const handleAddMember = async (data) => {
        try {
            const response = await dispatch(addMemberToTreeAction({data}));
            console.log("response handleAddMember =>", response.data)
            await dispatch(getTreeByUserIdAction(userId));
        } catch (error) {
            console.error("Erreur lors de l'ajout du membre:", error);
        }
    }*/

    useEffect(() => {
        if (treeInstance) {


            // treeInstance.editUI.on('button-click', function (sender, args) {
            //     if (args.name === 'addNewMember') {
            //         var data = treeInstance.get(args.nodeId);
            //         setModalMode("newMember")
            //         treeInstance.editUI.show(args.nodeId);
            //     } else if (args.name === 'addExistingMember') {
            //         var data = treeInstance.get(args.nodeId);
            //         setModalMode("existingMember")
            //         treeInstance.editUI.show(args.nodeId);
            //     } else if (args.name === 'newMember') {
            //         var data = treeInstance.get(args.nodeId);
            //         setModalMode("edit")
            //         treeInstance.editUI.show(args.nodeId);
            //     }
            //
            //
            // });


            console.log(modalMode)
            /*treeInstance.on('nodeAdd', (node) => {
                console.log('add node', node);
                addNode(node);
            });*/
            treeInstance.on('update', (nodeId, node) => {
                console.log('edit node', node);
                if (modalMode === "newMember" || modalMode === "edit") {
                    editNode(nodeId, node);
                }
            });
            /*treeInstance.on('nodeDelete', (nodeId) => {
                console.log('delete node', nodeId);
                deleteNode(nodeId);
            });*/
        }
    }, [treeInstance, modalMode]);

    const handleAddMember = async (data) => {
        try {
            const response = await dispatch(addMemberToTreeAction({data}));
            await dispatch(getTreeByUserIdAction(userId?.id));
            if (response) {
                handleServerError(response);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du membre:", error);
            handleServerError(error);
        }
    }

    const handleExistingMember = async (data) => {
        try {
            console.log("data sent in handleExistingMember =>", data)
            const response = await dispatch(addExistingMemberToTreeAction({data}));
        } catch (error) {
            console.error("Erreur lors de l'ajout du membre:", error);
        }
    }

    useEffect(() => {
        if (treeDataFromRedux) {
            const updatedNodes = treeDataFromRedux.map(node => {
                    const cleanedName = node?.name?.slice(0, -2);
                    return {
                        ...node,
                        name: cleanedName,
                        tags: [getBorderTag(node?.name), getVisibilityTag(node?.visibility, node?.currentUser, node?.protectedUser)] // Ajoutez les tags en fonction du nom
                    }
                }
            );
            setData([...updatedNodes]); // Mettez à jour les données avec les nouveaux tags
        }
    }, []);

    useEffect(() => {
        if (treeInstance && data.length > 0) {
            treeInstance.load(data);
        }
    }, [treeInstance, data]);

    return <div id="tree" ref={treeContainer} className={isOwner ? 'owner' : 'viewer'}></div>;
};

export default FamilyTreeComponent;
