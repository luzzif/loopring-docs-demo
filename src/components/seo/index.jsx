import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

export const Seo = ({ description, image, meta, title, link }) => {
    const { site } = useStaticQuery(
        graphql`
            query {
                site {
                    siteMetadata {
                        title
                        description
                        author
                    }
                }
            }
        `
    );

    const metaDescription = description || site.siteMetadata.description;

    return (
        <Helmet
            htmlAttributes={{
                lang: "en",
            }}
            title={title}
            titleTemplate={`%s | ${site.siteMetadata.title}`}
            link={link}
            meta={[
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                {
                    name: "description",
                    content: metaDescription,
                },
                {
                    name: "image",
                    content: image,
                },
            ].concat(meta)}
        />
    );
};

Seo.defaultProps = {
    meta: [],
    link: [],
    description: "",
    image: "",
};

Seo.propTypes = {
    description: PropTypes.string,
    image: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    link: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
};
