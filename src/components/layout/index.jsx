import React from "react";
import { Toolbar } from "./toolbar";
import { Main, RootFlex, SideExplorerBox, ChildrenWrapper } from "./styled";
import { Box, Flex } from "reflexbox";
import { GlobalStyle } from "../global-style";
import TableofContents from "../table-of-contents";
import SideExplorer from "../side-explorer";

export const Layout = ({ children, headings }) => (
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
            <Box flex="1">
                <Main>
                    <Flex width="100">
                        <SideExplorerBox
                            display={["none", "none", "flex"]}
                            width="24vw"
                            justifyContent="flex-end"
                            maxHeight="calc(100vh - 80px)"
                            overflowY="auto"
                        >
                            <SideExplorer />
                        </SideExplorerBox>
                        <Flex
                            flex="1"
                            overflowY="auto"
                            maxHeight="calc(100vh - 80px)"
                            pt="40px"
                        >
                            <Box
                                width={["100%", "100%", "100%", "76%"]}
                                px={["20px", "28px", "40px", "88px"]}
                            >
                                <ChildrenWrapper>{children}</ChildrenWrapper>
                            </Box>
                            <Box
                                display={["none", "none", "none", "flex"]}
                                width="24%"
                            >
                                <TableofContents headings={headings} />
                            </Box>
                        </Flex>
                    </Flex>
                </Main>
            </Box>
        </RootFlex>
    </>
);
