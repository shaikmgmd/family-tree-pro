import React, {useState} from 'react';
import {Form, Input, Button, Row, Col} from 'antd';
import {relationshipSelectOptions} from "../../utils/RelationshipTypes";
import Select from "react-select";

const ExistingMemberForm = ({onSubmit, nodeId}) => {
    const [email, setEmail] = useState('');
    const [type, setRelationshipType] = useState('');
    const handleSelectChange = (selectedOption) => {
        setRelationshipType(selectedOption.value);
    };
    return (
        <Form>
            <Row className="w-full">
                <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="E-mail du membre existant"
                    required
                />
                <Select
                    options={relationshipSelectOptions}
                    placeholder="Choisir le type de relation"
                    onChange={handleSelectChange}
                    className="w-full mt-2"
                />
            </Row>
            <Row style={{marginTop: '16px'}}>
                <Col span={24}>
                    <Button type="default" htmlType="submit" onClick={(e) => {
                        e.preventDefault();
                        onSubmit({email, type});
                    }}>Ajouter membre existant</Button>
                </Col>
            </Row>
        </Form>
    );
}

export default ExistingMemberForm;
