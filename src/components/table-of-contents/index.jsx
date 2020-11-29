import scrollTo from "gatsby-plugin-smoothscroll";
import React from "react";
import styled from "styled-components";
import Slugger from "github-slugger";

const slugger = new Slugger();

const StyledHeadingListElement = styled.li`
    margin-left: ${({ depth }) => (depth > 0 ? `${depth * 16}px` : 0)};
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
    position: -webkit-sticky;
    position: sticky;
    align-self: flex-start;
    top: 40px;
    min-width: 180px;
    max-height: 70vh;
    font-size: 12px;
    list-style: none;
    text-decoration: none;
    padding: 12px 20px 8px 20px;
    li {
        padding: 0;
    }
    @media (max-width: 960px) {
        display: none;
    }
`;

const TableofContents = ({ headings }) => (
    <StyledTOC headings={headings}>
        {headings.map((heading, i) => (
            <Heading key={i} heading={heading} />
        ))}
    </StyledTOC>
);

export default TableofContents;
