import React from "react";
import { Box, Flex } from "reflexbox";
import { Layout } from "../../components/layout";
import { PreviousNextFlexContainer, PreviousNextTitle } from "./styled";
import { graphql, useStaticQuery } from "gatsby";

const Doc = ({ path, children }) => {
    const rawData = useStaticQuery(graphql`
        {
            allMdx(
                sort: {
                    order: ASC
                    fields: [frontmatter___section, frontmatter___ordering]
                }
            ) {
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
        <Layout headings={node.headings}>
            <h1>{node.frontmatter.title}</h1>
            {children}
            {(previous || next) && (
                <Flex
                    justifyContent="space-between"
                    width="100%"
                    mt="40px"
                    flexDirection={["column", "column", "row"]}
                >
                    {previous ? (
                        <Box mb="16px">
                            <PreviousNextFlexContainer to={`/${previous.slug}`}>
                                <PreviousNextTitle>Previous</PreviousNextTitle>←{" "}
                                {previous.frontmatter.title}
                            </PreviousNextFlexContainer>
                        </Box>
                    ) : (
                        <span />
                    )}
                    {next ? (
                        <Box mb="16px">
                            <PreviousNextFlexContainer to={`/${next.slug}`}>
                                <PreviousNextTitle>Next</PreviousNextTitle>
                                {next.frontmatter.title} →
                            </PreviousNextFlexContainer>
                        </Box>
                    ) : (
                        <span />
                    )}
                </Flex>
            )}
        </Layout>
    );
};

export default Doc;
