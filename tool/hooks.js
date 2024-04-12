import { useState } from "react";

export const useInputFilePath = () => {
  const [src, setSrc] = useState(null);

  const handleChooseFile = (event) => {
    const [file] = event.target.files;
    if (!file) return;
    setSrc(URL.createObjectURL(file));
  };

  return [src, handleChooseFile];
};

export const useGroupInputFilePath = () => {
  const [srcArray, setSrcArray] = useState([]);

  const handleChooseFile = (event, index) => {
    const [file] = event.target.files;
    if (!file) return;
    setSrcArray((prev) => { 
        prev[index] = URL.createObjectURL(file) 
        return [...prev]
    });
  };

  return [srcArray, handleChooseFile];
};
