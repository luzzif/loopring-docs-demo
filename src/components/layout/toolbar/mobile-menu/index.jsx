import React from "react";
import { StyledIcon } from "../styled";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Box } from "reflexbox";
import { IconContainer, Root } from "./styled";
import SideExplorer from "../../../side-explorer";

export const MobileMenu = ({ onClose, ...rest }) => (
    <Root flexDirection="column" alignItems="center" {...rest}>
        <IconContainer>
            <StyledIcon icon={faTimes} onClick={onClose} />
        </IconContainer>
        <Box width="100%" p="24px" overflowY="auto">
            <SideExplorer />
        </Box>
    </Root>
);
