import { Box, Button, Grid, Typography } from "@mui/material";
import styled, { css, keyframes } from "styled-components";
import { PALETTE } from "../../../constants/index";

export const shine = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const recurringShine = css`
  background: linear-gradient(
    to left,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.1) 40%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% auto;
  animation: ${shine} 1.5s linear infinite;
`;

export const DrawerContainer = styled(Box)`
  position: fixed;
  right: 0;
  top: 100px;
  height: calc(100vh - 100px); // full height - Navbar
  z-index: 1000;
  display: flex;
  align-items: center;
`;

export const Drawer = styled(Box)<{ is_open: boolean }>`
  width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  border-left: 2px solid #ccc;
  transform: translateX(${(props) => (props.is_open ? "0" : "100%")});
  transition: transform 0.3s ease;
  padding: 1rem;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
`;

export const ActionsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ShiningButton = styled(Button)<{ has_changes?: string }>`
  color: white; 
  ${({has_changes}) => has_changes === "true" ? `backgroundColor: ${PALETTE.ShineButton}!important;` : ""};
  ${({has_changes}) => has_changes === "true" ? css` ${recurringShine}`: ""}
`;

export const RejectActionButton = styled(Button)`
  width: 100%;
`;

export const ActionButton = styled(Button)`
  width: 100%;
`;

export const DescriptionText = styled("div")`
  color: grey;
  font-size: 0.8rem;
  line-height: 1.2rem;
  word-wrap: break-word;
  white-space: pre-wrap;
  margin-top: 0.5rem;
`;

export const ChangesContainer = styled(Box)`
  margin-top: 2rem;
  flex: 1;
  overflow-y: auto;
`;

export const StyledRevisionInfo = styled(Box)<{ border_color: string }>`
  display: flex;
  position: absolute;
  top: 10px;
  right: 10px;
  justify-content: center;
  align-items: center;
  background-color: ${({ border_color }) => border_color};
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  text-align: center;
  z-index: 10;
  max-width: 200px;
`;

export const StyledLayout = styled.div<{
  $full_width: string;
  $no_breadcrumbs: string;
}>`
  position: relative;
  background: transparent;
  max-width: ${({ $full_width }) =>
    $full_width === "true" ? "100%" : "1440px"};
  transform: ${({ $no_breadcrumbs }) =>
    $no_breadcrumbs === "true" ? `translateY(-120px)` : `translateY(-80px)`};
  margin: 0 auto;
  z-index: 1200;
  padding-bottom: 210px; /* Account for fixed footer */
`;

export const WhitePaperContainer = styled.div<{ padding?: string, narrow_and_centered?: boolean }>`
  background: ${PALETTE.White};
  width: 100%;
  border-radius: 0.5rem;
  padding-bottom: 1rem;
  padding: ${({ padding }) => (padding ? padding : "")};
  max-width: ${({ narrow_and_centered }) => narrow_and_centered ? "800px" : "100%"};
  margin: ${({ narrow_and_centered }) => narrow_and_centered ? "0 auto" : "0"};
`;

export const PreventiveFormContainer = styled(Grid) <{ border_color?: string }>`
  box-sizing: border-box;
  position: relative;
  flex: 2;
  padding: 1rem 1.5rem 200px 1.5rem;
  border: ${({ border_color }) => border_color === 'transparent' ? 'none' : `4px solid ${border_color}`};
  border-radius: .5rem;
`;

export const FullWidthContainer = styled("div")`
  display: flex;
  width: 100%;
  margin: 0 auto;
`;

export const DocumentManagementPanelContainer = styled(Grid)`
  width: 100%;
  min-width: 450px;
  border-radius: .5rem;
  flex: 1;
  overflow-y: auto;
  height: 100%;
`;

export const ClosedOverlay = styled(Box)`
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 6rem;
  color: red;
  z-index: 1400;
  background-color: white;
  border: 4px solid red;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
`;