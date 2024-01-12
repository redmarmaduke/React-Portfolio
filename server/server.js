const path = require('path');

require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = process.env.PORT ?? 3001;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "?";

const app = express();

// create proxy middleware for use by express
const proxyMiddleware = createProxyMiddleware({
    target: 'https://api.github.com', // target host
    changeOrigin: true, // needed for virtual hosted sites
    // add request header 'Authorization'
    headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    // rewrite the protocol from http to https
    protocolRewrite: 'https',
    // we want to verify the ssl certs
    secure: true,
});

app.use('/graphql', proxyMiddleware);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.use('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

app.listen(PORT);