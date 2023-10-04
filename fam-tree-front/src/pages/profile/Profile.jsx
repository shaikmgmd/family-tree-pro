import React from 'react';
import {Form, Input, Button, Row, Col} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {MainWrapper} from "../../components/wrapper/MainWrapper";
import {updateUserAction} from "../../store/features/slices/user";
import {toast} from "react-toastify";


const Profile = () => {
    const user = useSelector((state) => state.user.getConnectedUser.payload);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        const values = form.getFieldsValue(['phone', 'address', 'email']);
        await dispatch(updateUserAction({payload: values}));
        toast.success("Votre profil a été mis à jour!", {
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
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Nom de famille">
                            <Input value={user?.lastName} disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Prénom">
                            <Input value={user?.firstName} disabled/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Numéro de sécurité sociale">
                            <Input value={user?.socialSecurityNumber} disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Nationalité">
                            <Input value={user?.nationality} disabled/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Code Public">
                            <Input value={user?.publicCode} disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Code Privé">
                            <Input value={user?.privateCode} disabled/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Adresse" name="address">
                            <Input defaultValue={user?.address}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Téléphone" name="phone">
                            <Input defaultValue={user?.phone}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Email" name="email">
                            <Input defaultValue={user?.email}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Form.Item>
                            <Button type="default" htmlType="submit">
                                Mettre à jour
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </MainWrapper>
    );
}

export default Profile;
