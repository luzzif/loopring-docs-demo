import React, { useCallback, useContext, useState } from "react";
import { Container, AnimatedMobileMenu, StyledIcon, Logo } from "./styled";
import { useStaticQuery, graphql, Link } from "gatsby";
import { Box, Flex } from "reflexbox";
import {
    ThemeManagerContext,
    ThemeSetting,
} from "gatsby-styled-components-dark-mode";
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export const Toolbar = () => {
    const { logoImage } = useStaticQuery(graphql`
        query {
            logoImage: file(relativePath: { eq: "logo.png" }) {
                childImageSharp {
                    fixed(height: 24) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
        }
    `);

    const { isDark, changeThemeSetting } = useContext(ThemeManagerContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
    };

    const handleMobileMenuOpen = () => {
        setMobileMenuOpen(true);
    };

    const handleThemeToggle = useCallback(() => {
        changeThemeSetting(isDark ? ThemeSetting.LIGHT : ThemeSetting.DARK);
    }, [changeThemeSetting, isDark]);

    return (
        <>
            <AnimatedMobileMenu
                open={mobileMenuOpen}
                onClose={handleMobileMenuClose}
            />
            <Container alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                    <Box display={["flex", "flex", "none"]} mr="24px">
                        <StyledIcon
                            icon={faBars}
                            onClick={handleMobileMenuOpen}
                        />
                    </Box>
                    <Box>
                        <Link to="/">
                            <Logo
                                fixed={logoImage.childImageSharp.fixed}
                                alt="Mini logo"
                            />
                        </Link>
                    </Box>
                </Flex>
                <Flex>
                    <Box onClick={handleThemeToggle}>
                        <StyledIcon icon={isDark ? faSun : faMoon} />
                    </Box>
                </Flex>
            </Container>
        </>
    );
};
