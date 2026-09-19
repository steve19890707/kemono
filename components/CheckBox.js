import styled from "styled-components";
import noop from "lodash.noop";

const StlyedCheckBox = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  &:last-child {
    margin-bottom: 0;
  }
  label {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .check-name {
    margin-left: 5px;
  }
`;

export default function CheckBox({
  id = "",
  name = "",
  className = "",
  checked = false,
  onChange = noop,
}) {
  return (
    <StlyedCheckBox className={className} id={id}>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="check-name">{name}</div>
      </label>
    </StlyedCheckBox>
  );
}
