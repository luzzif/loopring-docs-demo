import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle` 
    a.anchor {
        margin-right: 8px;
        path {
            stroke: ${({ theme }) => theme.text};
        }
    }
    
    a {
        :visited {
            color: ${({ theme }) => theme.primary};
        }
    }

    img {
        border-radius: 8px;
    }

    table {
        overflow: auto;
    }

    code[class*="language-"],
    pre[class*="language-"] {
        text-align: left;
        white-space: pre;
        tab-size: 4;
        hyphens: none;
        background-color: ${({ theme }) => theme.foreground};
        border-radius: 8px;
        padding: 4px;
        overflow: auto;
    }

    pre[class*="language-"] {
        overflow: auto;
        position: relative;
        padding: 12px 16px;
        border: solid 1px ${({ theme }) => theme.border};
    }

    .token.atrule {
        color: #7c4dff;
    }

    .token.attr-name {
        color: #39adb5;
    }

    .token.attr-value {
        color: #f6a434;
    }

    .token.attribute {
        color: #f6a434;
    }

    .token.boolean {
        color: #7c4dff;
    }

    .token.builtin {
        color: #39adb5;
    }

    .token.cdata {
        color: #39adb5;
    }

    .token.char {
        color: #39adb5;
    }

    .token.class {
        color: #39adb5;
    }

    .token.class-name {
        color: #6182b8;
    }

    .token.comment {
        color: #aabfc9;
    }

    .token.constant {
        color: #7c4dff;
    }

    .token.deleted {
        color: #e53935;
    }

    .token.doctype {
        color: #aabfc9;
    }

    .token.entity {
        color: #e53935;
    }

    .token.function {
        color: #7c4dff;
    }

    .token.hexcode {
        color: #f76d47;
    }

    .token.id {
        color: #7c4dff;
        font-weight: bold;
    }

    .token.important {
        color: #7c4dff;
        font-weight: bold;
    }

    .token.inserted {
        color: #39adb5;
    }

    .token.keyword {
        color: #7c4dff;
    }

    .token.number {
        color: #f76d47;
    }

    .token.operator {
        color: #39adb5;
    }

    .token.prolog {
        color: #aabfc9;
    }

    .token.property {
        color: #39adb5;
    }

    .token.pseudo-class {
        color: #f6a434;
    }

    .token.pseudo-element {
        color: #f6a434;
    }

    .token.punctuation {
        color: #39adb5;
    }

    .token.regex {
        color: #6182b8;
    }

    .token.selector {
        color: #e53935;
    }

    .token.string {
        color: #f6a434;
    }

    .token.symbol {
        color: #7c4dff;
    }

    .token.tag {
        color: #e53935;
    }

    .token.unit {
        color: #f76d47;
    }

    .token.url {
        color: #e53935;
    }

    .token.variable {
        color: #e53935;
    }
`;
