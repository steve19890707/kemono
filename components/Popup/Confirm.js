import styled from "styled-components";
import noop from "lodash.noop";
// compoments
import UpdateAndCancel from "../../components/UpdateAndCancel";
// icon
import { BsExclamationTriangleFill } from "react-icons/bs";

const StyledConfirm = styled.div`
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
  .confirm-popup-content {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 500px;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 6px;
    overflow: auto;
  }
  .confirm-content {
    padding: 25px;
    display: flex;
    align-items: center;
  }
  .svg-BsExclamationTriangleFill {
    color: #f44336;
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
`;

export default function ConfirmPopup({
  content = "",
  keydownDisable = true,
  dataUpdate = noop,
  cancelPopup = noop,
}) {
  return (
    <StyledConfirm>
      <div className="popup-background">
        <div className="confirm-popup-content">
          <div className="confirm-content">
            <BsExclamationTriangleFill className="svg-BsExclamationTriangleFill" />
            <span dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          <UpdateAndCancel
            updateText={"確定"}
            disableStatus={keydownDisable}
            dataUpdate={dataUpdate}
            cancelPopup={cancelPopup}
          />
        </div>
      </div>
    </StyledConfirm>
  );
}
