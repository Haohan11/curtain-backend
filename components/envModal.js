// relate to environment/index.js
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { FormCheck, FormGroup, FormLabel } from "react-bootstrap";
import { KTSVG } from "@/_metronic/helpers/index.ts";
import { Stage, Layer, Line, Circle } from "react-konva";
import { getFileUrl } from "@/tool/getFileUrl";
import { getMatirx3dText } from "../tool/transformBlock";

import { useSession } from "next-auth/react";
import { useFormik } from "formik";

import { createDataRequest, updateDataRequest } from "@/data-list/core/request";

import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";
import { useModals, usePermission } from "@/tool/hooks";

const generatePattern = (stripe, color1 = "#333", color2 = "#aaa") => {
  return [...new Array(stripe * 2)].reduce((colorStop, _, index) => {
    return `${colorStop} ${index % 2 === 0 ? color1 : color2} ${
      (index * 50) / stripe
    }%${index === stripe * 2 - 1 ? "" : ","}`;
  }, "to right,");
};

const transAnchorConfig = {
  radius: 8,
  fill: ["steelblue", "gold", "darkseagreen"],
  draggable: true,
};

const anchorConfig = {
  radius: 8,
  fill: "orange",
  draggable: true,
};

const zoneConfig = {
  dash: [0, 0, 3, 3],
  closed: true,
  stroke: "#fff",
  strokeWidth: 1.5,
  lineCap: "round",
  lineJoin: "round",
};

const drawLineConfig = {
  dash: [0, 0, 3, 3],
  stroke: "blue",
  strokeWidth: 2.5,
  lineCap: "round",
  lineJoin: "round",
};

const initValue = {
  name: "新場景",
  env_image: null,
  enable: true,
  comment: "",
  cropline: [],
};

const perspectivePadding = 0.25;

