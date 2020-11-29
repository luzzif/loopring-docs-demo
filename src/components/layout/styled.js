import { Box, Flex } from "reflexbox";
import styled from "styled-components";

export const RootFlex = styled(Flex)`
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
`;

export const Main = styled.main`
    width: 100%;
`;

export const SpacingBox = styled(Box)`
    width: 100%;
    height: 64px;
    min-height: 64px;
    content: "";
`;
