const host = window.location.host;
const domain = "images.hfyali.com";
const domain168 = "s3.ap-northeast-1.amazonaws.com/prd-images.rebirth.games";
// 備援 images.myzsj.com
export const imageDomain = `https://${
  !!~host.indexOf("help.rebirth.games") ? domain168 : domain
}`;

export const slotImgFetch = ({ html = "", game_id = "1", imgDomain = "" }) => {
  // replace key list
  const keySwitch = (val = "") => {
    switch (val) {
      case "WW":
      case "WILD":
        return "W";
      case "SF":
      case "SC":
      case "FREE GAME ICONS":
      case "SCATTER":
      case "symbol":
      case "symbol_F":
        return "F";
      case "SB":
      case "SBS":
        return "SBS";
      case "FREE":
      case "icons":
        return "icons";
      default:
        return val;
    }
  };
  const forReplace = () => {
    let updateHtml = html;
    if (html.split('<figure class="table">').length !== 1) {
      for (
        let i = 0;
        i < html.split('<figure class="table">').length - 1;
        i++
      ) {
        updateHtml = updateHtml.replace(
          `<figure class="table">`,
          `<figure class="table-ckeditor">`,
        );
      }
    }
    const rule = new RegExp("(\\[).+?(\\])", "g");
    const replaceKeyList = html.match(rule);
    const newList = replaceKeyList?.map((v) => v.slice(1, -1));
    if (newList) {
      for (let i = 0; i < newList.length; i++) {
        updateHtml = updateHtml.replace(
          `[${newList[i]}]`,
          `<img src="${imgDomain}/order-detail/common/${game_id}/symbolList/${keySwitch(
            newList[i],
          )}.png" alt="" />`,
        );
      }
    }
    if (html.split("<p>#").length !== 1) {
      for (let i = 0; i < html.split("<p>#").length - 1; i++) {
        updateHtml = updateHtml.replace(`<p>#`, `<p class="indent">`);
      }
    }
    if (html.split("<p>!").length !== 1) {
      for (let i = 0; i < html.split("<p>!").length - 1; i++) {
        updateHtml = updateHtml.replace(`<p>!`, `<p class="img-text">`);
      }
    }
    if (html.split("<p>^").length !== 1) {
      for (let i = 0; i < html.split("<p>^").length - 1; i++) {
        updateHtml = updateHtml.replace(`<p>^`, `<p class="highlight">`);
      }
    }
    if (html.split("<p>@").length !== 1) {
      for (let i = 0; i < html.split("<p>@").length - 1; i++) {
        updateHtml = updateHtml.replace(`<p>@`, `<p class="no-dot">`);
      }
    }
    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = updateHtml;
    const newDomList = [];
    contentDiv.childNodes.forEach((value, key) => {
      if (value.tagName === "P") {
        const newDom = [];
        value.childNodes.forEach((dom) => {
          if (dom.tagName === undefined) {
            const rule = new RegExp("\\d+X|\\d+x|\\d+", "g");
            const replaceString = dom.textContent.replace(
              rule,
              (str) => `<span class="number">${str}</span>`,
            );
            newDom.push(replaceString);
          } else {
            newDom.push(dom.outerHTML);
          }
        });
        newDomList.push(`<p class="${value.className}">${newDom.join("")}</p>`);
      } else {
        newDomList.push(value.outerHTML);
      }
    });
    return newDomList.reduce((pre, value) => (pre || "") + (value || ""), "");
  };
  return forReplace();
};

// 替代代碼成圖片網址
export const createSymbol = (symbol, imgDomain = "") => {
  let result = symbol;
  const rule = new RegExp("(\\[).+?(\\])", "g");
  const match = symbol.match(rule);
  const newList = match?.map((v) => v.slice(1, -1));
  if (newList) {
    for (let i = 0; i < match.length; i++) {
      result = result.replaceAll(
        `[${newList[i]}]`,
        `<img src="${imgDomain}/help/common/currency/${newList[i]}.png" alt=""/> &nbsp;`,
      );
    }
  }
  return { __html: result };
};
