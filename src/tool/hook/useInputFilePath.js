import { useState } from "react"

const useInputFilePath = () => {
    const [src, setSrc] = useState(null)

    const handleChooseFile = (event) => {
        const [ file ] = event.target.files
        if(!file) return
        setSrc(URL.createObjectURL(file))
    }

    return [src, handleChooseFile]
}

export default useInputFilePath