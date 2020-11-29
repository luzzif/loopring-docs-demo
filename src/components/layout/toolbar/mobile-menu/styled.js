import styled from "styled-components";
import { Flex } from "reflexbox";

export const Root = styled(Flex)`
    background-color: ${({ theme }) => theme.background};
`;

export const IconContainer = styled.div`
    position: absolute;
    top: 20px;
    right: 24px;
`;
