"use strict";
/**
 * Tencent is pleased to support the open source community by making Tars available.
 *
 * Copyright (C) 2016THL A29 Limited, a Tencent company. All rights reserved.
 *
 * Licensed under the BSD 3-Clause License (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * https://opensource.org/licenses/BSD-3-Clause
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("@tars/config"));
const rpc_1 = __importDefault(require("@tars/rpc"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const webConf_1 = __importDefault(require("../config/webConf"));
const app_1 = require("../app");
const startTars = () => {
    const svr = new rpc_1.default.server(); // eslint-disable-line
    // console.log(process.env.TARS_CONFIG)
    svr.initialize(process.env.TARS_CONFIG || path_1.default.resolve(__dirname, "../dev.config.conf"), (server) => {
        app_1.appInitialize();
        let httpServer = http_1.default.createServer(app_1.app.callback());
        httpServer.on('error', (e) => {
            console.log("on error:", e);
        });
        server.addServant((endpoint) => {
            console.log(endpoint.sHost, endpoint.iPort);
            httpServer.listen(endpoint.iPort, endpoint.sHost, function () {
                console.log(`Server has been started successfully at ${endpoint.sHost}:${endpoint.iPort}`);
            });
        }, `${server.Application}.${server.ServerName}.WebObj`);
    });
    svr.start();
};
(async () => {
    if (process.env.TARS_CONFIG) {
        const tarsConfig = new config_1.default();
        webConf_1.default.config = await tarsConfig.loadConfig(`config.json`, { format: tarsConfig.FORMAT.JSON });
        console.log("initialize, in tars", webConf_1.default.config);
    }
    else {
        webConf_1.default.config = JSON.parse(fs_extra_1.default.readFileSync(path_1.default.join(__dirname, "../config/config.json"), "utf8"));
        console.log("initialize, not in tars", webConf_1.default.config);
    }
    //启动tars服务
    startTars();
})();
