const fetch = require("node-fetch");
const fs = require("fs");
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

const API_BLACKLIST = [
    "/api/v3/reward",
    "/api/v3/user/bills",
    "/api/v3/user/financeIncome",
    "/api/v3/crawl",
    "/api/v3/exchange/withdrawalAgents",
    "/api/v3/refer",
    "/api/v3/sidecar/liquidityMining",
    "/api/v3/sidecar/liquidityMiningTotal",
    "/api/v3/sidecar/liquidityMiningRank",
    "/api/v3/sidecar/liquidityMiningConf",
    "/api/v3/sidecar/commissionReward",
    "/api/v3/sidecar/commissionRewardTotal",
    "/api/v3/sidecar/commissionRewardRank",
    "/api/v3/verifyAllEcdsa",
];

// fetch OpenAPI docs from server and create nodes
exports.sourceNodes = async ({
    actions,
    createNodeId,
    createContentDigest,
}) => {
    const { createNode } = actions;
    let specification;
    if (fs.existsSync("./swagger.json")) {
        console.log("generating docs using local swagger.sjon");
        specification = JSON.parse(
            (await fs.readFileSync("./swagger.json")).toString()
        );
    } else {
        console.log("generating docs using remote specification");
        const response = await fetch("http://uat.loopring.io/api");
        if (!response.ok) {
            throw new Error("could not fetch Swagger spec");
        }
        specification = await response.json();
    }
    const dereferencedSpecification = await $RefParser.dereference(
        populateModelNames(specification)
    );
    const flattenedSpecification = flattenProperties(dereferencedSpecification);
    Object.entries(flattenedSpecification.paths)
        .filter(
            ([path]) =>
                path.includes("/api/v3/") && API_BLACKLIST.indexOf(path) < 0
        )
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
