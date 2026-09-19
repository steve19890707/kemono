import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import cx from "classnames";
import styled from "styled-components";
import { commonStyles } from "../styles/styles";
import { storageItemRemove } from "../lib/toolFuntions";
// icons
import { IoLink, IoMailUnreadOutline } from "react-icons/io5";
import {
  MdSecurity,
  MdHome,
  MdOutlineMiscellaneousServices,
  MdOutlineContactMail,
  MdOutlineAnnouncement,
  MdLocalActivity,
} from "react-icons/md";
import { IoMdCodeWorking } from "react-icons/io";
import { TiNews } from "react-icons/ti";
import { CiSettings } from "react-icons/ci";
import { LiaUserFriendsSolid } from "react-icons/lia";

const StyledAside = styled.div`
  width: 280px;
  height: calc(100vh - 80px);
  overflow: auto;
  background: #fff;
  box-sizing: border-box;
  border-right: 2px solid ${commonStyles.borderColor};
`;

const StyledRouteList = styled.div`
  display: flex;
  align-items: center;
  padding: 25px 25px 25px 45px;
  box-sizing: border-box;
  border-bottom: 2px solid ${commonStyles.borderColor};
  background-color: #fff;
  transition: 0.2s;
  cursor: pointer;
  .svg-icons {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
  &:hover,
  &.active {
    background-color: ${commonStyles.feature3};
    color: #fff;
  }
`;

const RouteList = ({ name = "route name", link = "/" }) => {
  const route = useRouter();
  const FetchIcons = () => {
    switch (link) {
      case "/management":
        return <MdSecurity className="svg-icons" />;
      case "/headline":
        return <IoMdCodeWorking className="svg-icons" />;
      case "/homepage":
        return <MdHome className="svg-icons" />;
      case "/services":
        return <MdOutlineMiscellaneousServices className="svg-icons" />;
      case "/topnews":
        return <TiNews className="svg-icons" />;
      case "/about":
        return <CiSettings className="svg-icons" />;
      case "/partners":
        return <LiaUserFriendsSolid className="svg-icons" />;
      case "/contact-us":
        return <MdOutlineContactMail className="svg-icons" />;
      case "/contact-us-mail":
        return <IoMailUnreadOutline className="svg-icons" />;
      case "/news":
        return <MdOutlineAnnouncement className="svg-icons" />;
      case "/activities":
        return <MdLocalActivity className="svg-icons" />;

      default:
        return <IoLink className="svg-icons" />;
    }
  };
  return (
    <StyledRouteList
      className={cx({ active: route.pathname === link })}
      onClick={() => {
        storageItemRemove(["newscategory"]);
        route.push(link);
      }}
    >
      <FetchIcons />
      <span>{name}</span>
    </StyledRouteList>
  );
};

export default function Aside() {
  const asideList = useSelector((state) => state.props.asideList);
  return (
    <StyledAside>
      {asideList.map((val, key) => (
        <RouteList key={key} name={val.name} link={val.link} />
      ))}
    </StyledAside>
  );
}
