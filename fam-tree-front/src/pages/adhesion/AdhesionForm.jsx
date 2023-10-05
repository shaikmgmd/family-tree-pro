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


    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-2">Demande d'adhésion</h1>
            <h2 className="italic text-sm">Veuillez remplir le formulaire suivant :</h2>
            <Divider/>
            <form onSubmit={formik.handleSubmit}>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        name="firstName"
                        placeholder="Prénom"
                        onChange={formik.handleChange}
                        value={formik.values.firstName}
                        className={formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : ''}
                    />
                    <Input
                        name="lastName"
                        placeholder="Nom de famille"
                        onChange={formik.handleChange}
                        value={formik.values.lastName}
                        className={formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''}
                    />
                    <Input
                        className="col-span-2"
                        name="socialSecurityNumber"
                        placeholder="Numéro de sécurité sociale"
                        onChange={formik.handleChange}
                        value={formik.values.socialSecurityNumber}
                        className={formik.touched.socialSecurityNumber && formik.errors.socialSecurityNumber ? 'border-red-500' : ''}
                    />
                    <Input
                        name="email"
                        placeholder="Email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
                    />
                    <Input
                        type="date"
                        name="birthDate"
                        placeholder="Date de naissance"
                        onChange={formik.handleChange}
                        value={formik.values.birthDate}
                        className={formik.touched.birthDate && formik.errors.birthDate ? 'border-red-500' : ''}
                    />
                    <Select
                        showSearch
                        placeholder="Nationalité"
                        name="nationality"
                        value={formik.values.nationality}
                        onChange={value => formik.setFieldValue('nationality', value)}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        className={formik.touched.nationality && formik.errors.nationality ? 'border-red-500' : ''}
                    >
                        {countries.map(country => (
                            <Option key={country.code} value={country.name}>
                                {country.name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <Divider/>
                <div>
                    <h1 className="text-2xl font-bold mb-2">Documents d'identité</h1>
                    <h2 className="italic text-sm mb-3">Veuillez fournir les pièces nécessaires :</h2>
                    <div className="flex flex-row space-x-5">
                        <div className="">
                            <Upload
                                beforeUpload={file => {
                                    formik.setFieldValue("idCardPath", file);
                                    return false;
                                }}
                            >
                                <Button icon={<UploadOutlined/>}>Charger la carte d'identité</Button>
                            </Upload>
                        </div>
                        <div>
                            <Upload
                                beforeUpload={file => {
                                    formik.setFieldValue("photoPath", file);
                                    return false;
                                }}
                            >
                                <Button icon={<UploadOutlined/>}>Charger la photo</Button>
                            </Upload>
                        </div>

                    </div>
                    <div className="mt-4">
                        <Button type="default" htmlType="submit">
                            Envoyer
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
