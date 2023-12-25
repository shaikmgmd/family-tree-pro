import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Row, Col, Space, Modal} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import {getConnectedUserAction, updateUserAction} from "../../store/features/slices/user";
import {toast} from "react-toastify";
import {FTProLoader} from "../../components/loader/FTProLoader";


const Profile = () => {
    const user = useSelector((state) => state.user.getConnectedUser.payload);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState('');

    const showModal = (imageUrl) => {
        setCurrentImage(imageUrl);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const phone = e.target.phone.value;
        const address = e.target.address.value;
        const email = e.target.email.value;
        const values = {phone, address, email};
        await dispatch(updateUserAction({payload: values}));
        toast.success("Votre profil a été mis à jour !", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <MainWrapper title={"Mon Profil"} description={"Consultez ou modifiez votre profil :"}>
            {!user ? (
                <FTProLoader/>
            ) : (
                <>
                    {/* Section pour les boutons 'Voir CNI' et 'Voir Photo' */}
                    <form onSubmit={handleSubmit}
                          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                        {/* Nom de famille et Prénom */}
                        <div className="-mx-3 md:flex mb-6">
                            <div>
                                {/* Modal pour afficher les images */}
                                <Modal
                                    title="Aperçu de l'image"
                                    visible={isModalVisible}
                                    onCancel={handleCancel}
                                    footer={null} // Pas de boutons en bas
                                >
                                    <img alt="Aperçu" src={currentImage} style={{width: '100%'}}/>
                                </Modal>
                            </div>
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="lastName">
                                    Nom de famille
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4"
                                    id="lastName" type="text" value={user.lastName} disabled/>
                            </div>
                            <div className="md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="firstName">
                                    Prénom
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4"
                                    id="firstName" type="text" value={user.firstName} disabled/>
                            </div>
                        </div>

                        {/* Numéro de sécurité sociale et Nationalité */}
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="socialSecurityNumber">
                                    Numéro de sécurité sociale
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4"
                                    id="socialSecurityNumber" type="text" value={user.socialSecurityNumber} disabled/>
                            </div>
                            <div className="md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="nationality">
                                    Nationalité
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4"
                                    id="nationality" type="text" value={user.nationality} disabled/>
                            </div>
                        </div>

                        {/* Code Public et Code Privé */}
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="publicCode">
                                    Code Public
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4"
                                    id="publicCode" type="text" value={user.publicCode} disabled/>
                            </div>
                            <div className="md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="privateCode">
                                    Code Privé
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4"
                                    id="privateCode" type="text" value={user.privateCode} disabled/>
                            </div>
                        </div>

                        {/* Adresse */}
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-full px-3">
                                <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                                       htmlFor="address">
                                    Adresse
                                </label>
                                <input
                                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                                    name="address" id="address" type="text" defaultValue={user.address}/>
                            </div>
                        </div>

                        {/* Téléphone et Email */}
                        <div className="-mx-3 md:flex mb-6">
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                                       htmlFor="phone">
                                    Téléphone
                                </label>
                                <input
                                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                                    name="phone" id="phone" type="text" defaultValue={user.phone}/>
                            </div>
                            <div className="md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                                       htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                                    name="email" id="email" type="email" defaultValue={user.email}/>
                            </div>
                        </div>

                        {/* Boutons */}
                        <div className="-mx-3 md:flex mt-6">
                            <div className="flex justify-start my-4 w-full">
                                <button type="button"
                                        style={{
                                            backgroundColor: '#A4B631',
                                            borderColor: '#A4B631'
                                        }}
                                        className="shadow hover:bg-green-700 mr-3 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9CA82B'} // Couleur légèrement plus claire au survol
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#A4B631'} // Couleur originale lorsque la souris n'est plus dessus
                                        onClick={() => showModal(user.idCardPath)}>Voir CNI
                                </button>
                                <button type="button" style={{
                                    backgroundColor: '#A4B631',
                                    borderColor: '#A4B631'
                                }}
                                        className="shadow hover:bg-green-700 mr-3 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9CA82B'} // Couleur légèrement plus claire au survol
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#A4B631'} // Couleur originale lorsque la souris n'est plus dessus
                                        onClick={() => showModal(user.photoPath)}>Voir Photo
                                </button>
                            </div>

                            {/* Bouton de soumission */}
                            <div className="md:w-full px-3 text-right">
                                <button type="submit"
                                        style={{
                                            backgroundColor: '#4CC425',
                                            borderColor: '#4CC425'
                                        }}
                                        className="shadow hover:bg-green-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3da035'}  // Couleur plus foncée au survol
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CC425'} // Couleur originale lorsque la souris n'est plus dessus
                                >
                                    Mettre à jour
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            )
            }
        </MainWrapper>
    );
}

export default Profile;
