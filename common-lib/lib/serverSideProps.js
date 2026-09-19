export const userDetect = (headers = {}) => {
  const userAgent = headers["user-agent"] || "";
  let device = "desktop";
  let browser = "Safari";
  let os = "IOS";
  // browser
  if (userAgent.includes("Chrome")) {
    browser = "Chrome";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  }
  // os
  if (userAgent.includes("Android")) {
    os = "android";
  } else if (userAgent.includes("aarch64")) {
    os = "aarch64";
  } else if (userAgent.includes("Macintosh")) {
    os = "Mac OS";
  }
  // device
  if (userAgent.includes("iPad") || userAgent.includes("Surface Duo")) {
    device = "tablet";
  } else if (userAgent.includes("Mobile")) {
    device = "mobile";
  }
  return { device, browser, os, userAgent };

  // 使用:
  // * 由 getServerSideProps 傳入 req.headers 過濾參數

  // 狗皮膏藥等怪坑memo:
  // * iphone系列裝置無條件忽略瀏覽器名稱(一律顯示Safari) *
  // * 若有特例需求可從 userAgent 爬需要的參數做判讀 *
  // * 如遇到特殊裝置或特例現象，可協助依序更新或紀錄 *
};
