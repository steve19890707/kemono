import styled from "styled-components";
import { commonStyles } from "../../styles/styles";
import noop from "lodash.noop";
// compoments
import UpdateAndCancel from "../../components/UpdateAndCancel";

export const StyledPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 100;
  .popup-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #00000066;
  }
  .popup-content {
    position: relative;
    width: 90%;
    height: calc(100vh - 100px);
    margin: 50px auto;
    background-color: #fff;
    border-radius: 6px;
    overflow: auto;
  }
  .title {
    position: sticky;
    top: 0;
    z-index: 99;
    font-size: 24px;
    font-weight: bold;
    box-sizing: border-box;
    padding: 40px 40px 20px 40px;
    background-color: #fff;
    border-bottom: 2px solid ${commonStyles.borderColor};
  }
  .operation-popup {
    box-sizing: border-box;
    padding: 20px 40px;
  }
`;

export default function Popup({
  title = "Title",
  updateText = "更新",
  canceltext = "取消",
  secondPopupStatus = true,
  cancelOnly = false,
  useCancel = true,
  className = "",
  children,
  dataUpdate = noop,
  cancelPopup = noop,
}) {
  return (
    <StyledPopup className={className}>
      <div className="popup-background">
        <div className="popup-content">
          <div className="title">{title}</div>
          <div className="operation-popup">{children}</div>
          <UpdateAndCancel
            updateText={updateText}
            canceltext={canceltext}
            cancelOnly={cancelOnly}
            useCancel={useCancel}
            disableStatus={secondPopupStatus}
            dataUpdate={dataUpdate}
            cancelPopup={cancelPopup}
          />
        </div>
      </div>
    </StyledPopup>
  );
}
