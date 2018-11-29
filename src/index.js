const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const PACKAGE = require('../package.json');
const mkdirp = require('mkdirp');
const urlToPath = require('url-to-path');
const path = require('path');
const fs = require('fs');
const windowFetch = require('window-fetch');

class PathDetails {
    constructor (filename) {
        const fs = require('fs');
        this.filename = filename;
        this.exists = fs.existsSync(filename);
        this.isDirectory = this.exists ? fs.statSync(filename).isDirectory() : false;
    }
}

const optionDefinitions = [
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Display this usage guide'
    },
    {
        name: 'version',
        type: Boolean,
        description: 'Display version number'
    },
    {
        name: 'url',
        defaultOption: true,
        type: String,
    },
    {
        name: 'output',
        type: filename => new PathDetails(filename)
    },
    // {
    //     name: 'forcewrite',
    //     alias: 'f',
    //     type: Boolean,
    //     description: 'Force write'
    // },
    // {
    //     name: 'debuggable',
    //     alias: 'd',
    //     type: Boolean,
    //     description: 'Debuggable?'
    // },
    // {
    //     name: 'devcert',
    //     alias: 'c',
    //     description: 'Dev certificate to embed',
    //     type: filename => new FileDetails(filename)
    // },
    // {
    //     name: 'sbox',
    //     alias: 's',
    //     description: '4-char sandbox tag',
    //     type: String,
    // },
    // {
    //     name: 'seinfo',
    //     alias: 'i',
    //     description: 'SELinux SEInfo',
    //     type: String,
    // },
    // {
    //     name: 'sentinel',
    //     description: 'Sentinel type',
    //     type: Number,
    // },
    // {
    //     name: 'sentinel-version',
    //     description: 'Sentinel version',
    //     type: Number,
    // },
    // {
    //     name: 'file',
    //     defaultOption: true,
    //     type: filename => new FileDetails(filename)
    // },
];

module.exports = function(...args) {
    return module.exports.main(...args);
};

module.exports.usage = function usage() {
    return commandLineUsage([
        {
            header: `${PACKAGE.name}@${PACKAGE.version}`,
            content: `${PACKAGE.description}`,
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        },
        {
            content: PACKAGE.homepage ? `Project home: {underline ${PACKAGE.homepage}}` : undefined,
        }
    ]);
}

module.exports.save = async function save(url, data, options) {
    const p = path.parse(urlToPath({url, output: options.output}));
    mkdirp.sync(p.dir);
    fs.writeFileSync(path.join(p.dir, p.base), data);
    return data;
}
module.exports.fetch = async function fetch(url) {
    const res = await(windowFetch(url));
    return await(res.text());
}

module.exports.convert = function convert(result) {
    return result;
}

const _main = async (options = {help: true}, fetcher = module.exports.fetch, saver = module.exports.save) => {
    const usage = module.exports.usage;
    if (typeof options === 'string') {
        options = {url: options};
    }
    if (options.help) {
        console.log(usage());
        return 0;
    }
    if (options.version) {
        console.log(PACKAGE.version);
        return 0;
    }
    if (options.url == null) {
        console.error('Missing url');
        console.log(usage());
        return 1;
    }
    const text = await module.exports.convert((typeof(fetcher) === 'function') ? await(fetcher(options.url)) : fetcher);
    if (text != null) {
        await saver(options.url, text, options);
    }
    return 0;
}

module.exports.main = async function main(options = {help: true}, fetcher = module.exports.fetch, saver = module.exports.save) {
    return await(_main(options, fetcher, saver));
}

module.exports.cli = async function cli() {
    const options = commandLineArgs(optionDefinitions);
    const result = await _main(options);
    if (typeof result === 'number') {
        if (result !== 0) {
            process.exit(result);
        }
    } else if (result != null) {
        console.log(result);
    }
    process.exit(0);
}

if (require.main === module) {
    module.exports.cli();
}
