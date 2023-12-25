import React, {useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import {Modal, Button, Switch} from 'antd';
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import AddMemberForm from "./AddMemberForm";
import {addMemberToTreeAction, getTreeByUserIdAction} from "../../store/features/slices/tree";
import {useDispatch, useSelector} from "react-redux";
import ExistingMemberForm from "./ExistingMemberForm";
import './custom-tree.css'
import {Circles} from "react-loader-spinner";
import {FTProLoader} from "../../components/loader/FTProLoader";
import FamilyTreeComponent from "./FamilyTreeComponent";
import {getConnectedUserAction} from "../../store/features/slices/user";

const FamilyTree = ({userId}) => {
    const [treeData, setTreeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('newMember');  // 'newMember' ou 'existingMember'

    const dispatch = useDispatch();
    const tree = useSelector((state) => state.tree.getUserTree.payload);
    const user = useSelector((state) => state.user.getConnectedUser);

    const getDynamicPathClass = ({source, target}, orientation) => {
        if (!target.children) {
            return 'link__to-leaf';
        }
        return 'link__to-branch';
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const fetcher = async () => {
        try {
            setIsLoading(true);
            await dispatch(getConnectedUserAction()).then(async (res) => {
                await dispatch(getTreeByUserIdAction(res.payload.id));
            })
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


    const handleAddMember = async (data) => {
        try {
            const response = await dispatch(addMemberToTreeAction({sourceMemberId: selectedNodeId, data}));
            console.log("response", response)
            fetcher();
            setIsModalVisible(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout du membre:", error);
        }
    }

    const nodeStyleCallback = (nodeData) => {
        return {
            circle: {
                fill: nodeData.data.isRegistered ? '#28a745' : '#dc3545' // Vert pour inscrit, Rouge pour non-inscrit
            },
            // autres styles si nécessaire
        };
    };



    return (
        <MainWrapper title={"Votre arbre généalogique"}
                     description={"Consultez ou modifiez votre arbre généalogique :"}>
            {isLoading ? (
                <FTProLoader />
            ) : tree && (
                <div id="treeWrapper" style={{ width: '100%', height: '100%' }}>
                    <FamilyTreeComponent isOwner={true} />
                </div>

            )}
            <Modal title={
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className="mb-5">
                    <span>Ajouter un membre</span>
                    <Switch
                        style={switchStyle}
                        checked={modalMode === 'newMember'}
                        onChange={checked => setModalMode(checked ? 'newMember' : 'existingMember')}
                        checkedChildren="Nouveau membre"
                        unCheckedChildren="Membre existant"
                        className="mr-6"
                    />
                </div>
            } visible={isModalVisible} onCancel={handleCancel} footer={null}>
                {
                    modalMode === 'newMember' ? (
                        <AddMemberForm nodeId={selectedNodeId} onSubmit={handleAddMember}/>
                    ) : (
                        <ExistingMemberForm nodeId={selectedNodeId} onSubmit={handleAddMember}/>
                    )
                }

            </Modal>
        </MainWrapper>
    );
}

export default FamilyTree;

/*<Tree data={convertToTreeData(tree)} nodeSvgShape={{shape: 'circle'}} nodeSize={{x: 200, y: 200}}
      styles={{ nodes: { node: { circle: { fill: "#fff" } } }}}
      pathFunc="straight" orientation="vertical"
      allowForeignObjects nodeLabelComponent={{
    /!*render: <MyCustomLabelComponent />, // Ton composant personnalisé pour les étiquettes*!/
    foreignObjectWrapper: { x: 10, y: 10 }
}}
      transitionDuration={0}
      nodeSvgShape={{ shape: 'circle', shapeProps: { r: 10 } }}
      rootNodeClassName="node__root"
      branchNodeClassName="node__branch"
      leafNodeClassName="node__leaf"
      nodeStyle={nodeStyleCallback}
      pathClassFunc={getDynamicPathClass}
      translate={{x: window.innerWidth / 3.5, y: window.innerHeight / 3}}
      onNodeClick={node => {
          setSelectedNodeId(node.data.attributes.id);
          showModal();
      }}
/>*/
