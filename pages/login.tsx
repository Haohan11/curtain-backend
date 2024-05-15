import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Row, Col, Container, Form, FormGroup, FormCheck, Button } from "react-bootstrap";
import { signIn, useSession, getSession } from "next-auth/react";
import LoginPageLayout from "@/components/loginPageLayout";
import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";
import Logo from "@/components/logo";

import { useModals } from "@/tool/hooks";

const LoginLayout = () => {
    const router = useRouter();
    const { handleShowModal, handleCloseModal, isModalOpen } = useModals();

    const login = async () => {
        const form = document.getElementById("loginForm");
        const formData = new FormData(form);
    
        const data = Object.fromEntries(formData);
        console.log("login data: ");
        console.log(data);
        const result = await signIn("credentials", {
            ...data,
            redirect: false
        });
        console.log('result :', result);
        if (result?.ok) {
            router.push("/");
        } else {
          form.reset();
         handleShowModal('popup')
        }
    }

    const content = (
        <Form
          className="h-100 flex-center flex-column text-textgrey pb-10"
          id="loginForm"
        >
            {/* <Logo className="mb-3" width={150} /> */}
            <h1 className="fw-bold fs-2 my-5 text-darkblue">登入</h1>
            <div style={{ width: "clamp(275px, 60% ,350px)" }}>
                <FormGroup className="mb-3">
                    <label className="form-label">帳號</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder=""
                        name="account"
                    />
                </FormGroup>
                <FormGroup className="mb-3">
                    <label className="form-label">密碼</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder=""
                        name="password"
                    />
                </FormGroup>
                <Button variant="primary" type="button" className="w-100" onClick={login}>登入</Button>
            </div>
            {/*新增 和 編輯完成*/}
        <ModalWrapper
          key="popup"
          show={isModalOpen("popup")}
          size="lg"
          onHide={() => {handleCloseModal('popup')}}
        >
          <PopUp
            imageSrc={'/icon/circle-error.svg'}
            title={'帳號或密碼錯誤'}
            confirmOnClick={() => {handleCloseModal('popup')}}
          />
        </ModalWrapper>
        </Form>
      );

    return <LoginPageLayout content={content} />;
}   

LoginLayout.getLayout = (page) => page;

export default LoginLayout;

export const getServerSideProps = async (context: any) => {
    const session = await getSession(context)
    console.log("login session: " + session);
    if (session) {
        return {
          redirect: { destination: "/" },
        };
    }
  
    return {
      props : {}
    };
}