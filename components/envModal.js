import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { FormCheck, FormGroup, FormLabel } from "react-bootstrap";
import { KTSVG } from "@/_metronic/helpers/index.ts";
import { Stage, Layer, Line } from "react-konva";
import { getFileUrl } from "@/tool/getFileUrl";

export const EnvModal = ({ currentMode, initValue }) => {
  const router = useRouter();
  const goCreateMode = () => router.push("?mode=create");
  const goEditMode = () => router.push("?mode=edit");
  const goNoneMode = () => router.push("");

  const { name: envName, enable, description } = initValue;
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
  return (
    <>
      {
        {
          create: (
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
                    height={
                      canvasFrame?.nodeType ? canvasFrame.clientHeight : 0
                    }
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
                <button
                  className="w-100 btn btn-secondary me-12"
                  onClick={goNoneMode}
                >
                  取消
                </button>
                <button className="w-100 btn btn-primary">儲存</button>
              </div>
            </form>
          ),
          edit: <></>,
          none: (
            <div className="h-100 flex-center">
              <div
                className="h-75 w-75 flex-center flex-column fs-1 fw-bold text-center  border-gray-600 border-2 text-gray-600 rounded-3 cursor-pointer"
                style={{ border: "dashed" }}
                onClick={goCreateMode}
              >
                <p>請從左側選擇要編輯的場景</p>
                <p>或是</p>
                <p>點此新增場景</p>
              </div>
            </div>
          ),
        }[currentMode]
      }
    </>
  );
};
