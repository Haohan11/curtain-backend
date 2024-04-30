import { useState, useEffect, useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { Row, Col } from "react-bootstrap";

import { EnvModal } from "../../components/envModal";

const mockInitValue = { name: "客廳場景", enable: true, description: "" }

const EnvironmentPage = () => {
  const router = useRouter();
  const { mode } = router.query;
  const currentMode = ["create", "edit"].includes(mode) ? mode : "none";

  const goCreateMode = () => router.push("?mode=create");
  const goEditMode = () => router.push("?mode=edit");
  const goNoneMode = () => router.push("");

  return (
    <>
      <Row className="m-0 h-100">
        <Col sm={3} className="h-100">
          <div className="h-100 d-flex flex-column position-relative">
            <h1 className="my-5 fs-1 text-center text-primary">場景列表</h1>
            <div className="separator border-3"></div>
            <div className="mt-5 mh-750px overflow-y-scroll px-2">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="mb-5">
                  <div
                    className="position-relative w-100 rounded-2 overflow-hidden"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <Image
                      fill
                      sizes="200px"
                      alt="env image"
                      src="/livingroom.jpg"
                    />
                  </div>
                  <div className="fs-3 fw-bold text-primary text-center py-2">
                    客廳場景
                  </div>
                  <div className="separator border-3"></div>
                </div>
              ))}
            </div>
            <div
              className="position-absolute w-100 p-3 fs-3 fw-bold left-0 bottom-0 text-center bg-primary text-white cursor-pointer"
              onClick={goCreateMode}
            >
              <span className="px-2 fs-1 border border-white border-2 me-2">
                +
              </span>
              新增場景
            </div>
          </div>
        </Col>
        <Col>
        <EnvModal key={currentMode} {...{currentMode, initValue: mockInitValue}} />
        </Col>
      </Row>
    </>
  );
};

export default EnvironmentPage;
