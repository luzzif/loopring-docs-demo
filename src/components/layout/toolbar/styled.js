import styled from "styled-components";
import { MobileMenu } from "./mobile-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "reflexbox";
import Image from "gatsby-image";

export const Container = styled(Flex)`
    height: 80px;
    padding: 0 32px 0 0;
    color: #000;
    width: 100%;
    z-index: 10;
    background-color: ${({ theme }) => theme.background};
    border-bottom: solid 1px ${({ theme }) => theme.border};
    box-shadow: 0 3px 8px 0 ${({ theme }) => theme.shadow};
`;

export const StyledIcon = styled(FontAwesomeIcon)`
    font-size: 16px;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
`;

export const Logo = styled(Image)`
    img {
        border-radius: 0px;
    }
`;

export const AnimatedMobileMenu = styled(MobileMenu)`
    position: fixed;
    right: 0;
    left: 0;
    top: ${(props) => (props.open ? "0" : "-120%")};
    transition: top ease 0.3s;
    z-index: 11;
    max-height: 100vh;
`;

export const Divider = styled.div`
    width: 1px;
    height: 40px;
    min-height: 40px;
    background-color: ${({ theme }) => theme.border};
`;
