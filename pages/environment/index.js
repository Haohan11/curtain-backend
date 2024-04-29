import { Row, Col } from "react-bootstrap";
import { KTSVG } from "@/_metronic/helpers/index.ts";
import Image from "next/image";

const EnvironmentPage = () => {
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
                      alt="env image"
                      src="/livingroom.jpg"
                      objectFit="cover"
                    ></Image>
                  </div>
                  <div className="fs-3 fw-bold text-primary text-center py-2">客廳場景</div>
                  <div className="separator border-3"></div>
                </div>
              ))}
            </div>
            <div className="position-absolute w-100 p-3 fs-3 fw-bold left-0 bottom-0 text-center bg-primary text-white">
              <span className="px-2 fs-1 border border-white border-2 me-2">
                +
              </span>
              新增場景
            </div>
          </div>
        </Col>
        <Col></Col>
      </Row>
    </>
  );
};

export default EnvironmentPage;
