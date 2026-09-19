// get 取JSON資料用
export const getData = (val, key = [], empty = "") => {
  let getData = val;
  const valChecked = val !== undefined || val !== null;
  const keyChecked = Array.isArray(key) && key.length > 0;
  if (valChecked && keyChecked) {
    for (let i = 0; i < key.length; i++) {
      if (getData[key[i]] !== undefined) {
        getData = getData[key[i]];
      } else {
        getData = empty;
      }
    }
    // defense prototype link function() return
    if (typeof getData === "function" && key[key.length - 1] === "link") {
      return empty;
    } else return getData;
  } else {
    return empty;
  }
};
// last 取最後一個值
export const getLast = (val = []) => {
  return val[val.length - 1];
};
// take 取得前幾筆
export const takeData = (val = [], num = 0) => {
  if (num === 0) return val;
  return val.filter((value, key) => key < num);
};
// 更新指定陣列位置
export const updateArrayIndex = (index = 0, array = [], updateData = {}) => {
  const updateArray = [];
  array.map((v, k) => {
    if (index === k) {
      return updateArray.push(updateData);
    } else return updateArray.push(v);
  });
  return updateArray;
};
// res 資料處理專用 如果api錯誤回傳空物件轉換成空陣列
export const detectEmptyObjectReturnArray = (data = []) => {
  const emptyArray = [];
  if (data === undefined || data === null) {
    return emptyArray;
  }
  if (typeof data === "object" && Object.keys(data || []).length === 0) {
    return emptyArray;
  }
  return data;
};

// 產生隨機亂數後綴
export const randomMakeId = (length = 0) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// 跨其他網站產品連結
export const acrossDomain = (
  env = "",
  across = { dev: "", qa: "", int: "", prod: "" }
) => {
  switch (env) {
    case "dev":
      return `https://${across.dev}`;
    case "qa":
      return `https://${across.qa}`;
    case "int":
      return `https://${across.int}`;
    case "master":
    default:
      return `https://${across.prod}`;
  }
};
