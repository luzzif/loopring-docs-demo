import React, { useEffect } from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { Box, Flex } from "reflexbox";
import styled from "styled-components";
import { useState } from "react";

const Root = styled(Flex)`
    background-color: transparent;
    overflow: hidden;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    font-size: 14px;
    font-weight: ${({ currentlyActive }) => (currentlyActive ? 700 : 500)};
    color: ${({ theme, currentlyActive }) =>
        currentlyActive ? theme.textInverted : theme.primary};
    :hover {
        text-decoration: underline;
    }
`;

const TruncatedBox = styled(Box)`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const SectionHeader = styled.h3`
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.primary};
`;

const SideExplorer = () => {
    const { documentationItems, apiItems } = useStaticQuery(graphql`
        query {
            documentationItems: allMdx(
                sort: { order: ASC, fields: frontmatter___section }
            ) {
                edges {
                    node {
                        slug
                        frontmatter {
                            title
                            section
                        }
                    }
                }
            }
            apiItems: allSwaggerApi {
                edges {
                    node {
                        operationId
                        summary
                    }
                }
            }
        }
    `);

    const [groupedDocumentationItems, setGroupedDocumentationItems] = useState(
        []
    );

    useEffect(() => {
        if (
            documentationItems &&
            documentationItems.edges &&
            documentationItems.edges.length > 0
        ) {
            setGroupedDocumentationItems(
                documentationItems.edges.reduce((accumulator, edge) => {
                    const { slug, frontmatter } = edge.node;
                    const { title, section } = frontmatter;
                    if (accumulator[section]) {
                        accumulator[section].push({ slug, title });
                    } else {
                        accumulator[section] = [{ slug, title }];
                    }
                    return accumulator;
                }, {})
            );
        }
    }, [documentationItems]);

    return (
        <Root flexDirection="column">
            {Object.entries(groupedDocumentationItems)
                .sort(([sectionA], [sectionB]) =>
                    sectionA.localeCompare(sectionB)
                )
                .map(([section, items]) => {
                    return (
                        <Flex flexDirection="column" key={section} mb="20px">
                            {section && (
                                <Box height="24px" px="16px">
                                    <SectionHeader>{section}</SectionHeader>
                                </Box>
                            )}
                            {items.map((item) => {
                                const currentlyActive =
                                    window.location.pathname ===
                                    `/${item.slug}`;
                                return (
                                    <TruncatedBox
                                        key={item.slug}
                                        height="24px"
                                        px="16px"
                                    >
                                        <StyledLink
                                            to={`/${item.slug}`}
                                            currentlyActive={currentlyActive}
                                        >
                                            {currentlyActive && ">"}{" "}
                                            {item.title}
                                        </StyledLink>
                                    </TruncatedBox>
                                );
                            })}
                        </Flex>
                    );
                })}
            <Flex flexDirection="column" mb="16px">
                <Box height="24px" px="16px">
                    <SectionHeader>APIs</SectionHeader>
                </Box>
                {apiItems.edges.map(({ node: item }) => {
                    const currentlyActive =
                        window.location.pathname === `/api/${item.operationId}`;
                    return (
                        <TruncatedBox
                            key={item.operationId}
                            height="24px"
                            px="16px"
                        >
                            <StyledLink
                                to={`/api/${item.operationId}`}
                                currentlyActive={currentlyActive}
                            >
                                {currentlyActive && ">"} {item.summary}
                            </StyledLink>
                        </TruncatedBox>
                    );
                })}
            </Flex>
        </Root>
    );
};

export default SideExplorer;
