import React from "react";
import { Box, Flex } from "reflexbox";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

const Root = styled(Flex)`
    padding: 16px;
    border-radius: 8px;
    background-color: ${({ theme, mode }) => {
        switch (mode) {
            case "danger": {
                return theme.danger;
            }
            case "warning": {
                return theme.warning;
            }
            default: {
                return theme.info;
            }
        }
    }};
`;

const ModeTitle = styled.h4`
    margin-bottom: 8px;
    font-size: 12px;
    text-transform: uppercase;
`;

export const NoticeBox = ({ mode, children }) => {
    return (
        <Root mb="20px" flexDirection="column" mode={mode} p="12px 16px">
            <Box>
                <ModeTitle>{mode}</ModeTitle>
            </Box>
            <Box>
                <ReactMarkdown>{children}</ReactMarkdown>
            </Box>
        </Root>
    );
};
