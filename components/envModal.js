// relate to environment/index.js
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { FormCheck, FormGroup, FormLabel } from "react-bootstrap";
import { KTSVG } from "@/_metronic/helpers/index.ts";
import { Stage, Layer, Line, Circle } from "react-konva";
import { getFileUrl } from "@/tool/getFileUrl";

import { useFormik } from "formik";

import { createDataRequest, updateDataRequest } from "@/data-list/core/request";

const anchorConfig = {
  radius: 10,
  stroke: "#FFFFFF",
  fill: "#87CEEB88",
  strokeWidth: 2,
  draggable: true,
};

const initValue = {
  name: "新場景",
  env_image: null,
  enable: true,
  comment: "",
};

export const EnvModal = ({ currentMode, oriValue }) => {
  const router = useRouter();
  const goCreateMode = () => router.push("?mode=create");
  const goNoneMode = () => router.push("");

  const [renderCount, setRenderCount] = useState(0);
  const {
    name: envName,
    env_image,
    cropline,
  } = oriValue || initValue;

  const formik = useFormik({
    initialValues: {
      env_image: null,
      mask_image: null,
      ...(oriValue || initValue),
    },
    onSubmit: async (values) => {
      await {
        async create() {
          console.log(values);
          const status = await createDataRequest(values);
          if (status) goNoneMode();
        },
        async edit() {
          console.log(values);
          goNoneMode()
          // await updateDataRequest({ ...flatColorImagesField(values), id: itemIdForUpdate })
        },
        close() {},
      }[currentMode]();
    },
  });

  // handle env name input
  const [initInputWidth, setInitInputWidth] = useState("fit-content");
  const [inputDisable, setInputDisable] = useState(true);
  const allowInput = () => setInputDisable(false);
  const disableInput = () => setInputDisable(true);

  const [envImage, setEnvImage] = useState(env_image);
  const hasEnvImage = envImage !== null;

  const [canvasFrame, setCanvasFrame] = useState();
  // const canvasInitWidth = useRef(0);

  const [allowDraw, setAllowDraw] = useState(false);
  const toggleAllowDraw = () => setAllowDraw((prev) => !prev);

  const [anchors, setAnchors] = useState([]);
  const lines = anchors.reduce(
    (lineArray, anchor) => [...lineArray, anchor.x, anchor.y],
    []
  );
  const clearCircle = () => setAnchors([]);

  const [cropLines, setCropLines] = useState(cropline || []);
  const clearCropLines = () => setCropLines([]);

  // const [scaleState, setScaleState] = useState(false);
  // const scaleDrawItem = (width) => {
  //   if (!canvasFrame?.nodeType) return;
  //   const scale = canvasFrame.clientWidth / (width ?? canvasInitWidth.current);
  //   console.log(scale);
  //   anchors.length > 0 &&
  //     setAnchors((prev) =>
  //       prev.map((points) => ({
  //         x: points.x * scale,
  //         y: points.y * scale,
  //       }))
  //     );
  //   cropLines.length > 0 &&
  //     setCropLines((prev) =>
  //       prev.map((line) => line.map((point) => point * scale))
  //     );
  //   setScaleState(false);
  // };

  const clearCanvas = () => {
    clearCircle();
    clearCropLines();
  };

  const addAnchor = (e) => {
    if (!allowDraw) return;
    const state = `clickOn${
      e.target.className === "Circle" ? "Circle" : "NotCircle"
    }`;
    ({
      clickOnCircle() {
        const { x, y } = e.target.getPosition();
        setCropLines((prev) => [...prev, [...lines, x, y]]);
        clearCircle();
      },
      clickOnNotCircle() {
        const { x, y } = e.target.getStage().getPointerPosition();
        setAnchors((prev) => [...prev, { x, y }]);
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
    if (cropLines.length === 0 || !envImage) return;

    formik.setFieldValue("cropline", JSON.stringify(cropLines));

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

    canvas.toBlob((blob) => {
      const file = new File([blob], "new_mask.png", { type: "image/png" });
      formik.setFieldValue("mask_image", file);
    });
  };

  // init env name input width
  useEffect(() => {
    const el = document.createElement("span");
    document.body.appendChild(el);
    el.innerHTML = envName;
    el.style.position = "absolute";

    setInitInputWidth(el.clientWidth * 2 + "px");
    el.remove();
  }, []);

  // handle canvas size with window resize
  useEffect(() => {
    let timerId = null;
    const handleResize = () => {
      if (timerId !== null) clearTimeout(timerId);
      timerId = setTimeout(() => {
        timerId = null;
        // force rerender
        // setScaleState(true);
        clearCanvas()
        setRenderCount((prev) => prev + 1);
        clearTimeout(timerId);
      }, 100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // keep canvas frame init width
  // useEffect(() => {
  //   if (canvasInitWidth.current !== 0 || !canvasFrame?.nodeType) return;
  //   const currentWidth = canvasFrame.clientWidth;
  //   scaleDrawItem(oriWidth || currentWidth);
  //   canvasInitWidth.current = currentWidth;
  // }, [canvasFrame]);

  // useEffect(() => {
  //   if (!scaleState) return;
  //   scaleDrawItem();
  // }, [scaleState]);

  const Panel = (
    <form
      onSubmit={formik.handleSubmit}
      className="p-4 h-100 fw-bold d-flex flex-column"
    >
      {hasEnvImage ? (
        <>
          <div
            ref={setCanvasFrame}
            className="position-relative border border-2 rounded-4 bg-gray-300 border-gray-500 mb-4 align-self-center"
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
            <Stage
              key={`${renderCount}`}
              className="position-absolute top-0 left-0"
              width={canvasFrame?.nodeType ? canvasFrame.clientWidth : 0}
              height={canvasFrame?.nodeType ? canvasFrame.clientHeight : 0}
              onClick={addAnchor}
            >
              <Layer>
                {cropLines.map((cropLine, index) => (
                  <Line
                    key={index}
                    dash={[0, 0, 8, 8]}
                    fill="#33333388"
                    closed
                    points={cropLine}
                    stroke="#fff"
                    strokeWidth={3}
                    lineCap="round"
                    lineJoin="round"
                  />
                ))}
                {lines.length > 0 && (
                  <Line
                    dash={[0, 0, 10, 10]}
                    points={lines}
                    stroke="#df4b26"
                    strokeWidth={5}
                    lineCap="round"
                    lineJoin="round"
                  />
                )}
                {anchors.map((anchor, index) => (
                  <Circle
                    key={index}
                    {...{ ...anchorConfig, ...anchor }}
                    onDragMove={(e) => moveAnchor(e, index)}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-secondary w-50 me-5"
              onClick={clearCanvas}
            >
              清除畫布
            </button>
            <button
              type="button"
              className="btn btn-light-primary w-50 me-5"
              onClick={clearCircle}
            >
              清除錨點
            </button>
            <button
              type="button"
              className={`btn btn-${allowDraw ? "secondary" : "primary"} w-100`}
              onClick={() => {
                toggleAllowDraw();
                cutImage();
              }}
            >
              {!allowDraw ? "開始" : "停止"}繪製
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
            name="env_image"
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
      <div className="d-flex fs-2 pt-6 pb-4">
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
          style={{ width: initInputWidth, minWidth: "50px", maxWidth: "200px" }}
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
      <label className="d-block fs-2 text-gray-500 mb-2">備註</label>
      <textarea
        {...formik.getFieldProps("comment")}
        className="w-100 p-4 mb-8 fs-3 border-gray-300 border-2 rounded-2 flex-grow-1"
      ></textarea>
      <div className="d-flex">
        <button
          type="button"
          className="w-100 btn btn-secondary me-12"
          onClick={goNoneMode}
        >
          取消
        </button>
        <button
          type="submit"
          className="w-100 btn btn-primary"
          disabled={
            allowDraw || cropLines?.length === 0 || !formik.values["env_image"]
          }
        >
          {allowDraw ? "繪製中無法儲存" : "儲存"}
        </button>
      </div>
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