export const EnvModal = ({ currentMode, oriValue }) => {
  const { data, status } = useSession();
  const token = data?.user?.accessToken;
  const [message, setMessage] = useState("");
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();

  const router = useRouter();
  const permission = usePermission();
  const allowModify = permission?.environment?.modify;
  const goCreateMode = () => router.push("?mode=create");
  const goNoneMode = () => router.push("");

  const {
    id,
    name: envName,
    env_image,
    cropline,
    width,
  } = oriValue || initValue;

  // handle env name input
  const [initInputWidth, setInitInputWidth] = useState("fit-content");
  const [inputDisable, setInputDisable] = useState(true);
  const allowInput = () => setInputDisable(false);
  const disableInput = () => setInputDisable(true);

  const [envImage, setEnvImage] = useState(env_image);
  const hasEnvImage = envImage !== null;

  const [canvasFrame, setCanvasFrame] = useState();
  const canvasInitWidth = useRef(width);

  const [allowTrans, setAllowTrans] = useState(false);
  const toggleAllowTrans = () => setAllowTrans((prev) => !prev);
  const staticTranAnchor = useRef([]);
  const [transAnchor, setTransAnchor] = useState([]);
  const addTransAnchor = () => {
    if (!canvasFrame) return;
    const x1 = canvasFrame.clientWidth * perspectivePadding;
    const x2 = canvasFrame.clientWidth * (1 - perspectivePadding);
    const y1 = canvasFrame.clientHeight * perspectivePadding;
    const y2 = canvasFrame.clientHeight * (1 - perspectivePadding);
    const position = [
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y2 },
    ];
    const arrayPosi = position.map(({ x, y }) => [x, y]); 
    setTransAnchor((prev) => staticTranAnchor.current = [
      ...prev,
      {
        width: canvasFrame.clientWidth,
        originalPos: arrayPosi,
        targetPos: position,
      },
    ]);
  };
  const scaleTransAnchor = () => {
    if (!canvasFrame || !transAnchor[0]?.width) return;
    const scale = (canvasFrame.clientWidth / transAnchor[0]?.width) || 1;
    setTransAnchor(
      staticTranAnchor.current.map(({ width, targetPos, originalPos }) => ({
        width,
        targetPos: targetPos.map(({ x, y }) => ({
          x: scale * x,
          y: scale * y,
        })),
        originalPos: originalPos.map(([x, y]) => [
          x * scale,
          y * scale, 
        ]),
      }))
    );
  };
  const removeTransAnchor = (index) => setTransAnchor([]);
  const moveTransAnchor = (e, index, anchorIndex) => {
    if (!allowTrans) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    setTransAnchor((prev) => {
      const newArray = [...prev];
      const newTargetPos = [...newArray[index].targetPos];
      newTargetPos[anchorIndex] = { x, y };
      newArray[index].targetPos = newTargetPos;
      return staticTranAnchor.current = newArray;
    });
  };

  const [allowDraw, setAllowDraw] = useState(false);
  const toggleAllowDraw = () => setAllowDraw((prev) => !prev);

  const staticAnchors = useRef([]);
  const [anchors, setAnchors] = useState([]);
  const lines = anchors.reduce(
    (lineArray, anchor) => [...lineArray, anchor.x, anchor.y],
    []
  );
  const clearCircle = () => setAnchors([]);

  const staticCropline = useRef(cropline || []);
  const [cropLines, setCropLines] = useState(cropline || []);
  const clearCropLines = () => setCropLines((staticCropline.current = []));

  const [previewMask, setPreviewMask] = useState();

  const [angle, setAngle] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);

  const resetTranform = () => {
    setAngle(0);
    setSkewX(0);
    setSkewY(0);
  };

  const clearCanvas = () => {
    clearCircle();
    clearCropLines();
    setPreviewMask(null);
  };

  const addAnchor = (e) => {
    if (!allowDraw) return;
    const state = `clickOn${
      e.target.className === "Circle" ? "Circle" : "NotCircle"
    }`;
    ({
      clickOnCircle() {
        const { x, y } = e.target.getPosition();
        canvasFrame?.nodeType &&
          (canvasInitWidth.current = canvasFrame.clientWidth);
        setCropLines(
          (prev) => (staticCropline.current = [...prev, [...lines, x, y]])
        );
        clearCircle();
      },
      clickOnNotCircle() {
        const { x, y } = e.target.getStage().getPointerPosition();
        setAnchors((prev) => (staticAnchors.current = [...prev, { x, y }]));
      },
    })[state]();
  };

  const moveAnchor = (e, index) => {
    if (!allowDraw) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    setAnchors((prev) => {
      const newArray = [...prev];
      newArray[index] = { x, y };
      return newArray;
    });
  };

  const cutImage = () => {
    if (!canvasFrame || cropLines.length === 0 || !envImage) return;

    const canvas = document.createElement("canvas");
    canvas.width = canvasFrame.clientWidth;
    canvas.height = canvasFrame.clientHeight;
    const ctx = canvas.getContext("2d");
    const imgObj = document.createElement("img");
    imgObj.src = envImage;

    cropLines.forEach((line) => {
      const lineLength = line.length;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(line[0], line[1]);
      for (let i = 2; i < lineLength; i += 2) {
        ctx.lineTo(line[i], line[i + 1]);
      }
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = "pink";
      ctx.fill();
      ctx.restore();
    });

    setPreviewMask(canvas.toDataURL());

    canvas.toBlob((blob) => {
      const file = new File([blob], "new_mask.png", { type: "image/png" });
      formik.setFieldValue("mask_image", file);
    });
  };

  const formik = useFormik({
    initialValues: {
      env_image: null,
      mask_image: null,
      ...(oriValue || initValue),
    },
    onSubmit: async (values) => {
      await {
        async create() {
          const status = await createDataRequest(token, {
            ...values,
            cropline: JSON.stringify(cropLines),
            width: canvasFrame.clientWidth,
          });
          if (status) {
            setMessage("新增成功");
            handleShowModal("success");
          }
        },
        async edit() {
          const { status, message } = await updateDataRequest(token, {
            ...values,
            width: canvasFrame.clientWidth,
            cropline: JSON.stringify(cropLines),
            id,
          });
          if (status) {
            setMessage("編輯成功");
            handleShowModal("success");
          }
          if (message === "NotAllowDisableAll") {
            setMessage("至少要有一個場景啟用");
            handleShowModal("failed");
          }
        },
        close() {},
      }[currentMode]();
    },
  });

  // resize listener will mutate this state to trigger useEffect to excute `scaleDrawItem`
  const [scaleState, setScaleState] = useState(false);
  const scaleDrawItem = () => {
    if (!scaleState || !canvasFrame?.nodeType || !canvasInitWidth.current)
      return;
    const scale = canvasFrame.clientWidth / canvasInitWidth.current;
    anchors.length > 0 &&
      setAnchors(
        staticAnchors.current.map((points) => ({
          x: points.x * scale,
          y: points.y * scale,
        }))
      );
    staticCropline.current.length > 0 &&
      setCropLines(
        staticCropline.current.map((line) => line.map((point) => point * scale))
      );
    scaleTransAnchor();
    setScaleState(false);
  };

  // init env name input width and add resize listener
  useEffect(() => {
    const el = document.createElement("span");
    document.body.appendChild(el);
    el.innerHTML = envName;
    el.style.position = "absolute";

    setInitInputWidth(el.clientWidth * 2 + "px");
    el.remove();

    const handleResize = () => !scaleState && setScaleState(true);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    scaleDrawItem();
  }, [scaleState]);

  useEffect(() => {
    cutImage();
  }, [cropLines]);

  const Panel = (
    <form onSubmit={formik.handleSubmit} className="h-100">
      <fieldset
        disabled={!allowModify}
        className="h-100 p-4 pb-0 fw-bold d-flex flex-column"
      >
        {hasEnvImage ? (
          <>
            <div
              ref={setCanvasFrame}
              className={`position-relative border border-2 rounded-4 bg-gray-300 border-${
                allowDraw ? "danger" : "gray-500"
              } align-self-center`}
              style={{
                width: "100%",
                maxWidth: "1024px",
                aspectRatio: "16 / 9",
              }}
            >
              <Image
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="edit env image"
                src={envImage}
                className="object-fit-contain pe-none"
              />
              {previewMask && (
                <div
                  className="position-relative w-100 h-100 pe-none overflow-hidden"
                  style={{
                    maskImage: `url('${previewMask}')`,
                    maskRepeat: "no-repeat",
                    maskSize: "contain",
                  }}
                >
                  <div
                    className="position-absolute"
                    style={{
                      width: "50%",
                      height: "50%",
                      top: "25%",
                      left: "25%",
                    }}
                  >
                    {transAnchor.map(({ originalPos, targetPos }, index) => (
                      <div
                        key={index}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          top: "0",
                          left: "0",
                          transformOrigin: "0 0",
                          transform: getMatirx3dText(
                            originalPos,
                            targetPos.map(({ x, y }) => [x, y])
                          ),
                          backgroundImage: `linear-gradient(${generatePattern(
                            30
                          )})`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
              <Stage
                className="position-absolute top-0 left-0"
                width={canvasFrame?.nodeType ? canvasFrame.clientWidth : 0}
                height={canvasFrame?.nodeType ? canvasFrame.clientHeight : 0}
                onClick={addAnchor}
              >
                <Layer>
                  {cropLines.map((cropLine, index) => (
                    <Line key={index} {...zoneConfig} points={cropLine} />
                  ))}
                  {!allowTrans && lines.length > 0 && (
                    <Line points={lines} {...drawLineConfig} />
                  )}
                  {!allowTrans &&
                    anchors.map((anchor, index) => (
                      <Circle
                        key={index}
                        {...{ ...anchorConfig, ...anchor }}
                        onDragMove={(e) => moveAnchor(e, index)}
                      />
                    ))}
                  {allowTrans &&
                    transAnchor.map(({ targetPos }, index) =>
                      targetPos.map((anchor, anchorIndex) => (
                        <Circle
                          key={`${index}_${anchorIndex}`}
                          {...{ ...transAnchorConfig, ...anchor }}
                          fill={transAnchorConfig.fill[index % 3]}
                          onDragMove={(e) =>
                            moveTransAnchor(e, index, anchorIndex)
                          }
                        />
                      ))
                    )}
                </Layer>
              </Stage>
            </div>
            {!0 && (
              <div
                key={
                  [angle, skewX, skewY].some((item) => !!item)
                    ? "normal"
                    : "reset"
                }
                className="pt-4 fs-5 fw-normal d-flex justify-content-between align-items-center"
              >
                <button
                  type="button"
                  className={`btn btn-${allowTrans ? "secondary" : "primary"}`}
                  onClick={toggleAllowTrans}
                  disabled={allowDraw}
                >
                  {allowTrans ? "編輯完成" : "編輯視角"}
                </button>
                {allowTrans && (
                  <div>
                    <button
                      type="button"
                      className={`btn btn-secondary me-3`}
                      onClick={removeTransAnchor}
                    >
                      清空視角
                    </button>
                    <button
                      type="button"
                      className={`btn btn-primary`}
                      onClick={addTransAnchor}
                    >
                      新增視角
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="d-flex flex-wrap mt-4">
              {envImage && (
                <label className="btn btn-primary w-25 me-5">
                  更換圖片
                  <input
                    hidden
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={(e) => {
                      const [file] = e.target.files;
                      const path = getFileUrl(e);
                      if (!file || !path) return;
                      formik.setFieldValue("env_image", file);
                      setEnvImage(path);
                    }}
                  />
                </label>
              )}
              <button
                type="button"
                className="btn btn-secondary w-25 me-5"
                onClick={clearCanvas}
              >
                清除畫布
              </button>
              <button
                type="button"
                className={`btn btn-${
                  allowDraw ? "secondary" : "primary"
                } flex-grow-1`}
                onClick={() => {
                  toggleAllowDraw();
                }}
                disabled={allowTrans}
              >
                {!allowDraw
                  ? allowTrans
                    ? "視角編輯中"
                    : "開始繪製"
                  : "繪製完成"}
              </button>
            </div>
          </>
        ) : (
          <label
            className="rounded-4 border-gray-300 flex-center flex-column align-self-center cursor-pointer"
            style={{
              width: "100%",
              maxWidth: "1024px",
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
                const [file] = e.target.files;
                const path = getFileUrl(e);
                if (!file || !path) return;
                formik.setFieldValue("env_image", file);
                setEnvImage(path);
              }}
            />
          </label>
        )}
        <div className="d-flex fs-2 pt-6 pb-2">
          <span className="text-gray-500 me-4">場景名稱:</span>
          <input
            {...formik.getFieldProps("name")}
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
            style={{
              width: initInputWidth,
              minWidth: "50px",
              maxWidth: "200px",
            }}
            className={`fs-2 p-0 form-control form-control-flush text-primary me-2 border-bottom text-center ${
              inputDisable ? "" : "border-primary"
            }`}
            disabled={inputDisable}
          />
          <label htmlFor="name" className="cursor-pointer" onClick={allowInput}>
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
            <FormCheck
              {...formik.getFieldProps("enable")}
              inline
              type="switch"
              id="enable"
              name="enable"
              defaultChecked={formik.values["enable"]}
            />
          </FormGroup>
        </div>
        <label className="d-block fs-2 text-gray-500 mb-1">備註</label>
        <textarea
          {...formik.getFieldProps("comment")}
          className="w-100 py-2 px-4 mb-5 fs-3 border-gray-300 border-2 rounded-2 flex-grow-1"
        ></textarea>
        <div className="d-flex">
          <button
            type="button"
            className="w-100 btn btn-secondary me-12"
            onClick={() => {
              handleShowModal("reset");
            }}
          >
            取消
          </button>
          <button
            type="submit"
            className="w-100 btn btn-primary"
            disabled={
              allowDraw ||
              allowTrans ||
              cropLines?.length === 0 ||
              !formik.values["env_image"] ||
              !formik.values["name"]
            }
          >
            {allowDraw || allowTrans ? "繪製中無法儲存" : "儲存"}
          </button>
        </div>

        {/*是否重製*/}
        <ModalWrapper
          key="reset"
          show={isModalOpen("reset")}
          size="lg"
          onHide={() => {
            goNoneMode();
          }}
        >
          <PopUp
            imageSrc={"/icon/warning.svg"}
            title={"編輯尚未完成，是否要取消?"}
            denyOnClick={() => {
              handleCloseModal("reset");
            }}
            confirmOnClick={() => {
              goNoneMode();
            }}
          />
        </ModalWrapper>

        {/*新增 和 編輯完成*/}
        <ModalWrapper
          key="success"
          show={isModalOpen("success")}
          size="lg"
          onHide={() => {
            goNoneMode();
          }}
        >
          <PopUp
            imageSrc={"/icon/check-circle.svg"}
            title={message}
            confirmOnClick={() => {
              goNoneMode();
            }}
          />
        </ModalWrapper>

        <ModalWrapper
          key="failed"
          show={isModalOpen("failed")}
          size="lg"
          onHide={() => {
            handleCloseModal("failed");
          }}
        >
          <PopUp
            imageSrc={"/icon/warning.svg"}
            title={message}
            confirmOnClick={() => {
              handleCloseModal("failed");
            }}
          />
        </ModalWrapper>
      </fieldset>
    </form>
  );

  return (
    <>
      {
        {
          create: Panel,
          edit: Panel,
          none: (
            <div className="h-100 flex-center">
              <div
                className={`h-75 w-75 flex-center flex-column fs-1 fw-bold text-center  border-gray-600 border-2 text-gray-600 rounded-3 ${
                  allowModify && "cursor-pointer"
                }`}
                style={{ border: "dashed" }}
                {...(allowModify && { onClick: goCreateMode })}
              >
                <p>請從左側選擇要{allowModify ? "編輯" : "檢視"}的場景</p>
                {allowModify && (
                  <>
                    <p>或是</p>
                    <p>點此新增場景</p>
                  </>
                )}
              </div>
            </div>
          ),
        }[currentMode]
      }
    </>
  );
};
