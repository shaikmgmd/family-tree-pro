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

    const editExistingNode = (nodeId, email) => {
        // Simuler un appel API pour éditer un nœud
        handleExistingMember({nodeId, email}).then(async r => {
            await dispatch(getTreeByUserIdAction(userId?.id));
        });
    };

    useEffect(() => {
        if (treeContainer.current) {
            const tree = new FamilyTree(treeContainer.current, {
                mouseScroll: FamilyTree.none,
                mode: 'light',
                //miniMap: true,
                template: 'tommy',
                roots: [],
                nodeMenu: {
                    edit: {text: 'Modifier'},
                    details: {text: 'Détails'},
                },
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
                    addMoreBtn: 'Ajouter élement',
                    addMore: 'Ajouter elements en plus',
                    addMoreFieldName: 'Element name',
                    saveAndCloseBtn: 'Confirmer',
                    generateElementsFromFields: false,
                    buttons: {
                        addNewMember: {
                            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M168,56a8,8,0,0,1,8-8h16V32a8,8,0,0,1,16,0V48h16a8,8,0,0,1,0,16H208V80a8,8,0,0,1-16,0V64H176A8,8,0,0,1,168,56Zm62.56,54.68a103.92,103.92,0,1,1-85.24-85.24,8,8,0,0,1-2.64,15.78A88.07,88.07,0,0,0,40,128a87.62,87.62,0,0,0,22.24,58.41A79.66,79.66,0,0,1,98.3,157.66a48,48,0,1,1,59.4,0,79.66,79.66,0,0,1,36.06,28.75A87.62,87.62,0,0,0,216,128a88.85,88.85,0,0,0-1.22-14.68,8,8,0,1,1,15.78-2.64ZM128,152a32,32,0,1,0-32-32A32,32,0,0,0,128,152Zm0,64a87.57,87.57,0,0,0,53.92-18.5,64,64,0,0,0-107.84,0A87.57,87.57,0,0,0,128,216Z"></path></svg>`,
                            text: 'Add New Member',
                        },
                        addExistingMember: {
                            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64Zm8,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm104,48H40a8,8,0,0,0,0,16H144a8,8,0,0,0,0-16Zm88,0H216V168a8,8,0,0,0-16,0v16H184a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V200h16a8,8,0,0,0,0-16Z"></path></svg>`,
                            text: 'Add Existing Member',
                        },
                        edit: {
                            icon: <PencilSimple size={32} color="#ffffff"/>,
                            text: 'edit',
                        },
                    },
                    elements:
                        (modalMode === "newMember") || (modalMode === "edit") ? (
                            [
                                {type: 'textbox', label: 'Full Name', binding: 'name'},
                                {type: 'textbox', label: 'Email Address', binding: 'email'},
                                [
                                    {type: 'textbox', label: 'Phone', binding: 'phone',},
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

                            ]) : (
                            [
                                {type: 'textbox', label: 'Email Address', binding: 'email'},
                            ])
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


            treeInstance.editUI.on('button-click', function (sender, args) {
                if (args.name === 'addNewMember') {
                    var data = treeInstance.get(args.nodeId);
                    setModalMode("newMember")
                    treeInstance.editUI.show(args.nodeId);
                } else if (args.name === 'addExistingMember') {
                    var data = treeInstance.get(args.nodeId);
                    setModalMode("existingMember")
                    treeInstance.editUI.show(args.nodeId);
                } else if (args.name === 'newMember') {
                    var data = treeInstance.get(args.nodeId);
                    setModalMode("edit")
                    treeInstance.editUI.show(args.nodeId);
                }


            });


            console.log(modalMode)
            /*treeInstance.on('nodeAdd', (node) => {
                console.log('add node', node);
                addNode(node);
            });*/
            treeInstance.on('update', (nodeId, node) => {
                console.log('edit node', node);
                if (modalMode === "newMember" || modalMode === "edit") {
                    editNode(nodeId, node);
                } else {
                    // editNode(nodeId, node);
                    editExistingNode(node.updateNodesData[0].id, node.updateNodesData[0].email);
                    setModalMode("edit")
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
                        tags: [getBorderTag(node?.name)] // Ajoutez les tags en fonction du nom
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
