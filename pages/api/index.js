import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getData } from "../../common-lib/lib";
import { storageItemRemove } from "../../lib/toolFuntions";
import axios from "axios";
import noop from "lodash.noop";

export const envHost = () => {
  const host = window.location.host;
  if (!!~host.indexOf(":") || !!~host.indexOf("-dev")) {
    return "https://rd3-dev-cq9gaming.guardians.one";
  } else if (!!~host.indexOf("-qa")) {
    return "https://rd3-qa-cq9gaming.guardians.one";
  } else if (!!~host.indexOf("cqgame.games")) {
    return "https://cq9gaming.cqgame.games";
  } else return "https://www.cq9gaming.com";
};

const apidomains = (env = "", suffix = "", lang = "", id = "", unique = "") => {
  return `${env}/api/backend${suffix}${lang && `?lang=${lang}`}${
    id && `${lang ? `&` : `?`}id=${id}`
  }${unique && unique}`;
};

const apiGetRequestHeaderOption = (authorization = "") => {
  const localAuthorization = localStorage.getItem("authorization") || "";
  return {
    method: "GET",
    headers: new Headers({
      "Content-Type": "text/json",
      Authorization: `Bearer ${
        authorization ? authorization : localAuthorization
      }`,
    }),
  };
};

const apiPostRequestHeaderOption = (param = {}, authorization = "") => {
  const localAuthorization = localStorage.getItem("authorization") || "";
  return {
    method: "POST",
    headers: new Headers({
      "Content-Type": "text/json",
      Authorization: `Bearer ${
        authorization ? authorization : localAuthorization
      }`,
    }),
    body: JSON.stringify(param),
  };
};

const apiPutRequestHeaderOption = (param = {}, authorization = "") => {
  const localAuthorization = localStorage.getItem("authorization") || "";
  return {
    method: "PUT",
    headers: new Headers({
      "Content-Type": "text/json",
      Authorization: `Bearer ${
        authorization ? authorization : localAuthorization
      }`,
    }),
    body: JSON.stringify(param),
  };
};

const apiDeleteRequestHeaderOption = (param = {}, authorization = "") => {
  const localAuthorization = localStorage.getItem("authorization") || "";
  return {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "text/json",
      Authorization: `Bearer ${
        authorization ? authorization : localAuthorization
      }`,
    }),
    body: JSON.stringify(param),
  };
};

// common manners
export const apiUpdateAction = ({
  type = "fetch",
  promise = new Promise(),
  success = noop,
  unsuccessfully = noop,
}) => {
  return promise
    .then((response) => {
      return type === "fetch" ? response.json() : getData(response, ["data"]);
    })
    .then((response) => {
      const error_msg = getData(response, ["error_msg"]);
      if (error_msg !== "SUCCESS") {
        console.error(`<ERROR ${error_msg}>`);
        const confrim = confirm(error_msg);
        if (confrim || !confrim) {
          unsuccessfully();
        }
      } else {
        success(response);
      }
    })
    .catch((error) => {
      console.error(`<ERROR ${error}>`);
      const confrim = confirm(error);
      if (confrim || !confrim) {
        unsuccessfully();
      }
    });
};

// post
export const apiPostLogin = (param = { account: "", pwd: "" }) => {
  return fetch(
    apidomains(envHost(), "/login"),
    apiPostRequestHeaderOption(param)
  );
};

export const apiPostAccountRegister = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/admin/register"),
    apiPostRequestHeaderOption(param, authorization)
  );
};

export const apiPostServiceCreate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/service/create"),
    apiPostRequestHeaderOption(param, authorization)
  );
};

export const apiPostCategoryCreate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/category/create"),
    apiPostRequestHeaderOption(param, authorization)
  );
};

export const apiPostTopnewsCreate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/ad_popup/create"),
    apiPostRequestHeaderOption(param, authorization)
  );
};

export const apiPostNewsCreate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/news/create"),
    apiPostRequestHeaderOption(param, authorization)
  );
};

export const apiPostEventCreate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/event/create"),
    apiPostRequestHeaderOption(param, authorization)
  );
};

export const apiPostContactUsReply = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/contactus/reply"),
    apiPostRequestHeaderOption(param, authorization)
  );
};

