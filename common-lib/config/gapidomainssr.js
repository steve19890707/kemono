const apiDomain = "guardians.one";
const apiDomainProd = "cypghg.com";
const apiDomainPrefix = "rd3-";

const domains = {
  dev: `${apiDomainPrefix}dev-gapi.${apiDomain}/api`,
  qa: `${apiDomainPrefix}qa-gapi.${apiDomain}/api`,
  int: `${apiDomainPrefix}int-gapi.${apiDomain}/api`,
  clinetInt: `gapi.cqgame.games/api`,
  fifaInt: `int-fifaworldcup2022.rebirth.games/api`,
  prod: `gapi.${apiDomainProd}/api`,
  fifaProd: `fifaworldcup2022.rebirth.games/api`,
};
export const fetchGapiDomainSSR = ({
  getDev = "dev-",
  getQa = "qa-",
  getInt = "int-",
  getInt2 = "cqgame.games",
  getFifaInt = "int-fifaworldcup2022",
  getFifaProd = "fifaworldcup2022",
  isclinetInt = false,
  protocol = "https:",
  host = "",
  preferProdSite = "",
}) => {
  const local = !!~host.indexOf(":");
  const isDev = !!~host.indexOf(getDev);
  const isQa = !!~host.indexOf(getQa);
  const isInt = !!~host.indexOf(getInt);
  const isInt2 = !!~host.indexOf(getInt2);
  const isFifaInt = !!~host.indexOf(getFifaInt);
  const isFifaProd = !!~host.indexOf(getFifaProd);
  if (local || isDev) {
    return `${protocol}//${domains.dev}`;
  } else if (isQa) {
    return `${protocol}//${domains.qa}`;
  } else if (isInt || isInt2) {
    return isclinetInt
      ? `${protocol}//${domains.clinetInt}`
      : `${protocol}//${domains.int}`;
  } else if (isFifaInt) {
    return `${protocol}//${domains.fifaInt}`;
  } else if (isFifaProd) {
    return `${protocol}//${domains.fifaProd}`;
  } else
    return `${protocol}//${
      preferProdSite ? `${preferProdSite}/api` : domains.prod
    }`;
};
