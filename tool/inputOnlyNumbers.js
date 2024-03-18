const onlyNumber = (event) => {
  if (
    /^\d$/.test(event.key) ||
    event.key === "Backspace" ||
    event.key === "Delete" || 
    event.key === "Escape" || 
    event.key === "Tab" || 
    event.key === "ArrowLeft" || 
    event.key === "ArrowRight" ||
    event.key === "Home" ||
    event.key === "End"
  )
    return;
  event.preventDefault();
};

export default onlyNumber;