export const apiPostMediaUpload = (
  formData = new FormData(),
  authorization = "",
  type = "img",
  setDataOnProgress = noop
) => {
  const localAuthorization = localStorage.getItem("authorization") || "";
  const config = {
    headers: {
      Authorization: `Bearer ${
        authorization ? authorization : localAuthorization
      }`,
    },
    onUploadProgress: (progressEvent) => {
      if (type === "video") {
        setDataOnProgress(
          Math.ceil((progressEvent.loaded / progressEvent.total) * 100)
        );
      }
    },
  };
  return axios.post(apidomains(envHost(), "/upload/"), formData, config);
};

// put
export const apiPutEditAdmin = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/admin/edit_admin"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutHomePageUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/homepage/update"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutHeaderUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/header/update"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutAboutUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/about/update"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutServiceSort = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/service/sort"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutContactusUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/contactus/set_update"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutServiceUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/service/update"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutPartnersList = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/partners/update"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutCategorySort = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/category/sort"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutCategoryUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/category/update"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutTopnewsSort = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/ad_popup/sort"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutTopnewsUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/ad_popup/update"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutNewsSort = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/news/sort"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutNewsUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/news/update"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutEventSort = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/event/sort"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

export const apiPutEventUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/event/update"),
    apiPutRequestHeaderOption(param, authorization)
  );
};

// delete
export const apiDeleteAdminUser = (id = "", authorization = "") => {
  return fetch(
    apidomains(envHost(), `/admin/delete_admin/${id}`),
    apiDeleteRequestHeaderOption({}, authorization)
  );
};

export const apiDeleteServiceData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/service/delete"),
    apiDeleteRequestHeaderOption(param, authorization)
  );
};

export const apiDeleteCategoryData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/category/delete"),
    apiDeleteRequestHeaderOption(param, authorization)
  );
};

export const apiDeleteTopnewsData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/ad_popup/delete"),
    apiDeleteRequestHeaderOption(param, authorization)
  );
};

export const apiDeleteNewsData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/news/delete"),
    apiDeleteRequestHeaderOption(param, authorization)
  );
};

export const apiDeleteEventData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/event/delete"),
    apiDeleteRequestHeaderOption(param, authorization)
  );
};

export const apiDeleteContactUsData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/contactus/delete"),
    apiDeleteRequestHeaderOption(param, authorization)
  );
};

export const apiDeleteImage = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), `/image/delete`),
    apiDeleteRequestHeaderOption(param, authorization)
  );
};

