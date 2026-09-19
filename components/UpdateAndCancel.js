import styled from "styled-components";
import { commonStyles } from "../styles/styles";
import noop from "lodash.noop";
// compoments
import Button from "../components/Button";
// hooks
import { Keydown } from "../common-lib/hooks";

const StyledUpdateAndCancel = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 99;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 2px solid ${commonStyles.borderColor};
  background-color: #ffffffcc;
  padding: 20px 0;
  button {
    width: 125px;
  }
  .delet-btn {
    margin-right: 10px;
    background-color: red;
  }
  .update-btn {
    background-color: ${commonStyles.feature1};
    margin-right: 10px;
  }
`;

export default function UpdateAndCancel({
  updateText = "更新",
  canceltext = "取消",
  cancelOnly = false,
  disableStatus = true,
  useCancel = true,
  useDelet = false,
  styles = {},
  dataUpdate = noop,
  cancelPopup = noop,
  deletPopup = noop,
}) {
  Keydown((e) => {
    if (e.keyCode === 27 && !disableStatus) {
      cancelPopup();
    }
    if (e.keyCode === 13 && !disableStatus) {
      dataUpdate();
    }
  });
  return (
    <StyledUpdateAndCancel style={styles}>
      {!cancelOnly && (
        <Button
          content={updateText}
          className="update-btn"
          onClick={dataUpdate}
        />
      )}
      {useDelet && (
        <Button className="delet-btn" content={"刪除"} onClick={deletPopup} />
      )}
      {useCancel && <Button content={canceltext} onClick={cancelPopup} />}
    </StyledUpdateAndCancel>
  );
}
