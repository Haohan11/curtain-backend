import { Row, Col, FormCheck, FormGroup, FormLabel } from "react-bootstrap";
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
                  <div className="fs-3 fw-bold text-primary text-center py-2">
                    客廳場景
                  </div>
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
        <Col>
          <div className="p-4 h-100 fw-bold">
            <div
              className="rounded-4 border-gray-300"
              style={{ height: "60%", border: "dashed" }}
            ></div>
            <div className="d-flex fs-2 pt-8 pb-4">
              <span className="text-gray-500 me-4">場景名稱:</span>
              <span className="text-primary me-2">客廳場景</span>
              <KTSVG
                path="media/icons/duotune/art/art005.svg"
                className="svg-icon-muted svg-icon-1 cursor-pointer"
              />
              <FormGroup className="ms-auto d-flex">
                <FormLabel
                  className="fs-4 fw-bold me-2 cursor-pointer"
                  htmlFor="env-enable"
                >
                  啟用狀態
                </FormLabel>
                <FormCheck inline type="switch" id="env-enable" name="enable" />
              </FormGroup>
            </div>
            <label className="d-block fs-2 text-gray-500 mb-2">備註</label>
            <textarea id="env-comment" className="w-100 h-200px p-4 fs-3 border-gray-300 border-2 rounded-2"></textarea>
            <div className="d-flex mt-4">
              <button className="w-100 btn btn-secondary me-12">取消</button>
              <button className="w-100 btn btn-primary">儲存</button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default EnvironmentPage;