// get
export const apiGetCounterVisit = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/counter_visit", lang),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetAdminUserInfo = (authorization = "") => {
  return fetch(
    apidomains(envHost(), "/admin/user_info"),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetAdminList = (authorization = "") => {
  return fetch(
    apidomains(envHost(), "/admin/list"),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetHeaderList = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/header/header_list", lang),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetHomePageList = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/homepage/list", lang),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetAboutList = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/about/list", lang),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetServiceList = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/service/service_list", lang),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetServiceDetail = (authorization = "", lang = "", id = 0) => {
  return fetch(
    apidomains(envHost(), "/service/service_detail", "", id),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetContactusList = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/contactus/set_list", lang),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetContactusMailList = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/contactus/list", lang),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetContactusMailDetail = (
  authorization = "",
  lang = "cn",
  id = ""
) => {
  return fetch(
    apidomains(envHost(), "/contactus/detail", lang, id),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetPartnersList = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/partners/list", lang),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetCategory = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/category/category_list", lang, "", `&class=news`),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetTopNewsList = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/ad_popup/list", lang),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetEventList = (authorization = "", lang = "cn") => {
  return fetch(
    apidomains(envHost(), "/event/event_list", lang),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetTopNewsDetail = (
  authorization = "",
  lang = "cn",
  id = 0
) => {
  return fetch(
    apidomains(envHost(), "/ad_popup/detail", lang, id),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetEventDetail = (authorization = "", lang = "cn", id = 0) => {
  return fetch(
    apidomains(envHost(), "/event/event_detail", lang, id),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetNewsList = (
  authorization = "",
  lang = "cn",
  unique = ""
) => {
  return fetch(
    apidomains(envHost(), "/news/news_list", lang, "", unique),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetNewsDetail = (
  authorization = "",
  lang = "cn",
  unique = 0
) => {
  return fetch(
    apidomains(envHost(), "/news/news_detail", lang, "", unique),
    apiGetRequestHeaderOption(authorization)
  );
};

export const apiGetImageList = (
  authorization = "",
  lang = "cn",
  unique = ""
) => {
  return fetch(
    apidomains(envHost(), "/image/list", lang, "", unique),
    apiGetRequestHeaderOption(authorization)
  );
};

export const FetchGetHook = ({
  defaultDataType = "",
  lang = "",
  query = "",
  pushPath = "/login",
  promise = new Promise(),
  isUserInfo = false,
  resquestStoppen = false,
  success = noop,
  unsuccessfully = noop,
}) => {
  const authorization = useSelector((state) => state.props.authorization);
  const router = useRouter();
  const [isMutate, setIsMutate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(defaultDataType);
  useEffect(() => {
    if (isMutate || resquestStoppen) {
      return;
    }
    setIsLoading(true);
    promise(authorization, lang, query)
      .then((response) => response.json())
      .then((data) => {
        const error_msg = getData(data, ["error_msg"]);
        if (error_msg !== "SUCCESS") {
          storageItemRemove(["authorization"]);
          console.error(`<ERROR ${error_msg}>`);
          if (!isUserInfo) {
            const confrim = confirm(
              error_msg === "Undefined Error (SESSION_NOT_EXIST)"
                ? "登入驗證已失效，請嘗試重新登入"
                : error_msg
            );
            if (confrim || !confrim) {
              setIsLoading(false);
              unsuccessfully();
              router.push(pushPath);
            }
          } else {
            // isUserInfo
            setIsLoading(false);
            unsuccessfully();
          }
        } else {
          setIsLoading(false);
          setData(getData(data, ["result"], defaultDataType));
          success(getData(data, ["result"], defaultDataType));
        }
      })
      .catch((error) => {
        storageItemRemove(["authorization"]);
        console.error(`<ERROR ${error}>`);
        const confrim = confirm(error);
        if (confrim || !confrim) {
          setIsLoading(false);
          unsuccessfully();
          router.push(pushPath);
        }
      });
  }, [isMutate, resquestStoppen, lang]);
  useEffect(() => {
    setIsMutate(false);
  }, [isMutate]);
  return {
    isLoading,
    data,
    mutate: () => setIsMutate(true),
  };
};

export const FetchGetCustomHook = ({
  defaultDataType = "",
  lang = "",
  pushPath = "/login",
  promise = new Promise(),
  resquestStoppen = true,
  // params
  categoryId = "",
  success = noop,
  unsuccessfully = noop,
}) => {
  const authorization = useSelector((state) => state.props.authorization);
  const router = useRouter();
  const [isMutate, setIsMutate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(defaultDataType);
  useEffect(() => {
    if (isMutate || resquestStoppen) {
      return;
    }
    setIsLoading(true);
    promise(authorization, lang, `&category_id=${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        const error_msg = getData(data, ["error_msg"]);
        if (error_msg !== "SUCCESS") {
          storageItemRemove(["authorization"]);
          console.error(`<ERROR ${error_msg}>`);
          const confrim = confirm(error_msg);
          if (confrim || !confrim) {
            setIsLoading(false);
            unsuccessfully();
            router.push(pushPath);
          }
        } else {
          setIsLoading(false);
          setData(getData(data, ["result"], defaultDataType));
          success(getData(data, ["result"], defaultDataType));
        }
      })
      .catch((error) => {
        storageItemRemove(["authorization"]);
        console.error(`<ERROR ${error}>`);
        const confrim = confirm(error);
        if (confrim || !confrim) {
          setIsLoading(false);
          unsuccessfully();
          router.push(pushPath);
        }
      });
  }, [isMutate, resquestStoppen, lang, categoryId]);
  useEffect(() => {
    setIsMutate(false);
  }, [isMutate]);
  return {
    isLoading,
    data,
    mutate: () => setIsMutate(true),
  };
};
