import React from 'react';
import {Divider} from "antd";
import {ReactComponent as FamilyIcon} from "../../assets/ui/svg/presentation/family.svg";
import {ReactComponent as ProfilesIcon} from "../../assets/ui/svg/presentation/profiles.svg";
import {ReactComponent as PersonalizationIcon} from "../../assets/ui/svg/presentation/personalization.svg";
import {ReactComponent as ConnectionIcon} from "../../assets/ui/svg/presentation/connection.svg";
import {ReactComponent as MemoriesIcon} from "../../assets/ui/svg/presentation/memories.svg";
import {ReactComponent as AnalyticsIcon} from "../../assets/ui/svg/presentation/analytics.svg";
import {ReactComponent as CollaborationIcon} from "../../assets/ui/svg/presentation/collaboration.svg";
import {ReactComponent as SupervisionIcon} from "../../assets/ui/svg/presentation/supervision.svg";
import {Link} from "react-router-dom";
import FTProButton from "../../components/button/FTProButton";
import {CaretDoubleRight} from "@phosphor-icons/react";

const Presentation = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    return (
        <div className="flex flex-col h-auto p-10 bg-gray-100 overflow-y-scroll">
            <div className="text-center mb-5">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-b from-green-500 to-slate-900 bg-clip-text text-transparent">Arbre
                    Généalogique</h1>
                <h2 className="text-2xl font-semibold bg-gradient-to-b from-green-500 to-slate-900 bg-clip-text text-transparent">Pro++</h2>
                <p className="text-xl mt-4 font-bold">2023-2024</p>
            </div>
            <Divider/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Section 1 */}
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-b from-green-500 to-slate-900 bg-clip-text text-transparent">Bienvenue
                        sur Arbre Généalogique Pro++</h3>

                    <p className="text-lg">Votre portail pour explorer et partager votre histoire familiale.
                        Découvrez un moyen interactif et convivial pour créer et manipuler des arbres
                        généalogiques.</p>
                    {userData && (
                        <div className="text-right">
                            <FTProButton content="En savoir plus" type="submit" link path={"/family-tree"}
                                         icon={<CaretDoubleRight size={18} color="#ffffff"/>} isReverse/>
                        </div>
                    )}

                </div>
                <div className="flex justify-center items-center">
                    <FamilyIcon/>
                </div>

                {/* Section 2 */}
                <div className="flex justify-center items-center order-last md:order-none">
                    <ProfilesIcon/>
                </div>
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-b from-green-500 to-slate-900 bg-clip-text text-transparent">Catalogue
                        des Utilisateurs</h3>
                    <p className="text-lg">Rejoignez notre communauté. Gérez votre profil, partagez des histoires,
                        et connectez-vous avec d'autres passionnés de généalogie.</p>
                    {userData && (
                        <div className="flex flex-col justify-end items-end w-full mt-3">
                            <div className="text-right">
                                <FTProButton content="En savoir plus" type="submit" link
                                             path={"/user/all-except-current"}
                                             icon={<CaretDoubleRight size={18} color="#ffffff"/>} isReverse/>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 1 */}
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-b from-green-500 to-slate-900 bg-clip-text text-transparent">Fonctionnalités
                        de l'Arbre</h3>
                    <p className="text-lg">Créez et personnalisez votre arbre généalogique. Ajoutez des membres de la
                        famille,
                        modifiez des détails, et gardez une trace de votre héritage familial.</p>
                    {userData && (
                        <div className="text-right">
                            <FTProButton content="En savoir plus" type="submit" link path={"/family-tree"}
                                         icon={<CaretDoubleRight size={18} color="#ffffff"/>} isReverse/>
                        </div>
                    )}
                </div>
                <div className="flex justify-center items-center">
                    <PersonalizationIcon/>
                </div>

                {/* Section 2 */}
                <div className="flex justify-center items-center order-last md:order-none">
                    <ConnectionIcon/>
                </div>
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-b from-green-500 to-slate-900 bg-clip-text text-transparent">Interactivité
                        entre Arbres</h3>
                    <p className="text-lg">Explorez les connexions et découvrez des liens inattendus.
                        Partagez des informations avec d'autres arbres pour une expérience enrichissante.</p>
                    {userData && (
                        <div className="flex flex-col justify-end items-end w-full mt-3">
                            <div className="text-right">
                                <FTProButton content="En savoir plus" type="submit" link path={"/family-tree"}
                                             icon={<CaretDoubleRight size={18} color="#ffffff"/>} isReverse/>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 1 */}
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-b from-green-500 to-slate-900 bg-clip-text text-transparent">Partage
                        de Souvenirs</h3>
                    <p className="text-lg">Échangez des photos, des histoires, et des souvenirs.
                        Renforcez les liens familiaux en partageant votre patrimoine.</p>
                    {userData && (
                        <div className="text-right">
                            <FTProButton content="En savoir plus" type="submit" link path={"/chat-list"}
                                         icon={<CaretDoubleRight size={18} color="#ffffff"/>} isReverse/>
                        </div>
                    )}
                </div>
                <div className="flex justify-center items-center">
                    <MemoriesIcon/>
                </div>

                {/* Section 2 */}
                <div className="flex justify-center items-center order-last md:order-none">
                    <AnalyticsIcon/>
                </div>
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-b from-green-500 to-slate-900 bg-clip-text text-transparent">Statistiques
                        & Insights</h3>
                    <p className="text-lg">Suivez l'engagement et les interactions avec votre arbre.
                        Apprenez comment votre famille et vos amis interagissent avec votre histoire.</p>
                    <div className="flex flex-col justify-end items-end w-full mt-3">
                        {userData && (
                            <div className="text-right">
                                <FTProButton content="En savoir plus" type="submit" link path={"/stats"}
                                             icon={<CaretDoubleRight size={18} color="#ffffff"/>} isReverse/>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 1 */}
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-b from-green-500 to-slate-900 bg-clip-text text-transparent">Supervision
                        des Tests API</h3>
                    <p className="text-lg">Accédez à une interface dédiée pour surveiller et vérifier les tests de l'API
                        de l'Arbre Généalogique. Cette section vous permet de visualiser en temps réel les performances,
                        les réponses et l'état de votre API.</p>
                    {userData && (
                        <div className="text-right">
                            <FTProButton content="En savoir plus" type="submit" link path={"/supervision-dashboard"}
                                         icon={<CaretDoubleRight size={18} color="#ffffff"/>} isReverse/>
                        </div>
                    )}
                </div>
                <div className="flex justify-center items-center">
                    <SupervisionIcon/>
                </div>

                {/* Section 2 */}
                <div className="flex justify-center items-center order-last md:order-none">
                    <CollaborationIcon/>
                </div>
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-b from-green-500 to-slate-900 bg-clip-text text-transparent">Notre
                        Engagement</h3>
                    <p className="text-lg">Notre mission est de vous fournir un outil puissant et facile à utiliser pour
                        explorer votre généalogie.
                        Nous sommes dédiés à l'amélioration continue et à l'écoute de vos besoins.</p>
                    <div className="flex flex-col justify-end items-end w-full mt-3">
                        {userData && (
                            <div className="text-right">
                                <FTProButton content="En savoir plus" type="submit" link path={"/family-tree"}
                                             icon={<CaretDoubleRight size={18} color="#ffffff"/>} isReverse/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default Presentation;
