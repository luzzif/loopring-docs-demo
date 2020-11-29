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
        td {
            border-bottom: solid 1px ${({ theme }) => theme.border};
        }
        th {
            border-bottom: solid 1px ${({ theme }) => theme.border};
        }
    }

    code,
    pre {
        text-align: left;
        white-space: pre;
        tab-size: 4;
        hyphens: none;
        background-color: ${({ theme }) => theme.foreground};
        border-radius: 8px;
        overflow: auto;
        position: relative;
        padding: 12px 16px;
    }
    
    code {
        padding: 4px;
    }
    
    pre {
        border: solid 1px ${({ theme }) => theme.border};
    }
`;
