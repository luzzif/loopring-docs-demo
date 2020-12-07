import { graphql, Link } from "gatsby";
import React, { useEffect } from "react";
import { useState } from "react";
import { Box, Flex } from "reflexbox";
import { Layout } from "../../components/layout";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
    flattenModels,
    isResponseSuccessful,
    propertiesToJsObject,
} from "../../utils/misc";
import { OptionalIcon, RequiredIcon, StyledMethodTag, Title } from "./styled";

export const pageQuery = graphql`
    query($id: String!) {
        swaggerApi(id: { eq: $id }) {
            method
            path
            description
            parameters {
                name
                description
                in
                type
            }
            responses {
                code
                description
                schema {
                    properties {
                        modelName
                        name
                        type
                        description
                        items {
                            type
                            properties {
                                modelName
                                name
                                type
                                description
                            }
                        }
                        properties {
                            type
                            name
                            description
                            items {
                                type
                            }
                        }
                    }
                }
            }
        }
    }
`;

const Api = ({ data }) => {
    const {
        swaggerApi: { method, path, description, parameters, responses },
    } = data;

    const [models, setModels] = useState([]);

    useEffect(() => {
        if (responses && responses.length > 0) {
            setModels(
                responses
                    .filter(isResponseSuccessful)
                    .map((response) =>
                        flattenModels(response.schema.properties)
                    )[0]
                    .filter((model) => !!model.modelName)
            );
        }
    }, [responses]);

    return (
        <Layout
            headings={[
                { value: "Description", depth: 2 },
                { value: "Parameters", depth: 2 },
                {
                    value: "Response structure and data models",
                    depth: 2,
                },
                ...models.map((model) => ({
                    value: model.modelName,
                    depth: 3,
                })),
                { value: "Status codes", depth: 2 },
            ]}
        >
            <Flex mb="28px" alignItems="center">
                <Box mr="12px">
                    <StyledMethodTag>{method.toUpperCase()}</StyledMethodTag>
                </Box>
                <Box flex="1">
                    <Title>{path}</Title>
                </Box>
            </Flex>
            <Box id="description">
                <h2>Description</h2>
            </Box>
            <Box mb="28px">{description}</Box>
            <Box id="parameters">
                <h2>Parameters</h2>
            </Box>
            <Box mb="28px" overflowX="auto">
                {parameters.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>In</th>
                                <th>Type</th>
                                <th>Required</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parameters.map((parameter) => (
                                <tr key={parameter.name}>
                                    <td>{parameter.name}</td>
                                    <td>{parameter.description || "-"}</td>
                                    <td>
                                        <code className="language-text">
                                            {parameter.in}
                                        </code>
                                    </td>
                                    <td>
                                        <code className="language-text">
                                            {parameter.type}
                                        </code>
                                    </td>
                                    <td>
                                        {parameter.required ? (
                                            <RequiredIcon icon={faCheck} />
                                        ) : (
                                            <OptionalIcon icon={faTimes} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    "This API has no parameters"
                )}
            </Box>
            <Box id="response-structure">
                <h2>Response structure and data models</h2>
            </Box>
            <Box mb="16px">
                <pre>
                    <code>
                        {responses
                            .filter(isResponseSuccessful)
                            .map((successfulResponse) =>
                                JSON.stringify(
                                    propertiesToJsObject(
                                        successfulResponse.schema.properties
                                    ),
                                    null,
                                    4
                                )
                            )}
                    </code>
                </pre>
            </Box>
            <Box mb="28px" overflowX="auto">
                <table>
                    <thead>
                        <tr>
                            <th>Attribute</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses
                            .filter(isResponseSuccessful)
                            .reduce((accumulator, successfulResponse) => {
                                const {
                                    properties,
                                } = successfulResponse.schema;
                                if (!properties) {
                                    return accumulator;
                                }
                                properties.forEach((property) => {
                                    accumulator.push(property);
                                });
                                return accumulator;
                            }, [])
                            .map((property, index) => (
                                <tr key={index}>
                                    <td>{property.name}</td>
                                    <td>
                                        {property.type === "object" ? (
                                            <a href={`#${property.modelName}`}>
                                                {property.modelName}
                                            </a>
                                        ) : (
                                            <code className="language-text">
                                                {property.type}
                                            </code>
                                        )}
                                    </td>
                                    <td>{property.description}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Box>
            {models.map((model) => (
                <>
                    <Box mb="16px" id={model.modelName.toLowerCase()}>
                        <h3>{model.modelName}</h3>
                    </Box>
                    <Box mb="16px">{model.description}</Box>
                    <Box mb="28px" overflowX="auto">
                        <table>
                            <thead>
                                <tr>
                                    <th>Attribute</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {model.properties.map((property, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{property.name}</td>
                                            <td>
                                                {property.type === "object" ? (
                                                    <Link
                                                        to={`#${property.modelName.toLowerCase()}`}
                                                    >
                                                        {property.modelName}
                                                    </Link>
                                                ) : (
                                                    <code className="language-text">
                                                        {property.type}
                                                    </code>
                                                )}
                                            </td>
                                            <td>{property.description}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Box>
                </>
            ))}
            <Box id="status-codes">
                <h2>Status codes</h2>
            </Box>
            <Box>
                A list of possible status code that you can receive while using
                the API, with their associated meaning.
            </Box>
            <Box overflowX="auto">
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((response) => (
                            <tr key={response.code}>
                                <td>
                                    <code className="language-text">
                                        {response.code}
                                    </code>
                                </td>
                                <td>{response.description || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Layout>
    );
};

export default Api;
