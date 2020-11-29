import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const StyledMethodTag = styled.div`
    padding: 4px 8px;
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
`;

export const Title = styled.h1`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 2px;
    margin-bottom: 0;
`;

export const RequiredIcon = styled(FontAwesomeIcon)`
    color: ${({ theme }) => theme.positive};
`;

export const OptionalIcon = styled(FontAwesomeIcon)`
    color: ${({ theme }) => theme.negative};
`;
