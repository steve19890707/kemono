export const langauge = [
  "简中",
  "English",
  "ประเทศไทย",
  "日本語",
  "한국인",
  "español",
  "Português",
  "Indonesia",
  "Tiếng Việt",
];

export const langaugeTranslation = (num = Number()) => {
  switch (num) {
    case 1:
      return "en";
    case 2:
      return "th";
    case 3:
      return "jp";
    case 4:
      return "ko";
    case 5:
      return "es";
    case 6:
      return "pt-br";
    case 7:
      return "id";
    case 8:
      return "vn";
    case 0:
    default:
      return "cn";
  }
};

export const defaultPaths = [
  {
    key: "1",
    name: "權限管理",
    link: "/management",
  },
  {
    key: "2",
    name: "網頁標題設定",
    link: "/headline",
  },
  {
    key: "3",
    name: "前台首頁",
    link: "/homepage",
  },
  {
    key: "4",
    name: "關於CQ9設定",
    link: "/about",
  },
  {
    key: "5",
    name: "彈跳廣告",
    link: "/topnews",
  },
  {
    key: "6",
    name: "合作夥伴",
    link: "/partners",
  },
  {
    key: "7",
    name: "服務項目",
    link: "/services",
  },
  {
    key: "8",
    name: "聯絡我們(設定)",
    link: "/contact-us",
  },
  {
    key: "9",
    name: "聯絡我們(信件)",
    link: "/contact-us-mail",
  },
  {
    key: "10",
    name: "最新消息",
    link: "/news",
  },
  {
    key: "11",
    name: "品牌活動",
    link: "/activities",
  },
];

export const clientSideHost = (lang = "cn") => {
  const host = window.location.host;
  if (!!~host.indexOf(":") || !!~host.indexOf("-dev")) {
    return `https://rd3-dev-cq9gaming.guardians.one/${lang}`;
  } else if (!!~host.indexOf("-qa")) {
    return `https://rd3-qa-cq9gaming.guardians.one/${lang}`;
  } else if (!!~host.indexOf("cqgame.games")) {
    return `https://cq9gaming.cqgame.games/${lang}`;
  } else return `https://www.cq9gaming.com/${lang}`;
};
