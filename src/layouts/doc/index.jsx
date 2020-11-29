import React from "react";
import { Box, Flex } from "reflexbox";
import { Layout } from "../../components/layout";
import TableofContents from "../../components/table-of-contents";
import { PreviousNextFlexContainer, PreviousNextTitle, Title } from "./styled";
import { graphql, useStaticQuery } from "gatsby";
import SideExplorer from "../../components/side-explorer";

const Doc = ({ path, children }) => {
    const rawData = useStaticQuery(graphql`
        {
            allMdx(sort: { order: ASC, fields: frontmatter___section }) {
                edges {
                    node {
                        headings {
                            value
                            depth
                        }
                        frontmatter {
                            title
                        }
                        slug
                    }
                    next {
                        frontmatter {
                            title
                        }
                        slug
                    }
                    previous {
                        frontmatter {
                            title
                        }
                        slug
                    }
                }
            }
        }
    `);

    const { node, previous, next } = rawData.allMdx.edges.find(({ node }) => {
        return node.slug === path.replaceAll("/", "");
    });

    return (
        <Layout>
            <Flex
                justifyContent="center"
                width="100%"
                pt={["20px", "20px", "40px"]}
            >
                <Box
                    display={["none", "none", "flex"]}
                    width="20%"
                    mb="80px"
                    justifyContent="flex-end"
                    pr="40px"
                >
                    <SideExplorer />
                </Box>
                <Box width={["100%", "100%", "40%"]} px="20px" mb="80px">
                    <Title>{node.frontmatter.title}</Title>
                    {children}
                    {(previous || next) && (
                        <Flex
                            justifyContent="space-between"
                            width="100%"
                            mt="40px"
                            flexDirection={["column", "column", "row"]}
                        >
                            {previous ? (
                                <PreviousNextFlexContainer
                                    to={`/${previous.slug}`}
                                >
                                    <PreviousNextTitle>
                                        Previous
                                    </PreviousNextTitle>
                                    ← {previous.frontmatter.title}
                                </PreviousNextFlexContainer>
                            ) : (
                                <span />
                            )}
                            {next ? (
                                <PreviousNextFlexContainer to={`/${next.slug}`}>
                                    <PreviousNextTitle>Next</PreviousNextTitle>
                                    {next.frontmatter.title} →
                                </PreviousNextFlexContainer>
                            ) : (
                                <span />
                            )}
                        </Flex>
                    )}
                </Box>
                <Box display={["none", "none", "flex"]} px="40px" width="20%">
                    <TableofContents headings={node.headings} />
                </Box>
            </Flex>
        </Layout>
    );
};

export default Doc;
