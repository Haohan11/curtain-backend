import { useState, useEffect, useRef } from "react";

import { Row, Col, FormCheck, FormGroup, FormLabel } from "react-bootstrap";
import { KTSVG } from "@/_metronic/helpers/index.ts";
import Image from "next/image";
import { Stage, Layer, Line } from "react-konva";
import { getFileUrl } from "@/tool/getFileUrl";

const envName = "客廳場景";

const EnvironmentPage = () => {
  const [initInputWidth, setInitInputWidth] = useState("fit-content");
  const [inputDisable, setInputDisable] = useState(true);
  const allowInput = () => setInputDisable(false);
  const disableInput = () => setInputDisable(true);

  const [envImage, setEnvImage] = useState(null);
  const hasEnvImage = envImage !== null;

  const [canvasFrame, setCanvasFrame] = useState();

  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    console.log("moving");
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  useEffect(() => {
    const el = document.createElement("span");
    document.body.appendChild(el);
    el.innerHTML = envName;
    el.style.position = "absolute";

    setInitInputWidth(el.clientWidth * 2 + "px");
    el.remove();
  }, []);

  useEffect(() => {
    
  }, [canvasFrame])

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
            <div className="position-absolute w-100 p-3 fs-3 fw-bold left-0 bottom-0 text-center bg-primary text-white">
              <span className="px-2 fs-1 border border-white border-2 me-2">
                +
              </span>
              新增場景
            </div>
          </div>
        </Col>
        <Col>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="p-4 h-100 fw-bold d-flex flex-column"
          >
            {hasEnvImage ? (
              <div
                ref={setCanvasFrame}
                className="position-relative border border-2 rounded-4 border-gray-300 align-self-center"
                style={{
                  width: "100%",
                  maxWidth: "1024px",
                  aspectRatio: "16 / 9",
                }}
              >
                <Image
                  fill
                  alt="edit env image"
                  src={envImage}
                  className="object-fit-contain pe-none"
                />
                <Stage
                  className="position-absolute top-0 left-0"
                  width={canvasFrame?.nodeType ? canvasFrame.clientWidth : 0}
                  height={canvasFrame?.nodeType ? canvasFrame.clientHeight : 0}
                  onMouseDown={handleMouseDown}
                  onMousemove={handleMouseMove}
                  onMouseup={handleMouseUp}
                >
                  <Layer>
                    {lines.map((line, i) => (
                      <Line
                        key={i}
                        points={line.points}
                        stroke="#df4b26"
                        strokeWidth={5}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={"source-over"}
                      />
                    ))}
                  </Layer>
                </Stage>
              </div>
            ) : (
              <label
                className="rounded-4 border-gray-300 flex-center flex-column cursor-pointer"
                style={{
                  width: "100%",
                  border: "dashed",
                  aspectRatio: "16 / 9",
                }}
              >
                <KTSVG
                  path="media/icons/duotune/files/fil022.svg"
                  className="svg-icon-muted svg-icon-4hx"
                />
                <span className="fs-3 text-gray-500">上傳場景圖片</span>
                <input
                  hidden
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => {
                    const path = getFileUrl(e);
                    if (!path) return;
                    setEnvImage(path);
                  }}
                />
              </label>
            )}
            <div className="d-flex fs-2 pt-8 pb-4">
              <span className="text-gray-500 me-4">場景名稱:</span>
              <input
                onBlur={disableInput}
                onInput={(e) => {
                  const text = e.currentTarget.value;
                  const el = document.createElement("span");
                  document.body.appendChild(el);
                  el.innerHTML = text;
                  el.style.position = "absolute";

                  e.currentTarget.style.width = el.clientWidth * 2 + "px";
                  el.remove();
                }}
                id="name"
                name="name"
                style={{ width: initInputWidth, minWidth: "50px" }}
                className={`fs-2 p-0 form-control form-control-flush text-primary me-2 border-bottom text-center ${
                  inputDisable ? "" : "border-primary"
                }`}
                defaultValue={envName || ""}
                disabled={inputDisable}
              />
              <label
                htmlFor="name"
                className="cursor-pointer"
                onClick={allowInput}
              >
                <KTSVG
                  path="media/icons/duotune/art/art005.svg"
                  className="svg-icon-muted svg-icon-1"
                />
              </label>
              <FormGroup className="ms-auto d-flex">
                <FormLabel
                  className="fs-4 fw-bold me-2 cursor-pointer"
                  htmlFor="enable"
                >
                  啟用狀態
                </FormLabel>
                <FormCheck inline type="switch" id="enable" name="enable" />
              </FormGroup>
            </div>
            <label className="d-block fs-2 text-gray-500 mb-2">備註</label>
            <textarea
              id="comment"
              className="w-100 p-4 fs-3 border-gray-300 border-2 rounded-2 flex-grow-1"
            ></textarea>
            <div className="d-flex mt-4">
              <button className="w-100 btn btn-secondary me-12">取消</button>
              <button className="w-100 btn btn-primary">儲存</button>
            </div>
          </form>
        </Col>
      </Row>
    </>
  );
};

export default EnvironmentPage;
