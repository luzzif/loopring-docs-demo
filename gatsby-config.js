const commonColors = {
    primary: "#1c60ff",
    positive: "#00c853",
    negative: "#c62828",
};

module.exports = {
    siteMetadata: {
        title: "Loopring docs",
        description: "Documentation for the Loopring platform.",
        author: "@luzzif",
        siteUrl: "https://docs.loopring.io",
    },
    plugins: [
        "gatsby-plugin-react-helmet",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "images",
                path: `${__dirname}/src/images`,
            },
        },
        "gatsby-transformer-sharp",
        "gatsby-plugin-sharp",
        {
            resolve: "gatsby-plugin-typography",
            options: {
                pathToConfigModule: "src/utils/typography",
                omitGoogleFont: true,
            },
        },
        "gatsby-plugin-styled-components",
        "gatsby-plugin-smoothscroll",
        {
            resolve: "gatsby-styled-components-dark-mode",
            options: {
                light: {
                    ...commonColors,
                    background: "#edf2f7",
                    foreground: "#dfe6ef",
                    border: "#b9ccdf",
                    textLight: "#999999",
                    text: "#0e062d",
                    textInverted: "#F1F9D2",
                    shadow: "rgba(0, 0, 0, 0.4)",
                    placeholder: "#999999",
                    info: "#B3E5FC",
                    danger: "#ffcdd2",
                    warning: "#FFECB3",
                },
                dark: {
                    ...commonColors,
                    background: "#18191b",
                    foreground: "#0d0d0d",
                    border: "#2e3238",
                    textLight: "#737373",
                    text: "#fff",
                    textInverted: "#0e062d",
                    shadow: "rgba(255, 255, 255, 0.1)",
                    placeholder: "#737373",
                    info: "#03A9F4",
                    danger: "#F44336",
                    warning: "#FF9800",
                },
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "pages",
                path: `${__dirname}/src/pages`,
            },
        },
        {
            resolve: "gatsby-plugin-mdx",
            options: {
                defaultLayouts: {
                    default: `${__dirname}/src/layouts/doc/index.jsx`,
                },
                extensions: [".md", ".mdx"],
                gatsbyRemarkPlugins: [
                    {
                        resolve: "gatsby-remark-autolink-headers",
                        options: { offsetY: 24 },
                    },
                    {
                        resolve: "gatsby-remark-images",
                        options: { maxWidth: 2048 },
                    },
                    {
                        resolve: "gatsby-remark-copy-linked-files",
                        options: {
                            destinationDir: "static",
                        },
                    },
                ],
            },
        },
    ],
};
