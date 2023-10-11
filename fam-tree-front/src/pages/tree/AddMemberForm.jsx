import React, {useState} from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import Select from 'react-select';
import {relationshipSelectOptions} from "../../utils/RelationshipTypes";

const AddMemberForm = ({ onSubmit, nodeId }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: '',
        socialSecurityNumber: '',
        address: '',
        phoneNumber: '',
        type: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };


    const handleSelectChange = (selectedOption) => {
        setFormData(prevData => ({ ...prevData, type: selectedOption.value }));
    };


    return (
        <Form>
            <Row gutter={16} className="my-2">
                <Col span={8}>
                    <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom" required />
                </Col>
                <Col span={8}>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" required />
                </Col>
                <Col span={8}>
                    <Input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="Date de naissance" required />
                </Col>
            </Row>
            <Row gutter={16} className="my-2">
                <Col span={8}>
                    <Input type="number" name="socialSecurityNumber" value={formData.socialSecurityNumber} onChange={handleChange} placeholder="Numéro de sécurité sociale" required />
                </Col>
                <Col span={8}>
                    <Input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" required />
                </Col>
                <Col span={8}>
                    <Input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Numéro de téléphone" required />
                </Col>
            </Row>
            <Row className="my-2">
                <Col span={24}>
                    <Select
                        options={relationshipSelectOptions}
                        placeholder="Choisir le type de relation"
                        onChange={handleSelectChange}
                    />
                </Col>
            </Row>
                <Row>
                    <Col span={24}>
                        <Button type="default" onClick={(e) => {
                            e.preventDefault();
                            onSubmit(formData);
                        }}>Ajouter membre</Button>
                    </Col>
                </Row>
        </Form>
    );
}

export default AddMemberForm;
