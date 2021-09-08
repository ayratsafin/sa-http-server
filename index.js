const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const staticHeadersMap = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Csrf-Token, X-Requested-With, cloudSession, WbeSession, Cookie, routing_ver',
    'Access-Control-Max-Age': '1728000',
    'Access-Control-Allow-Credentials': 'true'
};

const argv = process.argv.splice(2);
const port = argv[0] || 8080;
const distPath = argv[1] || path.resolve('./application');

function setHeaders(res, origin = '*') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    Object.entries(staticHeadersMap).forEach(([name, value]) => {
        res.setHeader(name, value);
    });
}

app.use(
    (req, res, next) => {
        if (!fs.existsSync(path.join(distPath, req.path))) {
            console.error(`${req.method} request: ${req.path} | Not found!`);
            res.status(404).end();
        } else {
            next();
        }
    },
    (req, res, next) => {
        if (req.method === 'OPTIONS') {
            res.statusCode = 200;
        }
        const origin = req.headers.origin;
        setHeaders(res, origin);
        if (origin) {
            console.log(`${req.method} request: ${req.path} | Origin: ${origin}`);
        } else {
            console.log(`${req.method} request: ${req.path}`);
        }
        next();
    },
    express.static(distPath)
);

app.listen(port, () => {
    console.log(`Server started at localhost:${port}`);
}); 