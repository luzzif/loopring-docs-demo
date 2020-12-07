const TYPE_TO_EXAMPLE_VALUE = Object.freeze({
    integer: 0,
    string: "string",
    array: [],
});

export const propertiesToJsObject = (properties) => {
    if (!properties) {
        return {};
    }
    return properties.reduce((accumulator, property) => {
        let propertyExampleValue = TYPE_TO_EXAMPLE_VALUE[property.type];
        if (property.properties) {
            propertyExampleValue = propertiesToJsObject(property.properties);
        }
        // array handling
        if (property.items) {
            // handling array of objects (including arrays of arrays)
            if (property.items.properties || property.items.items) {
                propertyExampleValue = propertiesToJsObject(
                    property.items.properties || property.items.items
                );
            } else {
                propertyExampleValue =
                    TYPE_TO_EXAMPLE_VALUE[property.items.type];
            }
            propertyExampleValue = [propertyExampleValue];
        }
        accumulator[property.name] = propertyExampleValue;
        return accumulator;
    }, {});
};

export const flattenModels = (properties) => {
    if (!properties) {
        return [];
    }
    return properties.map((accumulator, property) => {
        // not a model, but rather a primitive type
        if (!property.modelName) {
            return accumulator;
        }
        if (property.properties) {
            accumulator.push(flattenModels(property.properties));
        }
        accumulator.push(property);
        return accumulator;
    }, []);
};

export const isResponseSuccessful = (response) => {
    const code = parseInt(response.code);
    return code === 0 || (code >= 200 && code < 300);
};
