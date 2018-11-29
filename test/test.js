import 'babel-polyfill';

// test tools
import chai from 'chai';
import chaiPromised from 'chai-as-promised';
import chaiIterator from 'chai-iterator';
import chaiString from 'chai-string';
import then from 'promise';
import resumer from 'resumer';
import FormData from 'form-data';
import URLSearchParams_Polyfill from 'url-search-params';
import { URL } from 'whatwg-url';

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const { parse: parseURL, URLSearchParams } = require('url');

let convert;
try { convert = require('encoding').convert; } catch(e) { }

chai.use(chaiPromised);
chai.use(chaiIterator);
chai.use(chaiString);
const expect = chai.expect;

import TestServer from './server';

// // test subjects
// import fetch, {
// 	FetchError,
// 	Headers,
// 	Request,
// 	Response
// } from '../src/';
// import FetchErrorOrig from '../src/fetch-error.js';
// import HeadersOrig from '../src/headers.js';
// import RequestOrig from '../src/request.js';
// import ResponseOrig from '../src/response.js';
// import Body from '../src/body.js';
// import Blob from '../src/blob.js';

// test subjects
import main from '../src/';

const supportToString = ({
	[Symbol.toStringTag]: 'z'
}).toString() === '[object z]';

const local = new TestServer();
const base = `http://${local.hostname}:${local.port}/`;
let url, opts;

before(done => {
	local.start(done);
});

after(done => {
	local.stop(done);
});

describe('wgot', () => {
	it('should test', async function() {
		expect(await main()).to.equal(0);
	});
});

