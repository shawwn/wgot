const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const PACKAGE = require('../package.json');

// class FileDetails {
//     constructor (filename) {
//         const fs = require('fs');
//         this.filename = filename;
//         this.exists = fs.existsSync(filename);
//     }
// }

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

function usage() {
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


export default function main(options = {help: true}) {
    if (options.help) {
        console.log(usage());
        return 0;
    }
    if (options.version) {
        console.log(PACKAGE.version);
        return 0;
    }
    return 0;
}


if (require.main === module) {
    const options = commandLineArgs(optionDefinitions);
    const code = main(options);
    if (typeof code === 'number') {
        if (code !== 0) {
            process.exit(code);
        }
    }
}
