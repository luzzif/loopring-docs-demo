import React from "react";
import { Toolbar } from "./toolbar";
import { Main, RootFlex, SpacingBox } from "./styled";
import { Box } from "reflexbox";
import { GlobalStyle } from "../global-style";

export const Layout = ({ children }) => (
    <>
        <GlobalStyle />
        <RootFlex
            flex="1"
            flexDirection="column"
            minHeight="100vh"
            maxHeight="100vh"
        >
            <Box>
                <Toolbar />
            </Box>
            <SpacingBox />
            <Box flex="1" overflowY="auto">
                <Main>{children}</Main>
            </Box>
        </RootFlex>
    </>
);
