
export const getAddPadding = (() => {
  const checkType = (target) => {
    const type = typeof target;
    if (type === "string") return true;
    throw Error(`addPadding only accept string input but get "${type}" type.`);
  };

  return (symbol) => {
    checkType(symbol);

    return (str, digits) => {
      checkType(str);
      while (str.length < digits) str = symbol + str;
      return str;
    };
  };
})();

export const addZeroPadding = getAddPadding("0");

export const getCurrentTime = () => {
  const date = new Date();
  const month = addZeroPadding(`${date.getMonth() + 1}`, 2);
  const day = addZeroPadding(`${date.getDate()}`, 2);
  const hour = addZeroPadding(`${date.getHours()}`, 2);
  const minute = addZeroPadding(`${date.getMinutes()}`, 2);
  const second = addZeroPadding(`${date.getSeconds()}`, 2);

  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
};
