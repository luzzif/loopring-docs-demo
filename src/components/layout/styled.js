import { Box, Flex } from "reflexbox";
import styled from "styled-components";

export const RootFlex = styled(Flex)`
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
`;

export const Main = styled.main`
    width: 100%;
`;

export const SideExplorerBox = styled(Box)`
    border-right: solid 1px ${({ theme }) => theme.border};
`;

export const ChildrenWrapper = styled.div`
    padding-bottom: 40px;
`;
