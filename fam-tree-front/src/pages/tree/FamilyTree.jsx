import React, {useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import {Modal, Button, Divider} from 'antd';
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import AddMemberForm from "./AddMemberForm";
import {
    addMemberToTreeAction,
    getBfsAction,
    getDfsAction,
    getTreeByUserIdAction
} from "../../store/features/slices/tree";
import {useDispatch, useSelector} from "react-redux";
import ExistingMemberForm from "./ExistingMemberForm";
import './custom-tree.css'
import {Circles} from "react-loader-spinner";
import {FTProLoader} from "../../components/loader/FTProLoader";
import FamilyTreeComponent from "./FamilyTreeComponent";
import ErrorBornDateButton from "../../components/button/ErrorBornDateButton";
import ErrorBornDate from "./ErrorBornDate";
import {getConnectedUserAction} from "../../store/features/slices/user";
import FTProGlassButton from "../../components/button/FTProGlassButton";
import FTProFancyButton from "../../components/button/FTProFancyButton";
import FTProButton from "../../components/button/FTProButton";
import { TailSpin } from 'react-loader-spinner';

const FamilyTree = ({userId}) => {
    const [treeData, setTreeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('newMember');  // 'newMember' ou 'existingMember'

    const [isAlgorithmsModalVisible, setIsAlgorithmsModalVisible] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);


    const dispatch = useDispatch();
    const tree = useSelector((state) => state.tree.getUserTree.payload);
    const user = useSelector((state) => state.user.getConnectedUser);

    const {treeDFS, treeBFS} = useSelector((state) => state.tree);

    const [showErrorBornDate, setShowErrorBornDate] = useState(false);

    const [showLoader, setShowLoader] = useState(false);

    const showAlgorithmsModal = () => {
        setIsAlgorithmsModalVisible(true);
    };

    const handleAlgorithmClick = (algorithm) => {
        setShowLoader(true);
        setSelectedAlgorithm(null);

        setTimeout(() => {
            setSelectedAlgorithm(algorithm);
            setShowLoader(false);
        }, 1500);
    };

    const handleAlgorithmsModalClose = () => {
        setIsAlgorithmsModalVisible(false);
        setSelectedAlgorithm(null);
    };

    const fetcher = async () => {
        try {
            setIsLoading(true);
            await dispatch(getConnectedUserAction()).then(async (res) => {
                await dispatch(getTreeByUserIdAction(res.payload.id));
            })
            await dispatch(getBfsAction());
            await dispatch(getDfsAction());
        } catch (error) {
            console.error("Erreur lors de la récupération de l'arbre:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const switchStyle = modalMode !== 'newMember'
        ? {color: 'black', backgroundColor: 'gray'}
        : {};

    useEffect(() => {
        fetcher();
    }, [userId, dispatch]);

    const convertToTreeData = (node) => {
        return {
            name: node.member.name,
            attributes: {isRegistered: node.member.user !== null, id: node.member.id},
            children: node.children?.map(child => convertToTreeData(child)).filter(Boolean)
        };
    };

    const handleError = (isError) => {
        setShowErrorBornDate(isError);
    }

    const handleHideError = () => {
        setShowErrorBornDate(false);
    };

    const renderAlgorithmResults = (algorithm) => {
        const data = algorithm === 'DFS' ? treeDFS?.payload : treeBFS?.payload;
        if (!data) {
            return <p>Aucunes données</p>;
        }

        return (
            <>
                <Divider/>
                <div>
                    <p>{getAlgorithmExplanation(algorithm)}</p>
                    <Divider/>
                    <h3 className="font-semibold mb-3">Résultat de l'algorithme {algorithm} :</h3>
                    <ul>
                        {data.map((person, index) => person && <li key={index}>{person.name}</li>)}
                    </ul>

                </div>
            </>

        );
    };

    const getAlgorithmExplanation = (algorithm) => {
        if (algorithm === 'DFS') {
            return "DFS (Depth-First Search) explore aussi loin que possible le long de chaque branche avant de revenir en arrière. Cette liste montre l'ordre de parcours du nœud racine vers le bas à travers ses descendants dans un mouvement de profondeur vers le haut";
        } else if (algorithm === 'BFS') {
            return "BFS (Breadth-First Search) explore tous les nœuds voisins à la profondeur actuelle avant de passer aux nœuds du niveau de profondeur suivant. Cette liste montre l'ordre de parcours à travers la largeur de l'arbre";
        }
    };

    return (
        <MainWrapper title={"Votre arbre généalogique"}
                     description={"Consultez ou modifiez votre arbre généalogique :"}
                     buttonComponent={<FTProButton noMarginTop content="Algorithmes" onClick={showAlgorithmsModal}/>}>
            {showErrorBornDate && <ErrorBornDate onHide={handleHideError}/>}
            {isLoading ? (
                <FTProLoader/>
            ) : tree && (
                <div id="treeWrapper" style={{width: '100%', height: '100%'}}>
                    <FamilyTreeComponent familytree_id={1} isOwner={true} handleError={handleError}/>
                </div>

            )}
            <Modal
                title="Choisissez un algorithme"
                visible={isAlgorithmsModalVisible}
                onCancel={handleAlgorithmsModalClose}
                footer={null}
            >
                <div className="flex justify-center items-center space-x-3 mt-4">
                    <FTProGlassButton content="DFS" onClick={() => handleAlgorithmClick('DFS')}/>
                    <FTProGlassButton content="BFS" onClick={() => handleAlgorithmClick('BFS')}/>
                </div>
                {showLoader && <div className="flex justify-center my-4"><TailSpin color="#4CC425" height={80} width={80} /></div>}
                {!showLoader && selectedAlgorithm && renderAlgorithmResults(selectedAlgorithm)}
            </Modal>

        </MainWrapper>
    );
}

export default FamilyTree;