import currentTable from "../globalVariable/currentTable";
import dict from "../dictionary/tableDictionary";

const { fetchUrl } = dict;
const BASEURL = process.env.NEXT_PUBLIC_BACKENDURL;
const getTableUrl = () => fetchUrl[currentTable.get()];

export const getDataRequest = async (token, { page, size }) => {
  const URL = `${BASEURL}/${getTableUrl()}?page=${page}&size=${size}`;
  try {
    const res = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return false;
    const {
      data: { total, totalPages, list },
    } = await res.json();
    return { total, totalPages, data: list };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getDataByTable = async (token, tableName) => {
  const tableUrl = fetchUrl[tableName];
  if (tableUrl === undefined)
    throw Error(`Table: ${tableName} or table fetchUrl doesn't exist.`);

  const URL = `${BASEURL}/${tableUrl}`;

  try {
    const res = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return false;
    const {
      data: { total, totalPages, list },
    } = await res.json();
    return { total, totalPages, data: list };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createDataRequest = async (token, values) => {
  const URL = `${BASEURL}/${getTableUrl()}`;

  const formData = new FormData();
  for (const key in values) {
    const value = values[key];
    if (!Array.isArray(value)) {
      formData.append(key, value);
      continue;
    }

    value.forEach((item) => {
      formData.append(key, item);
    });
  }

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) return false;
    const result = await res.json();
    console.log("submited:", result);
    return result.status;
  } catch (error) {
    console.log("error:", error);
    return false;
  }
};

export const updateDataRequest = async (token, values) => {
  const URL = `${BASEURL}/${getTableUrl()}`;

  const formData = new FormData();
  for (const key in values) {
    const value = values[key];
    if (!Array.isArray(value)) {
      formData.append(key, value);
      continue;
    }

    value.forEach((item) => {
      formData.append(
        key,
        typeof item === "object" && !(item instanceof File)
          ? JSON.stringify(item)
          : item
      );
    });
  }

  try {
    const res = await fetch(URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) return false;
    const result = await res.json();
    return result.status;
  } catch (error) {
    console.log("error:", error);
    return false;
  }
};
