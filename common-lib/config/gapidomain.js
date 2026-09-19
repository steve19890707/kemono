const host = window.location.host;
const protocol = "https:";
const apiDomain = process.env.REACT_APP_API_DOMAIN || "guardians.one";
const apiDomainProd = process.env.REACT_APP_API_DOMAIN_PROD || "cypghg.com";
const apiDomainPrefix = process.env.REACT_APP_API_DOMAIN_PREFIX || "";
export const domains = {
  dev: `${apiDomainPrefix}dev-gapi.${apiDomain}/api`,
  qa: `${apiDomainPrefix}qa-gapi.${apiDomain}/api`,
  int: `${apiDomainPrefix}int-gapi.${apiDomain}/api`,
  clinetInt: `gapi.cqgame.games/api`,
  prod: `gapi.${apiDomainProd}/api`,
};
const checkCondition = (condition) => {
  if (Array.isArray(condition)) {
    return condition.some((item) => !!~host.indexOf(item));
  }
  return !!~host.indexOf(condition);
};

export const fetchGapiDomain = ({
  getDev = "dev-",
  getQa = "qa-",
  getInt = ["int-", "twp999.games"],
  isclinetInt = false,
}) => {
  const local = !!~host.indexOf(":");
  const isDev = checkCondition(getDev);
  const isQa = checkCondition(getQa);
  const isInt = checkCondition(getInt);
  if (local || isDev) {
    return `${protocol}//${domains.dev}`;
  } else if (isQa) {
    return `${protocol}//${domains.qa}`;
    // } else if (is168) {
    //   return `${protocol}//${host}/api`;
  } else if (isInt) {
    return isclinetInt
      ? `${protocol}//${domains.clinetInt}`
      : `${protocol}//${domains.int}`;
  } else return `${protocol}//${domains.prod}`;
};
