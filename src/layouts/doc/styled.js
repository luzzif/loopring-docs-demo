import styled from "styled-components";
import GatsbyImage from "gatsby-image";
import { Link } from "gatsby";

export const Image = styled(GatsbyImage)`
    width: 100%;
    height: 100%;
    border-radius: 24px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.19), 0 3px 3px rgba(0, 0, 0, 0.23);
`;

export const Price = styled.span`
    color: #f07d02;
    font-size: 36px;
    font-weight: 700;
`;

export const PreviousNextFlexContainer = styled(Link)`
    display: flex;
    background: ${({ theme }) => theme.foreground};
    box-shadow: 0 3px 8px 0 ${({ theme }) => theme.shadow};
    transition: box-shadow 0.2s ease;
    :active {
        box-shadow: 0 2px 4px 0 ${({ theme }) => theme.shadow};
    }
    :hover:not(:active) {
        box-shadow: 0 5px 12px 0 ${({ theme }) => theme.shadow};
    }
    flex-direction: column;
    padding: 12px 16px;
    text-decoration: none;
    color: ${({ theme }) => theme.text};
    border: solid 1px ${({ theme }) => theme.border};
    border-radius: 8px;
`;

export const PreviousNextTitle = styled.span`
    margin-bottom: 8px;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.textLight};
`;
