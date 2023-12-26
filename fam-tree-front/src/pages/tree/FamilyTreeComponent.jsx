import React, {useEffect, useRef, useState} from 'react';
import FamilyTree from '@balkangraph/familytree.js';
import {useDispatch, useSelector} from "react-redux";
import './familyTreeComp.css'
import {addMemberToTreeAction, getTreeByUserIdAction} from "../../store/features/slices/tree";
import { useNavigate } from 'react-router-dom';
import {
    addExistingMemberToTreeAction,
    addMemberToTreeAction,
    getTreeByUserIdAction
} from "../../store/features/slices/tree";
import familyTree from "./FamilyTree";
import {addExistingUserOnTree} from "../../api/feature/tree";

const FamilyTreeComponent = ({familytree_id, isOwner, handleError}) => {
    const treeContainer = useRef(null); // Création d'une référence au conteneur
    const treeDataFromRedux = useSelector((state) => state.tree.getUserTree.payload);
    const userId = useSelector((state) => state.user.getConnectedUser.payload.id);
    const [treeInstance, setTreeInstance] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const [modalMode, setModalMode] = useState("edit")

    const myRef = useRef();
    const [treeOptions, setTreeOptions] = useState({
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
                    icon: 'Add Member',
                    text: 'addNewMember',
                },
                addExistingMember: {
                    icon: 'Add existing member',
                    text: 'addExistingMember',
                },
                edit: {
                    icon: 'Edit',
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

    useEffect(() => {
        const newRoots = findUserAndParentRoots(data, userId);
        setTreeOptions(currentOptions => ({
            ...currentOptions,
            roots: newRoots,
        }));
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

    const treeFetcher = async () => {
        await dispatch(getTreeByUserIdAction(familytree_id));
    }
    useEffect(() => {
        if (familytree_id) {
            treeFetcher();
        }
    }, [dispatch, familytree_id]);


    // function editHandler(nodeId) {
    //     console.log("nodeId",nodeId);
    //     var nodeData = treeInstance.current.get(nodeId);
    //     console.log("nodeData",nodeData);
    // }

    const editNode = (nodeId, updatedNode) => {
        // Simuler un appel API pour éditer un nœud
        try {
            handleAddMember({updatedNode}).then(async r => {
                console.log("Response =>", r);
                await dispatch(getTreeByUserIdAction(userId)); // familytree_id à la place du 1 ?? -> demander à shaikh
            });
        }catch (error) {
            handleServerError(error);
        }
    };

    const editExistingNode = (nodeId, email) => {
        // Simuler un appel API pour éditer un nœud
        handleExistingMember({email}).then(async r => {
            console.log("Response =>", r);
            await dispatch(getTreeByUserIdAction(userId));
        });
    };

    useEffect(() => {
        if (treeContainer.current) {

            const tree = new FamilyTree(treeContainer.current, treeOptions);

            setTreeInstance(tree);
        }
    }, [treeContainer, modalMode, isOwner]);


    function editHandler(nodeId) {
        if (treeInstance) {
            console.log("nodeId", nodeId);
            var nodeData = treeInstance.current.get(nodeId);
            console.log("nodeData", nodeData);
        } else {
            console.log("L'instance de l'arbre n'est pas encore prête.");
        }
    }


    const handleAddMember = async (data) => {
        try {
            const response = await dispatch(addMemberToTreeAction({data}));
            console.log("response handleAddMember =>", response.data)
        } catch (error) {
            console.error("Erreur lors de l'ajout du membre:", error);
        }
    }


    const handleExistingMember = async (data) => {
        try {
            const response = await dispatch(addExistingMemberToTreeAction({data}));
            console.log("response handleAddExistingMember =>", response.data)
        } catch (error) {
            console.error("Erreur lors de l'ajout du membre:", error);
        }
    }

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
                    editNode(nodeId, node);
                    editExistingNode(nodeId, node.updateNodesData[0].email);
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
            try {
                treeInstance.load(data);
            } catch (error) {
                console.error('Error initializing FamilyTree:', error);
            }
        }
    }, [treeInstance, data, userId]);

    return <div id="tree" ref={treeContainer} className={isOwner ? 'owner' : 'viewer'}></div>;
};

export default FamilyTreeComponent;
