import styled from "styled-components";
import { commonStyles } from "../../styles/styles";
// icons
import { CiLocationArrow1 } from "react-icons/ci";

const StyledBlcokArea = styled.div`
  .block-area-title {
    background: ${commonStyles.feature3};
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    box-sizing: border-box;
    padding: 12px 16px;
    border-radius: 6px 6px 0 0;
    margin-top: 20px;
  }
  .block-area-content {
    box-sizing: border-box;
    padding: 20px 30px;
    border: 1px solid ${commonStyles.borderColor};
    border-radius: 0 6px 6px 6px;
    background: #f8f8f8;
  }
`;

export default function BlcokArea({ title = "", children = {} }) {
  return (
    <StyledBlcokArea>
      <div className="block-area-title">{title}</div>
      <div className="block-area-content">{children}</div>
    </StyledBlcokArea>
  );
}

const StyledEditBlock = styled.div`
  display: flex;
  align-items: center;
  padding-top: 20px;
  &.checkbox {
    padding-left: 110px;
  }
  .edit-caption {
    text-align: center;
    width: 100px;
    padding: 10px 0;
    margin-right: 10px;
  }
`;

export const EditBlock = ({ children = {}, className = "", caption = "" }) => {
  return (
    <StyledEditBlock className={className}>
      {caption && <div className="edit-caption">{caption}</div>}
      {children}
    </StyledEditBlock>
  );
};

const StyledCaptionBlock = styled.div`
  position: sticky;
  top: 0;
  z-index: 99;
  font-size: 18px;
  padding: 12px;
  border-bottom: 1px solid ${commonStyles.borderColor};
  background: #ffffff;
  font-style: italic;
  display: flex;
  align-items: center;
  svg {
    margin-right: 5px;
    width: 18px;
    height: 18px;
  }
`;

export const CaptionBlock = ({ text = "" }) => {
  return (
    <StyledCaptionBlock>
      <CiLocationArrow1 />
      <span>{text}</span>
    </StyledCaptionBlock>
  );
};

const StyledZoneBlock = styled.div`
  position: relative;
  border-radius: 6px;
  border: 2px solid ${commonStyles.borderColor};
  box-sizing: border-box;
  padding: 16px;
  margin-bottom: 16px;
`;

export const ZoneBlock = ({ children = {} }) => {
  return <StyledZoneBlock>{children}</StyledZoneBlock>;
};
