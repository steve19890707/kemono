import { IMAGES_DOMAIN } from "../common-lib/config/imagesdomain";

export const documentTitle = (lang) => {
  switch (lang) {
    case "cn":
    case "zh-cn":
      return `CQ9 GAMING CQ9游戏`;
    default:
      return `CQ9 GAMING`;
  }
};

export const getURLSearchParams = ({ query = {}, key = "" }) => {
  const querys = Object.keys(query);
  const checkKey = !!~querys.indexOf(key);
  if (checkKey) {
    return query[key];
  } else return "";
};

export const imgDomain = `${IMAGES_DOMAIN}/`;

export const getEnvironment = (host) => {
  const dev = !!~host.indexOf(":") || !!~host.indexOf("rd3-dev-");
  const qa = !!~host.indexOf("rd3-qa-");
  const int = !!~host.indexOf("cqgame.games");
  if (dev) {
    return "dev";
  } else if (qa) {
    return "qa";
  } else if (int) {
    return "int";
  } else return "master";
};

export const fetchQueryLang = (queryLang = "") => {
  switch (queryLang) {
    case "en":
      return "en";
    case "th":
      return "th";
    case "vn":
      return "vn";
    case "zh-cn":
    default:
      return "cn";
  }
};

export const storageItemInitial = (item = "", def = "") => {
  localStorage.setItem(
    item,
    localStorage.getItem(item) ? localStorage.getItem(item) : def
  );
};

export const getStorageItem = (item = "", def = "") => {
  return localStorage.getItem(item) ? localStorage.getItem(item) : def;
};

export const storageItemRemove = (items = []) => {
  for (let i = 0; i < items.length; i++) {
    localStorage.removeItem(items[i]);
  }
};

export const updateZoneProps = (props = "", item = [], setData = noop) => {
  switch (item.length) {
    case 3:
      setData((prev) => {
        const updateArray = prev[item[0]];
        updateArray.splice(item[1], 1, {
          ...prev[item[0]][item[1]],
          [item[2]]: props,
        });
        return {
          ...prev,
          [item[0]]: updateArray,
        };
      });
      break;
    case 2:
      setData((prev) => {
        return {
          ...prev,
          [item[0]]: {
            ...prev[item[0]],
            [item[1]]: props,
          },
        };
      });
      break;
    case 1:
    default:
      setData((prev) => {
        return {
          ...prev,
          [item[0]]: props,
        };
      });
      break;
  }
};

export const filterPopupType = (type = "") => {
  switch (type) {
    case "update":
      return "更新";
    case "create":
      return "新增";
    case "edit":
      return "編輯";
    default:
      return "";
  }
};

export const dateFormParsing = (date = "", type = "start") => {
  switch (type) {
    case "start":
      return `${date}${date && " 00:00:00"}`;
    case "end":
      return `${date}${date && " 23:59:59"}`;
    default:
      return date;
  }
};

export const repeatedPropList = (prop = {}, size = 0) => {
  let list = [];
  for (let i = 0; i < size; i++) {
    list.push(prop);
  }
  return list;
};

export const checkboxTextTransfer = (val = "") => {
  switch (val) {
    case "img":
      return "圖片";
    case "video":
      return "影片";
    default:
      return val;
  }
};

export const getDateFormString = (timeVal = "") => {
  return timeVal.length > 10 ? timeVal.substring(0, 10) : timeVal;
};
