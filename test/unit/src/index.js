
const plugin = require('../../../src/index.js');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe(__filename, () => {
    const pluginManager = {};
    
    it('should return "vaild message" if schema matches to data', (done) => {
        const repoPath = 'test/assets/repo-valid';
        const options = { 
            files: [
                {
                    path: 'data.json',
                    schema: JSON.parse(
                        fs.readFileSync(
                            path.join( 
                                repoPath, 
                                'schema.json'
                            )
                        ).toString()
                    )
                }
            ]
        };

        plugin(pluginManager, repoPath).run((message, isValid, level) => {
            if (isValid) {
                done()
            } else {
                done(`it should never come to this point!`);
            }
        }, 0, options)
    })  

    it('should return "invaild message" if schema matches to data', (done) => {
        const repoPath = 'test/assets/repo-invalid';
        const options = { 
            files: [
                {
                    path: 'data.json',
                    schema: JSON.parse(
                        fs.readFileSync(
                            path.join( 
                                repoPath, 
                                'schema.json'
                            )
                        ).toString()
                    )
                }
            ]
        };

        plugin(pluginManager, repoPath).run((message, isValid, level) => {
            if (!isValid) {
                done()
            } else {
                done(`it should never come to this point!`);
            }
        }, 0, options)
    });

    it('should also work with schemaPath parameter', (done) => {
        const repoPath = 'test/assets/repo-valid';
        const options = { 
            files: [
                {
                    path: 'data.json',
                    schemaPath: 'schema.json'
                }
            ]
        };

        plugin(pluginManager, repoPath).run((message, isValid, level) => {
            if (isValid) {
                done()
            } else {
                done(`it should never come to this point!`);
            }
        }, 0, options)
    }) 
})