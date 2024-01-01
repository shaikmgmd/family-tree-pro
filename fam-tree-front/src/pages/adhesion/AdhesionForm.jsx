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
import {ReactComponent as ImageIcon} from "../../assets/ui/svg/adhesionForm/image.svg";
import FTProButton from "../../components/button/FTProButton";
import {GenderFemale, GenderMale} from "@phosphor-icons/react";
import {countries} from "../../utils/countries";

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
    const [countriesData, setCountries] = useState(countries);
    const {Option} = Select;
    const [idCardFile, setIdCardFile] = useState(null); // TODO : utiliser le setIdCardFile dans le .then(data) du cloud
    const [photoFile, setPhotoFile] = useState(null); // TODO : utiliser le setPhotoFile dans le .then(data) du cloud
    const [picMessageIdCardFile, setPicMessageIdCardFile] = useState("");
    const [picMessagePhotoFile, setPicMessagePhotoFile] = useState("");

    // États pour gérer le bouton actif
    const [isMaleActive, setIsMaleActive] = useState(false);
    const [isFemaleActive, setIsFemaleActive] = useState(false);

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
            gender: '',
            city: '',
            country: ''
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

    // Gestionnaires de clic pour les boutons de genre
    const handleMaleClick = () => {
        setIsMaleActive(true);
        setIsFemaleActive(false);
    };

    const handleFemaleClick = () => {
        setIsFemaleActive(true);
        setIsMaleActive(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const socialSecurityNumber = e.target.socialSecurityNumber.value;
        const lastName = e.target.lastName.value;
        const firstName = e.target.firstName.value;
        const birthDate = e.target.birthDate.value;
        const nationality = e.target.nationality.value;
        const email = e.target.email.value;
        let idCardPath;
        if (idCardFile) {
            idCardPath = idCardFile;
        } else {
            idCardPath = '';
        }
        let photoPath;
        if (photoFile) {
            photoPath = photoFile;
        } else {
            photoPath = '';
        }
        const gender = isMaleActive ? "male" : "female";
        const city = e.target.city.value;
        const country = e.target.country.value;

        const values = {
            socialSecurityNumber,
            lastName,
            firstName,
            birthDate,
            nationality,
            email,
            idCardPath,
            photoPath,
            gender,
            city,
            country
        };

        const response = await dispatch(createAdhesionAction({payload: values}));
        toast.success("Votre demande d'adhésion a été crée!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        navigate(-1);
    };

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

    const handleFileChange = (e, setFileFunc) => {
        const file = e.target.files[0];
        if (file) {
            setFileFunc(file);  // Mettre à jour l'état local avec le fichier
            formik.setFieldValue(e.target.name, file);  // Mettre à jour les valeurs Formik
        }
    };

    const getPreview = (file) => {
        return typeof file === 'string' ? file : '';
    };

    const removeFile = (setFileFunc, fieldName) => {
        setFileFunc(null);
        formik.setFieldValue(fieldName, null);
    };

    const postDetailsIdCardFile = (pics) => {
        setPicMessageIdCardFile(null);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "ftpropp");
            data.append("cloud_name", "dfxdhqrqu");
            fetch("https://api.cloudinary.com/v1_1/dfxdhqrqu/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setIdCardFile(data.url.toString());
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            return setPicMessageIdCardFile("Choisissez une image valide");
        }
    };

    const postDetailsPhotoFile = (pics) => {
        setPicMessagePhotoFile(null);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "ftpropp");
            data.append("cloud_name", "dfxdhqrqu");
            fetch("https://api.cloudinary.com/v1_1/dfxdhqrqu/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("data", data)
                    setPhotoFile(data.url.toString());
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            return setPicMessagePhotoFile("Choisissez une image valide");
        }
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

            <form onSubmit={handleSubmit}
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                {/* Boutons de genre */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={handleMaleClick}
                        type="button"
                        className={`p-2 rounded-full ${isMaleActive ? 'bg-green-ftpro' : 'bg-gray-300'}`}
                    >
                        <GenderMale size={32} color="#ffffff"/>
                    </button>
                    <button
                        onClick={handleFemaleClick}
                        type="button"
                        className={`ml-2 p-2 rounded-full ${isFemaleActive ? 'bg-green-ftpro' : 'bg-gray-300'}`}
                    >
                        <GenderFemale size={32} color="#ffffff"/>
                    </button>
                </div>
                {/* Nom et Prénom */}
                <div className="-mx-3 md:flex mb-6">
                    {/* Nom */}
                    <div className="md:w-1/2 px-3 relative">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
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
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker focus:border-green-600 border border-grey-lighter rounded py-3 px-4 pl-12"
                                style={{color: '#4a5568'}}
                                id="lastName" name="lastName" type="text" onChange={formik.handleChange}
                                value={formik.values.lastName}
                                placeholder="Entrez votre nom"
                                required
                            />
                        </div>
                    </div>

                    {/* Prénom */}
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0 relative">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="firstName">
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
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 pl-12"
                                style={{color: '#4a5568'}}
                                id="firstName" name="firstName" type="text" onChange={formik.handleChange}
                                value={formik.values.firstName}
                                placeholder="Entrez votre prénom"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Numéro de sécurité sociale, Date de naissance, et Email */}
                <div className="-mx-3 md:flex mb-6">
                    {/* Numéro de sécurité sociale */}
                    <div className="md:w-1/3 px-3 relative">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="socialSecurityNumber">
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
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 pl-12"
                                id="socialSecurityNumber" name="socialSecurityNumber" type="text"
                                onChange={formik.handleChange} value={formik.values.socialSecurityNumber}
                                placeholder="Entrez votre numéro de sécurité sociale"
                                required
                            />
                        </div>
                    </div>
                    {/* Date de naissance */}
                    <div className="md:w-1/3 px-3 relative">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="birthDate">
                            Date de naissance
                        </label>
                        <div className="relative">
                            <svg className="w-6 h-6 text-gray-500 absolute left-3 inset-y-0 my-auto"
                                 xmlns="http://www.w3.org/2000/svg" fill="#a0aec0" viewBox="0 0 256 256">
                                <path
                                    d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>
                            </svg>
                            <style>
                                {`
                                    #birthDate:focus {
                                        border-color: #4CC425;
                                        outline: none;
                                    }
                                    #birthDate::placeholder {
                                        color: #a0aec0;
                                    }
                                `}
                            </style>
                            <input
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 pl-12"
                                type="date" id="birthDate" name="birthDate" onChange={formik.handleChange}
                                value={formik.values.birthDate}
                                placeholder="JJ/MM/AAAA"
                                required
                            />
                        </div>
                    </div>
                    {/* Email */}
                    <div className="md:w-1/3 px-3 relative">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="email">
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
                                id="email" name="email" type="email" onChange={formik.handleChange}
                                value={formik.values.email}
                                placeholder="Entrez votre email"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Nationalité, Pays et Ville */}
                <div className="-mx-3 md:flex mb-6">
                    {/* Nationalité */}
                    <div className="md:w-1/3 px-3 relative">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
                               htmlFor="nationality">
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
                            <select
                                className="block appearance-none w-full bg-white text-grey-darker border border-grey-lighter text-gray-700 py-3 px-4 pr-8 rounded pl-12"
                                id="nationality" name="nationality" onChange={formik.handleChange}
                                value={formik.values.nationality}>
                                {countriesData.map((country, idx) => (
                                    <option key={idx} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Pays */}
                    <div className="md:w-1/3 px-3 relative">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
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
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 pl-12"
                                id="country" name="country" type="text" onChange={formik.handleChange}
                                value={formik.values.country}
                                placeholder="Entrez votre pays"
                                required
                            />
                        </div>
                    </div>
                    {/* Ville */}
                    <div className="md:w-1/3 px-3 relative">
                        <label className="block uppercase tracking-wide text-gray-darker text-xs font-bold mb-2"
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
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 pl-12"
                                id="city" name="city" type="text" onChange={formik.handleChange}
                                value={formik.values.city}
                                placeholder="Entrez votre ville"
                                required
                            />
                        </div>
                    </div>
                </div>
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
                                <div
                                    className="flex items-center space-x-2"> {/* Utilisez flex et space-x-2 pour aligner et espacer */}

                                    {/* SVG Icône */}
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="#a0aec0"
                                         viewBox="0 0 256 256">
                                        <path
                                            d="M200,112a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,112Zm-8,24H152a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm40-80V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Zm-80.26-34a8,8,0,1,1-15.5,4c-2.63-10.26-13.06-18-24.25-18s-21.61,7.74-24.25,18a8,8,0,1,1-15.5-4,39.84,39.84,0,0,1,17.19-23.34,32,32,0,1,1,45.12,0A39.76,39.76,0,0,1,135.75,166ZM96,136a16,16,0,1,0-16-16A16,16,0,0,0,96,136Z"></path>
                                    </svg>
                                    <p className="text-gray-500">Glissez votre carte d'identité ici ou cliquez pour
                                        sélectionner un fichier</p>
                                </div>
                            )}
                            <input id="idCardPath" name="idCardPath" type="file" className="hidden"
                                   onChange={(e) => {
                                       handleFileChange(e, setIdCardFile);
                                       postDetailsIdCardFile(e.target.files[0]);
                                   }}
                                   required/>
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
                                <div
                                    className="flex items-center space-x-2"> {/* Utilisez flex et space-x-2 pour aligner et espacer */}
                                    {/* SVG Icône */}
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="#a0aec0"
                                         viewBox="0 0 256 256">
                                        <path
                                            d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"></path>
                                    </svg>
                                    <p className="text-gray-500">Glissez votre photo ici ou cliquez pour sélectionner un
                                        fichier</p>
                                </div>
                            )}
                            <input id="photoPath" name="photoPath" type="file" className="hidden"
                                   onChange={(e) => {
                                       handleFileChange(e, setPhotoFile);
                                       postDetailsPhotoFile(e.target.files[0]);
                                   }}
                                   required/>
                        </div>
                    </div>
                </div>
                {/* Bouton de soumission */}
                <div className="mt-6 flex justify-end -mx-3">
                    <div className="px-3">
                        <FTProButton content="Soumettre la demande" type="submit" noMarginTop/>
                    </div>
                </div>

            </form>
        </div>
    );
}
