import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Row, Col, Space, Modal} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import {getConnectedUserAction, updateUserAction} from "../../store/features/slices/user";
import {toast} from "react-toastify";
import {FTProLoader} from "../../components/loader/FTProLoader";
import FTProGlassButton from "../../components/button/FTProGlassButton";
import FTProButton from "../../components/button/FTProButton";
import {GenderFemale, GenderMale} from "@phosphor-icons/react";


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
        <MainWrapper title={"Mon Profil"} description={"Consultez ou modifiez votre profil :"} buttonComponent={<div
            className="flex justify-center mb-4">
            {user?.gender === "male" ? (<span
                className={`p-2 rounded-md bg-green-ftpro hover:bg-green-ftpro-h transition-all`}
            >
                <GenderMale size={32} color="#ffffff"/>
            </span>) : (<span
                className={`p-2 rounded-md bg-green-ftpro hover:bg-green-ftpro-h transition-all`}
            >
                <GenderFemale size={32} color="#ffffff"/>
            </span>)}
        </div>}>
            {!user ? (
                <FTProLoader/>
            ) : (
                <>
                    {/* Section pour les boutons 'Voir CNI' et 'Voir Photo' */}
                    <form onSubmit={handleSubmit}
                          className="bg-white shadow-md rounded px-8 pt-6 pb-5 mb-4 flex flex-col my-2">
                        {/* Nom et Prénom */}
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

                            {/* Nom */}
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0 relative">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="lastName">
                                    Nom
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M256,136a8,8,0,0,1-8,8H200a8,8,0,0,1,0-16h48A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #lastName:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-500 focus:border-green-600 border border-gray-200 rounded py-3 px-4 pl-12"
                                        id="lastName" type="text" value={user.lastName} disabled
                                    />
                                </div>
                            </div>

                            {/* Prénom */}
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0 relative">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="firstName"
                                >
                                    Prénom
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #firstName:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 pl-12"
                                        id="firstName" type="text" value={user.firstName} disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Numéro de sécurité sociale et Nationalité */}
                        <div className="-mx-3 md:flex mb-6">
                            {/* Numéro de sécurité sociale */}
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0 relative">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="socialSecurityNumber"
                                >
                                    Numéro de sécurité sociale
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M224,128a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM104,72H216a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16ZM216,184H104a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM43.58,55.16,48,52.94V104a8,8,0,0,0,16,0V40a8,8,0,0,0-11.58-7.16l-16,8a8,8,0,0,0,7.16,14.32ZM79.77,156.72a23.73,23.73,0,0,0-9.6-15.95,24.86,24.86,0,0,0-34.11,4.7,23.63,23.63,0,0,0-3.57,6.46,8,8,0,1,0,15,5.47,7.84,7.84,0,0,1,1.18-2.13,8.76,8.76,0,0,1,12-1.59A7.91,7.91,0,0,1,63.93,159a7.64,7.64,0,0,1-1.57,5.78,1,1,0,0,0-.08.11L33.59,203.21A8,8,0,0,0,40,216H72a8,8,0,0,0,0-16H56l19.08-25.53A23.47,23.47,0,0,0,79.77,156.72Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #socialSecurityNumber:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 pl-12"
                                        id="socialSecurityNumber" type="text" value={user.socialSecurityNumber} disabled
                                    />
                                </div>
                            </div>

                            {/* Nationalité */}
                            <div className="md:w-1/2 px-3 relative">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="nationality"
                                >
                                    Nationalité
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM101.63,168h52.74C149,186.34,140,202.87,128,215.89,116,202.87,107,186.34,101.63,168ZM98,152a145.72,145.72,0,0,1,0-48h60a145.72,145.72,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.79a161.79,161.79,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128ZM154.37,88H101.63C107,69.66,116,53.13,128,40.11,140,53.13,149,69.66,154.37,88Zm19.84,16h38.46a88.15,88.15,0,0,1,0,48H174.21a161.79,161.79,0,0,0,0-48Zm32.16-16H170.94a142.39,142.39,0,0,0-20.26-45A88.37,88.37,0,0,1,206.37,88ZM105.32,43A142.39,142.39,0,0,0,85.06,88H49.63A88.37,88.37,0,0,1,105.32,43ZM49.63,168H85.06a142.39,142.39,0,0,0,20.26,45A88.37,88.37,0,0,1,49.63,168Zm101.05,45a142.39,142.39,0,0,0,20.26-45h35.43A88.37,88.37,0,0,1,150.68,213Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #nationality:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 pl-12"
                                        id="nationality" type="text" value={user.nationality} disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Code Public et Code Privé */}
                        <div className="-mx-3 md:flex mb-6">
                            {/* Code Public */}
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0 relative">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="publicCode"
                                >
                                    Code Public
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #publicCode:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 pl-12"
                                        id="publicCode" type="text" value={user.publicCode} disabled
                                    />
                                </div>
                            </div>

                            {/* Code Privé */}
                            <div className="md:w-1/2 px-3 relative">
                                <label
                                    className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="privateCode"
                                >
                                    Code Privé
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #privateCode:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 pl-12"
                                        id="privateCode" type="text" value={user.privateCode} disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Adresse, Ville et Pays */}
                        <div className="-mx-3 md:flex mb-6">
                            { /* Adresse */}
                            <div className="md:w-1/3 px-3 relative">
                                <label
                                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="address">
                                    Adresse
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M83.19,174.4a8,8,0,0,0,11.21-1.6,52,52,0,0,1,83.2,0,8,8,0,1,0,12.8-9.6A67.88,67.88,0,0,0,163,141.51a40,40,0,1,0-53.94,0A67.88,67.88,0,0,0,81.6,163.2,8,8,0,0,0,83.19,174.4ZM112,112a24,24,0,1,1,24,24A24,24,0,0,1,112,112Zm96-88H64A16,16,0,0,0,48,40V64H32a8,8,0,0,0,0,16H48v40H32a8,8,0,0,0,0,16H48v40H32a8,8,0,0,0,0,16H48v24a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V40A16,16,0,0,0,208,24Zm0,192H64V40H208Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #address:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 pl-12 mb-3"
                                        name="address" id="address" type="text" defaultValue={user.address}
                                    />
                                </div>
                            </div>
                            {/* Ville */}
                            <div className="md:w-1/3 px-3 relative">
                                <label
                                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="city">
                                    Ville
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M230.76,51.73A8,8,0,0,0,224,48H32a8,8,0,0,0-5.41,13.9l42.09,38.57-42.56,46.1A8,8,0,0,0,32,160H165.62l-28.84,60.56a8,8,0,1,0,14.44,6.88l80-168A8,8,0,0,0,230.76,51.73ZM173.23,144h-123l35.61-38.57a8,8,0,0,0-.47-11.33L52.57,64H211.33Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #city:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 pl-12"
                                        id="city" name="city" type="text" defaultValue={user.city} disabled
                                    />
                                </div>
                            </div>
                            {/* Pays */}
                            <div className="md:w-1/3 px-3 relative">
                                <label
                                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="country">
                                    Pays
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M34.76,42A8,8,0,0,0,32,48V216a8,8,0,0,0,16,0V171.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V48A8,8,0,0,0,210.76,42c-28,24.23-51.72,12.49-79.21-1.12C103.07,26.76,70.78,10.79,34.76,42ZM208,164.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V51.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #country:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 pl-12"
                                        id="country" name="country" type="text" defaultValue={user.country} disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Téléphone et Email */}
                        <div className="-mx-3 md:flex mb-6">
                            {/* Téléphone */}
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0 relative">
                                <label
                                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="phone"
                                >
                                    Téléphone
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #phone:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 pl-12"
                                        name="phone" id="phone" type="text" defaultValue={user.phone}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="md:w-1/2 px-3 relative">
                                <label
                                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2 text-gray-500"
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                         xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                        <path
                                            d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path>
                                    </svg>
                                    <style>
                                        {`
                                            #email:focus {
                                                border-color: #4CC425;
                                                outline: none;
                                            }
                                        `}
                                    </style>
                                    <input
                                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 pl-12"
                                        name="email" id="email" type="email" defaultValue={user.email}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Boutons */}
                        <div className="-mx-3 md:flex mt-3">
                            <div className="flex gap-2 justify-between my-2 w-full">
                                <div className="space-x-2">
                                    <FTProGlassButton content="Voir CNI" noMarginTop
                                                      onClick={() => showModal(user.idCardPath)}/>
                                    <FTProGlassButton content="Voir Photo" noMarginTop
                                                      onClick={() => showModal(user.photoPath)}/>
                                </div>
                                <div className="px-3 text-right">
                                    <FTProButton content="Mettre à jour" type="submit" noMarginTop/>
                                </div>
                            </div>

                            {/* Bouton de soumission */}

                        </div>
                    </form>
                </>
            )
            }
        </MainWrapper>
    );
}

export default Profile;
