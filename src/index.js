const Promise = require('bluebird');
const fs = require('fs');
const path = require('path')
const Ajv = require('ajv');
            
module.exports = function(pluginManager, repoPath, config) {
    function _getAjvInstance(fileToCheck) {
        const schemaVersion = fileToCheck.schemaVersion || 'draft-06'
        const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        ajv.addMetaSchema(require(`ajv/lib/refs/json-schema-${schemaVersion}.json`));
        return ajv;
    }

    function _loadFile(path) {
        return fs.readFileSync(path).toString();
    }

    function _loadJsonFile(path) {
        return JSON.parse(_loadFile(path));
    }

    function _loadDataFile(fileToCheck) {
        const fullFilePath = path.join(
            repoPath,
            fileToCheck.path
        );
        return _loadJsonFile(fullFilePath);
    }

    function _loadSchemaFile(fileToCheck) {
        const fullFilePath = path.join(
            repoPath,
            fileToCheck.schemaPath
        );
        return _loadJsonFile(fullFilePath);
    }

    function run(callback, level, options) {
        if (!options) {
            return Promise.reject(new Error('options have to be defined!'));
        }
        options.files.forEach(fileToCheck => {
            const ajv = _getAjvInstance(fileToCheck);
            const data = _loadDataFile(fileToCheck);
            let schema = fileToCheck.schema;
            if (fileToCheck.schemaPath) {
                schema = _loadSchemaFile(fileToCheck)
            }
            const valid = ajv.validate(schema, data);

            if (valid) {
                callback(`"${fileToCheck.path}" is valid`, true, level)
            } else {
                ajv.errors.forEach((error) => {
                    callback(`"${fileToCheck.path}" "${error.message}"`, false, level)
                })
            }
        });
        return Promise.resolve();
    }

    return { run }
}