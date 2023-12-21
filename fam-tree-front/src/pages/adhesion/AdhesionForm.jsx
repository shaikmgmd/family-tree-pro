import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Input, Button, Divider, Upload, Select} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {createAdhesionAction} from "../../store/features/slices/adhesion";
import axios from "axios";
import {toast} from "react-toastify";

const AdhesionSchema = Yup.object().shape({
    socialSecurityNumber: Yup.string().required('Requis'),
    lastName: Yup.string().required('Requis'),
    firstName: Yup.string().required('Requis'),
    birthDate: Yup.date().required('Requis'),
    nationality: Yup.string().required('Requis'),
    email: Yup.string().email('Email invalide').required('Requis'),
    idCardPath: Yup.mixed().required('Requis'),
    photoPath: Yup.mixed().required('Requis'),
});

export const AdhesionForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const {Option} = Select;
    const [idCardFile, setIdCardFile] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            socialSecurityNumber: '',
            lastName: '',
            firstName: '',
            birthDate: '',
            nationality: '',
            email: '',
            idCardPath: undefined,
            photoPath: undefined,
        },
        validationSchema: AdhesionSchema,
        onSubmit: async (values) => {
            values.status = 'PENDING';
            values.idCardPath = values.idCardPath.uid;
            values.photoPath = values.photoPath.uid;
            await dispatch(createAdhesionAction({payload: values}));
            toast.success("Votre demande d'adhésion a été crée!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate("/home");
        },
    });
    const fetchCountries = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            const countryData = response.data.map(country => ({name: country.name.common, code: country.alpha2Code}));
            setCountries(countryData);
        } catch (error) {
            console.error("Erreur lors de la récupération des pays:", error);
        }
    };
    useEffect(() => {
        fetchCountries();
    }, []);

    // Gérer le glisser-déposer
    const handleDrop = (event, setFileFunc, fieldName) => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            setFileFunc(file);
            formik.setFieldValue(fieldName, file);
        }
    };

    // Gérer les changements de fichier
    const handleFileChange = (e, setFileFunc) => {
        const file = e.target.files[0];
        if (file) {
            setFileFunc(file);  // Mettre à jour l'état local avec le fichier
            formik.setFieldValue(e.target.name, file);  // Mettre à jour les valeurs Formik
        }
    };

    // Générer l'URL de prévisualisation
    const getPreview = (file) => {
        return file ? URL.createObjectURL(file) : '';
    };

    // Fonction pour gérer la suppression de l'image
    const removeFile = (setFileFunc, fieldName) => {
        setFileFunc(null);
        formik.setFieldValue(fieldName, null);
    };

    // S'assurer de libérer les ressources lorsque le composant est démonté
    useEffect(() => {
        return () => {
            if (idCardFile) URL.revokeObjectURL(idCardFile.preview);
            if (photoFile) URL.revokeObjectURL(photoFile.preview);
        };
    }, [idCardFile, photoFile]);


    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-2">Demande d'adhésion</h1>
            <h2 className="italic text-sm">Veuillez remplir le formulaire suivant :</h2>
            <Divider/>
            {/*<form onSubmit={formik.handleSubmit}>*/}

            {/*    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">*/}
            {/*        <Input*/}
            {/*            name="firstName"*/}
            {/*            placeholder="Prénom"*/}
            {/*            onChange={formik.handleChange}*/}
            {/*            value={formik.values.firstName}*/}
            {/*            className={formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : ''}*/}
            {/*        />*/}
            {/*        <Input*/}
            {/*            name="lastName"*/}
            {/*            placeholder="Nom de famille"*/}
            {/*            onChange={formik.handleChange}*/}
            {/*            value={formik.values.lastName}*/}
            {/*            className={formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''}*/}
            {/*        />*/}
            {/*        <Input*/}
            {/*            className="col-span-2"*/}
            {/*            name="socialSecurityNumber"*/}
            {/*            placeholder="Numéro de sécurité sociale"*/}
            {/*            onChange={formik.handleChange}*/}
            {/*            value={formik.values.socialSecurityNumber}*/}
            {/*            className={formik.touched.socialSecurityNumber && formik.errors.socialSecurityNumber ? 'border-red-500' : ''}*/}
            {/*        />*/}
            {/*        <Input*/}
            {/*            name="email"*/}
            {/*            placeholder="Email"*/}
            {/*            onChange={formik.handleChange}*/}
            {/*            value={formik.values.email}*/}
            {/*            className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}*/}
            {/*        />*/}
            {/*        <Input*/}
            {/*            type="date"*/}
            {/*            name="birthDate"*/}
            {/*            placeholder="Date de naissance"*/}
            {/*            onChange={formik.handleChange}*/}
            {/*            value={formik.values.birthDate}*/}
            {/*            className={formik.touched.birthDate && formik.errors.birthDate ? 'border-red-500' : ''}*/}
            {/*        />*/}
            {/*        <Select*/}
            {/*            showSearch*/}
            {/*            placeholder="Nationalité"*/}
            {/*            name="nationality"*/}
            {/*            value={formik.values.nationality}*/}
            {/*            onChange={value => formik.setFieldValue('nationality', value)}*/}
            {/*            filterOption={(input, option) =>*/}
            {/*                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0*/}
            {/*            }*/}
            {/*            className={formik.touched.nationality && formik.errors.nationality ? 'border-red-500' : ''}*/}
            {/*        >*/}
            {/*            {countries.map(country => (*/}
            {/*                <Option key={country.code} value={country.name}>*/}
            {/*                    {country.name}*/}
            {/*                </Option>*/}
            {/*            ))}*/}
            {/*        </Select>*/}
            {/*    </div>*/}
            {/*    <Divider/>*/}
            {/*    <div>*/}
            {/*        <h1 className="text-2xl font-bold mb-2">Documents d'identité</h1>*/}
            {/*        <h2 className="italic text-sm mb-3">Veuillez fournir les pièces nécessaires :</h2>*/}
            {/*        <div className="flex flex-row space-x-5">*/}
            {/*            <div className="">*/}
            {/*                <Upload*/}
            {/*                    beforeUpload={file => {*/}
            {/*                        formik.setFieldValue("idCardPath", file);*/}
            {/*                        return false;*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    <Button icon={<UploadOutlined/>}>Charger la carte d'identité</Button>*/}
            {/*                </Upload>*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <Upload*/}
            {/*                    beforeUpload={file => {*/}
            {/*                        formik.setFieldValue("photoPath", file);*/}
            {/*                        return false;*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    <Button icon={<UploadOutlined/>}>Charger la photo</Button>*/}
            {/*                </Upload>*/}
            {/*            </div>*/}

            {/*        </div>*/}
            {/*        <div className="mt-4">*/}
            {/*            <Button type="default" htmlType="submit">*/}
            {/*                Envoyer*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</form>*/}

            <form onSubmit={formik.handleSubmit}
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                {/* Nom de famille et Prénom */}
                <div className="-mx-3 md:flex mb-6">
                    {/* Nom de famille */}
                    <div className="md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="lastName">
                            Nom de famille
                        </label>
                        <input
                            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                            id="lastName" name="lastName" type="text" onChange={formik.handleChange}
                            value={formik.values.lastName}/>
                    </div>
                    {/* Prénom */}
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="firstName">
                            Prénom
                        </label>
                        <input
                            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                            id="firstName" name="firstName" type="text" onChange={formik.handleChange}
                            value={formik.values.firstName}/>
                    </div>
                </div>

                {/* Numéro de sécurité sociale */}
                <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="socialSecurityNumber">
                            Numéro de sécurité sociale
                        </label>
                        <input
                            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                            id="socialSecurityNumber" name="socialSecurityNumber" type="text"
                            onChange={formik.handleChange} value={formik.values.socialSecurityNumber}/>
                    </div>
                </div>

                {/* Date de naissance, Nationalité, et Email */}
                <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-1/3 px-3">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="birthDate">
                            Date de naissance
                        </label>
                        <input
                            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                            type="date" id="birthDate" name="birthDate" onChange={formik.handleChange}
                            value={formik.values.birthDate}/>
                    </div>
                    <div className="md:w-1/3 px-3">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="nationality">
                            Nationalité
                        </label>
                        <select
                            className="block appearance-none w-full bg-white text-grey-darker border border-grey-lighter text-gray-700 py-3 px-4 pr-8 rounded"
                            id="nationality" name="nationality" onChange={formik.handleChange}
                            value={formik.values.nationality}>
                            {countries.map((country) => (
                                <option key={country.code} value={country.name}>{country.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:w-1/3 px-3">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="email">
                            Email
                        </label>
                        <input
                            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                            id="email" name="email" type="email" onChange={formik.handleChange}
                            value={formik.values.email}/>
                    </div>
                </div>

                {/* Documents d'identité */}
                {/* Note: This is a simple input for file, you might want to implement file handling logic */}
                {/*<div className="-mx-3 md:flex mb-6">*/}
                {/*    <div className="md:w-1/2 px-3 mb-6 md:mb-0">*/}
                {/*        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"*/}
                {/*               htmlFor="idCardPath">*/}
                {/*            Carte d'identité*/}
                {/*        </label>*/}
                {/*        <input*/}
                {/*            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"*/}
                {/*            id="idCardPath" name="idCardPath" type="file"*/}
                {/*            onChange={(event) => formik.setFieldValue('idCardPath', event.currentTarget.files[0])}/>*/}
                {/*    </div>*/}
                {/*    <div className="md:w-1/2 px-3">*/}
                {/*        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"*/}
                {/*               htmlFor="photoPath">*/}
                {/*            Photo*/}
                {/*        </label>*/}
                {/*        <input*/}
                {/*            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"*/}
                {/*            id="photoPath" name="photoPath" type="file"*/}
                {/*            onChange={(event) => formik.setFieldValue('photoPath', event.currentTarget.files[0])}/>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <Divider/>
                {/* Champ de téléchargement de la carte d'identité */}
                <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0 relative">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold"
                                   htmlFor="idCardPath">
                                Carte d'identité
                            </label>
                            {idCardFile && (
                                <div className="flex items-center text-xs text-gray-600">
                                    {idCardFile.name}
                                    <span className="ml-2 cursor-pointer text-red-500"
                                          onClick={(e) => {
                                              e.stopPropagation(); // Prevent click from propagating
                                              removeFile(setIdCardFile, 'idCardPath');
                                          }}>X</span>
                                </div>
                            )}
                        </div>
                        <div
                            className="w-full p-4 bg-grey-lighter text-grey-darker border border-grey-lighter rounded cursor-pointer"
                            onClick={() => document.getElementById('idCardPath').click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, setIdCardFile, 'idCardPath')}>
                            {idCardFile ? (
                                <div className="flex justify-center items-center h-48"> {/* Adjust height as needed */}
                                    <img src={getPreview(idCardFile)} alt="Aperçu de la carte d'identité"
                                         className="max-h-full max-w-full object-contain"/>
                                </div>
                            ) : (
                                <p>Glissez votre carte d'identité ici ou cliquez pour sélectionner un fichier</p>
                            )}
                            <input id="idCardPath" name="idCardPath" type="file" className="hidden"
                                   onChange={(e) => handleFileChange(e, setIdCardFile)}/>
                        </div>
                    </div>


                    {/* Champ de téléchargement de la photo */}
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0 relative">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold"
                                   htmlFor="photoPath">
                                Photo
                            </label>
                            {photoFile && (
                                <div className="flex items-center text-xs text-gray-600">
                                    {photoFile.name}
                                    <span className="ml-2 cursor-pointer text-red-500"
                                          onClick={(e) => {
                                              e.stopPropagation(); // Prevent click from propagating
                                              removeFile(setPhotoFile, 'photoPath');
                                          }}>X</span>
                                </div>
                            )}
                        </div>
                        <div
                            className="w-full p-4 bg-grey-lighter text-grey-darker border border-grey-lighter rounded cursor-pointer"
                            onClick={() => document.getElementById('photoPath').click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, setPhotoFile, 'photoPath')}>
                            {photoFile ? (
                                <div className="flex justify-center items-center h-48"> {/* Adjust height as needed */}
                                    <img src={getPreview(photoFile)} alt="Aperçu de la photo"
                                         className="max-h-full max-w-full object-contain"/>
                                </div>
                            ) : (
                                <p>Glissez votre photo ici ou cliquez pour sélectionner un fichier</p>
                            )}
                            <input id="photoPath" name="photoPath" type="file" className="hidden"
                                   onChange={(e) => handleFileChange(e, setPhotoFile)}/>
                        </div>
                    </div>

                </div>

                {/* Bouton de soumission */}
                <div className="-mx-3 md:flex mt-6">
                    <div className="md:w-full px-3 text-right">
                        <button type="submit" style={{backgroundColor: '#4CC425', borderColor: '#4CC425'}}
                                className="shadow hover:bg-green-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
                            Soumettre la demande
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
