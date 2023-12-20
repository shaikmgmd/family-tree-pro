import React from 'react';
import {Divider} from "antd";
import { ReactComponent as FamilyIcon} from "../../assets/ui/svg/presentation/family.svg";
import { ReactComponent as ProfilesIcon} from "../../assets/ui/svg/presentation/profiles.svg";
import { ReactComponent as PersonalizationIcon} from "../../assets/ui/svg/presentation/personalization.svg";
import { ReactComponent as ConnectionIcon} from "../../assets/ui/svg/presentation/connection.svg";
import { ReactComponent as MemoriesIcon} from "../../assets/ui/svg/presentation/memories.svg";
import { ReactComponent as AnalyticsIcon} from "../../assets/ui/svg/presentation/analytics.svg";
import { ReactComponent as CollaborationIcon} from "../../assets/ui/svg/presentation/collaboration.svg";
const Presentation = () => {
    return (
        <div className="flex flex-col h-auto p-10 bg-gray-100 overflow-y-scroll">
            <div className="text-center mb-5">
                <h1 className="text-4xl font-bold mb-2">Arbre Généalogique</h1>
                <h2 className="text-2xl font-semibold">Pro++</h2>
                <p className="text-xl mt-4">2023-2024</p>
            </div>
            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Section 1 */}
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3">Bienvenue sur Arbre Généalogique Pro++</h3>
                    <p className="text-lg">Votre portail pour explorer et partager votre histoire familiale.
                        Découvrez un moyen interactif et convivial pour créer et manipuler des arbres généalogiques.</p>
                </div>
                <div className="flex justify-center items-center">
                    <FamilyIcon />
                </div>

                {/* Section 2 */}
                <div className="flex justify-center items-center order-last md:order-none">
                    <ProfilesIcon />
                </div>
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3">Catalogue des Utilisateurs</h3>
                    <p className="text-lg">Rejoignez notre communauté. Gérez votre profil, partagez des histoires,
                        et connectez-vous avec d'autres passionnés de généalogie.</p>
                </div>

                {/* Section 1 */}
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3">Fonctionnalités de l'Arbre</h3>
                    <p className="text-lg">Créez et personnalisez votre arbre généalogique. Ajoutez des membres de la famille,
                        modifiez des détails, et gardez une trace de votre héritage familial.</p>
                </div>
                <div className="flex justify-center items-center">
                    <PersonalizationIcon />
                </div>

                {/* Section 2 */}
                <div className="flex justify-center items-center order-last md:order-none">
                    <ConnectionIcon />
                </div>
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3">Interactivité entre Arbres</h3>
                    <p className="text-lg">Explorez les connexions et découvrez des liens inattendus.
                        Partagez des informations avec d'autres arbres pour une expérience enrichissante.</p>
                </div>

                {/* Section 1 */}
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3">Partage de Souvenirs</h3>
                    <p className="text-lg">Échangez des photos, des histoires, et des souvenirs.
                        Renforcez les liens familiaux en partageant votre patrimoine.</p>
                </div>
                <div className="flex justify-center items-center">
                    <MemoriesIcon />
                </div>

                {/* Section 2 */}
                <div className="flex justify-center items-center order-last md:order-none">
                    <AnalyticsIcon />
                </div>
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3">Statistiques & Insights</h3>
                    <p className="text-lg">Suivez l'engagement et les interactions avec votre arbre.
                        Apprenez comment votre famille et vos amis interagissent avec votre histoire.</p>
                </div>

                {/* Section 1 */}
                <div className="flex flex-col justify-center items-start">
                    <h3 className="text-3xl font-bold mb-3">Notre Engagement</h3>
                    <p className="text-lg">Notre mission est de vous fournir un outil puissant et facile à utiliser pour explorer votre généalogie.
                        Nous sommes dédiés à l'amélioration continue et à l'écoute de vos besoins.</p>
                </div>
                <div className="flex justify-center items-center">
                    <CollaborationIcon />
                </div>

                {/* Répétez le motif ci-dessus pour autant de sections que nécessaire */}
            </div>
        </div>
    );
}

export default Presentation;
