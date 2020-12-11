import scrollTo from "gatsby-plugin-smoothscroll";
import React from "react";
import styled from "styled-components";
import Slugger from "github-slugger";
import { Box, Flex } from "reflexbox";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const slugger = new Slugger();

const StyledHeadingListElement = styled.li`
    margin-left: ${({ depth }) => (depth > 0 ? `${(depth - 1) * 16}px` : 0)};
    margin-right: 12px;
    margin-bottom: 8px;
`;

const StyledHeadingLink = styled.a`
    text-decoration: none;
    white-space: pre;
    text-overflow: ellipsis;
    cursor: pointer;
    :hover {
        text-decoration: underline;
    }
`;

const Heading = ({ heading }) => {
    const { value, depth } = heading;
    const slug = slugger.slug(value.replace(/\d+-/g, ""));
    slugger.reset();
    return (
        <StyledHeadingListElement key={value} depth={depth}>
            <StyledHeadingLink
                onClick={() => {
                    scrollTo("#" + slug, "start");
                    window.history.pushState({}, "", "#" + slug);
                }}
            >
                {value}
            </StyledHeadingLink>
        </StyledHeadingListElement>
    );
};

const StyledTOC = styled.ul`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-self: flex-start;
    min-width: 180px;
    max-height: 70vh;
    font-size: 12px;
    list-style: none;
    text-decoration: none;
    margin: 0;
    li {
        padding: 0;
    }
`;

const BorderedDiv = styled.div`
    position: fixed;
    top: 120px;
    border-left: solid 1px ${({ theme }) => theme.border};
`;

const Icon = styled(FontAwesomeIcon)`
    font-size: 12px;
    color: ${({ theme }) => theme.textLight};
`;

const Title = styled.h4`
    margin: 0;
    font-size: 12px;
    color: ${({ theme }) => theme.textLight};
    text-transform: uppercase;
`;

const TableofContents = ({ headings }) => {
    return headings && headings.length > 0 ? (
        <Flex flexDirection="column">
            <BorderedDiv>
                <Flex alignItems="center" mb="8px" ml="16px">
                    <Box mr="8px">
                        <Icon icon={faAlignLeft} />
                    </Box>
                    <Box>
                        <Title>Contents</Title>
                    </Box>
                </Flex>
                <Box>
                    <StyledTOC headings={headings}>
                        {headings.map((heading, i) => (
                            <Heading key={i} heading={heading} />
                        ))}
                    </StyledTOC>
                </Box>
            </BorderedDiv>
        </Flex>
    ) : null;
};

export default TableofContents;
