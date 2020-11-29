const fetch = require("node-fetch");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

exports.createPages = async ({ actions, graphql }) => {
    const { createPage } = actions;
    const result = await graphql(`
        {
            allSwaggerApi(limit: 1000) {
                edges {
                    node {
                        id
                        operationId
                    }
                }
            }
        }
    `);
    if (result.errors) {
        result.errors.forEach(console.error);
        throw new Error(result.errors);
    }
    const { edges: apis } = result.data.allSwaggerApi;
    const apiTemplate = require.resolve("./src/layouts/api/index.jsx");
    apis.map((edge) => edge.node).forEach((node) => {
        const { id, operationId } = node;
        createPage({
            path: `/api/${operationId}`,
            component: apiTemplate,
            context: { id },
        });
    });
};

const WHITELISTED_PATHS = [
    "/api/v2/timestamp",
    "/api/v2/apiKey",
    "/api/v2/orderId",
    "/api/v2/order",
    "/api/v3/order",
    "/api/v2/batchOrders",
    "/api/v2/orders",
    "/api/v2/orders/byHash",
    "/api/v2/orders/byClientOrderId",
    "/api/v2/exchange/markets",
    "/api/v2/exchange/tokens",
    "/api/v2/exchange/info",
    "/api/v2/depth",
    "/api/v2/ticker",
    "/api/v2/candlestick",
    "/api/v2/price",
    "/api/v2/trade",
    "/api/v2/allowances",
    "/api/v2/tokenBalances",
    "/api/v2/transfer",
    "/api/v2/account",
    "/api/v2/user/createInfo",
    "/api/v2/user/updateInfo",
    "/api/v2/user/balances",
    "/api/v2/user/deposits",
    "/api/v2/user/withdrawals",
    "/api/v2/user/transfers",
    "/api/v2/user/trades",
    "/api/v2/user/feeRates",
];

const flattenProperties = (object) =>
    Object.entries(object).reduce((accumulator, [key, value]) => {
        let flattenedValue = value;
        if (key === "properties") {
            flattenedValue = Object.entries(value)
                .reduce((accumulator, [propertyName, propertySpec]) => {
                    accumulator.push({
                        name: propertyName,
                        ...propertySpec,
                    });
                    return accumulator;
                }, [])
                .map(flattenProperties);
        } else if (typeof value === "object" && !(value instanceof Array)) {
            flattenedValue = flattenProperties(value);
        }
        accumulator[key] = flattenedValue;
        return accumulator;
    }, {});

const populateModelNames = (object) =>
    Object.entries(object).reduce((accumulator, [key, value]) => {
        if (value.$ref) {
            const modelName = value.$ref.replace("#/definitions/", "");
            value.modelName = modelName;
        } else if (typeof value === "object" && !(value instanceof Array)) {
            populateModelNames(value);
        }
        accumulator[key] = value;
        return accumulator;
    }, {});

// fetch OpenAPI docs from server and create nodes
exports.sourceNodes = async ({
    actions,
    createNodeId,
    createContentDigest,
}) => {
    const { createNode } = actions;
    const response = await fetch("http://uat.loopring.io/api");
    if (!response.ok) {
        throw new Error("could not fetch Swagger spec");
    }
    const specification = await response.json();
    const dereferencedSpecification = await $RefParser.dereference(
        populateModelNames(specification)
    );
    const flattenedSpecification = flattenProperties(dereferencedSpecification);
    Object.entries(flattenedSpecification.paths)
        .filter(([path]) => WHITELISTED_PATHS.indexOf(path) >= 0)
        .forEach(([path, specification]) => {
            Object.entries(specification)
                .map(([method, specification]) => ({
                    method,
                    ...specification,
                }))
                .forEach((innerSpecification) => {
                    const responses = Object.entries(
                        innerSpecification.responses
                    ).reduce((accumulator, [code, specification]) => {
                        accumulator.push({ code, ...specification });
                        return accumulator;
                    }, []);
                    const data = {
                        path: path,
                        ...innerSpecification,
                        responses,
                    };
                    const nodeContent = JSON.stringify(data);
                    const nodeMeta = {
                        id: createNodeId(path),
                        parent: null,
                        children: [],
                        internal: {
                            type: `SwaggerApi`,
                            mediaType: `application/json`,
                            content: nodeContent,
                            contentDigest: createContentDigest(data),
                        },
                    };
                    const node = Object.assign({}, data, nodeMeta);
                    createNode(node);
                });
        });
};
