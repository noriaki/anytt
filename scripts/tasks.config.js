"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = [
    {
        type: 'gtfs',
        sources: [
            {
                key: 'tobus',
                name: '都営バス',
                uri: 'https://api-tokyochallenge.odpt.org/api/v4/files/Toei/data/ToeiBus-GTFS.zip',
                auth: {
                    type: 'params',
                    key: 'acl:consumerKey',
                    value: { type: 'process.env', name: 'ODPT_AUTH_TOKEN' },
                },
            },
            {
                key: 'dt-shuttle',
                name: 'ドゥトゥールシャトルバス',
                uri: null,
            },
            {
                key: 'harumi-liner',
                name: '晴海ライナー',
                uri: null,
            },
            {
                key: 'chuo-edo-bus',
                name: '中央区コミュニティバス(江戸バス)',
                uri: null,
            },
        ],
    },
];
exports.default = config;
