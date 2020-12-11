import React, { useEffect } from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { Box, Flex } from "reflexbox";
import styled from "styled-components";
import { useState } from "react";
import { transparentize } from "polished";

const Root = styled(Flex)`
    background-color: transparent;
    overflow: hidden;
    max-width: 297px;
    ::-webkit-scrollbar {
        display: block;
        width: 4px;
    }
    ::-webkit-scrollbar-track {
        display: none;
    }
    ::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.border};
        border-radius: 2px;
    }
`;

const HoverableBox = styled(Box)`
    border-radius: 8px;
    padding: 8px 14px;
    cursor: pointer;
    background-color: ${({ currentlyActive, theme }) =>
        currentlyActive ? transparentize(0.8, theme.primary) : "transparent"};
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    :hover {
        background-color: ${({ theme }) => transparentize(0.8, theme.primary)};
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    font-size: 14px;
    color: ${({ theme }) => theme.text} !important;
`;

const SectionHeader = styled.h3`
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.textLight};
    margin-bottom: 8px;
`;

const SideExplorer = () => {
    const { documentationItems, apiItems } = useStaticQuery(graphql`
        query {
            documentationItems: allMdx(
                sort: {
                    order: ASC
                    fields: [frontmatter___section, frontmatter___ordering]
                }
            ) {
                edges {
                    node {
                        slug
                        frontmatter {
                            title
                            section
                            ordering
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
            const sectionizedItems = documentationItems.edges.reduce(
                (accumulator, edge) => {
                    const { slug, frontmatter } = edge.node;
                    const { title, section, ordering } = frontmatter;
                    if (accumulator[section]) {
                        accumulator[section].push({ slug, title, ordering });
                    } else {
                        accumulator[section] = [{ slug, title, ordering }];
                    }
                    return accumulator;
                },
                {}
            );
            // ordering section items
            Object.keys(sectionizedItems).forEach((sectionName) => {
                sectionizedItems[sectionName].sort(
                    (a, b) => a.ordering - b.ordering
                );
            });
            setGroupedDocumentationItems(sectionizedItems);
        }
    }, [documentationItems]);

    return (
        <Root
            flexDirection="column"
            overflowY="auto"
            px="16px"
            pt={["0", "0", "40px"]}
        >
            {Object.entries(groupedDocumentationItems)
                .sort(([sectionA], [sectionB]) =>
                    sectionA.localeCompare(sectionB)
                )
                .map(([section, items]) => {
                    return (
                        <Flex flexDirection="column" key={section} mb="20px">
                            {section && (
                                <Box px="16px">
                                    <SectionHeader>{section}</SectionHeader>
                                </Box>
                            )}
                            {items.map((item) => {
                                const currentlyActive =
                                    window.location.pathname ===
                                    `/${item.slug}`;
                                return (
                                    <StyledLink
                                        key={item.slug}
                                        to={`/${item.slug}`}
                                    >
                                        <HoverableBox
                                            currentlyActive={currentlyActive}
                                        >
                                            {item.title}
                                        </HoverableBox>
                                    </StyledLink>
                                );
                            })}
                        </Flex>
                    );
                })}
            <Flex flexDirection="column" mb="16px">
                <Box px="16px">
                    <SectionHeader>APIs</SectionHeader>
                </Box>
                {apiItems.edges.map(({ node: item }) => {
                    const currentlyActive =
                        window.location.pathname === `/api/${item.operationId}`;
                    return (
                        <StyledLink
                            to={`/api/${item.operationId}`}
                            key={item.operationId}
                        >
                            <HoverableBox currentlyActive={currentlyActive}>
                                {item.summary}
                            </HoverableBox>
                        </StyledLink>
                    );
                })}
            </Flex>
        </Root>
    );
};

export default SideExplorer;
