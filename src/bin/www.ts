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

import TarsConfig from "@tars/config";
import Tars from "@tars/rpc";
import fs from 'fs-extra';
import path from 'path';
import http from 'http';
import webConf from "../config/webConf";
import { app, appInitialize } from '../app';

const startTars = () => {

    const svr = new Tars.server() // eslint-disable-line

    // console.log(process.env.TARS_CONFIG)

    svr.initialize(process.env.TARS_CONFIG || path.resolve(__dirname, "../dev.config.conf"), (server: any) => {

        appInitialize();

        let httpServer = http.createServer(app.callback());

        httpServer.on('error', (e) => {
            console.log("on error:", e);
        });

        server.addServant((endpoint: any) => {
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
        const tarsConfig = new TarsConfig();

        webConf.config = await tarsConfig.loadConfig(`config.json`, { format: tarsConfig.FORMAT.JSON });

        console.log("initialize, in tars", webConf.config);

    } else {
        webConf.config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config/config.json"), "utf8"));
        console.log("initialize, not in tars", webConf.config);
    }

    //启动tars服务
    startTars();

})();
