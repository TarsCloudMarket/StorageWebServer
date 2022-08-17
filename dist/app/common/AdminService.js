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
const rpc_1 = require("./rpc");
const logger_1 = __importDefault(require("../logger"));
;
class AdminService {
    static async pingNode(nodeName) {
        let ret = await rpc_1.rpcClient.getAdminRegPrx().pingNode(nodeName);
        if (ret.response.return) {
            return ret.response.arguments.result;
        }
        else {
            logger_1.default.error(`ping node: ${nodeName} error`);
            console.log(`ping node: ${nodeName} error`);
            return false;
        }
    }
    ;
}
exports.default = AdminService;
AdminService.registerPlugin = async (name, name_en, obj, type, path) => {
    let conf = new rpc_1.rpcClient.AdminRegProxy.PluginConf();
    conf.name = name;
    conf.name_en = name_en;
    conf.obj = obj;
    conf.type = type;
    conf.path = path;
    // console.log(rpcClient.getAdminRegPrx());
    // console.log(conf.toObject());
    let ret = await rpc_1.rpcClient.getAdminRegPrx().registerPlugin(conf);
    // console.log(ret);
    if (ret.response.return == 0) {
        return 0;
    }
    else {
        logger_1.default.error(`registerPlugin: ${conf} error`);
        console.log(`registerPlugin: ${conf} error`);
        return -1;
    }
};
AdminService.hasDevAuth = async (application, server_name, uid) => {
    let ret = await rpc_1.rpcClient.getAdminRegPrx().hasDevAuth(application, server_name, uid);
    if (ret.response.return == 0) {
        return ret.response.arguments.has;
    }
    else {
        logger_1.default.error(`hasDevAuth error`);
        console.log(`hasDevAuth error`);
        return false;
    }
};
AdminService.hasOpeAuth = async (application, server_name, uid) => {
    let ret = await rpc_1.rpcClient.getAdminRegPrx().hasOpeAuth(application, server_name, uid);
    if (ret.response.return == 0) {
        return ret.response.arguments.has;
    }
    else {
        logger_1.default.error(`hasDevAuth error`);
        console.log(`hasDevAuth error`);
        return false;
    }
};
AdminService.hasAdminAuth = async (uid) => {
    let ret = await rpc_1.rpcClient.getAdminRegPrx().hasAdminAuth(uid);
    if (ret.response.return == 0) {
        return ret.response.arguments.has;
    }
    else {
        logger_1.default.error(`hasAdminAuth error`);
        console.log(`hasAdminAuth error`);
        return false;
    }
};
AdminService.checkTicket = async (ticket) => {
    let ret = await rpc_1.rpcClient.getAdminRegPrx().checkTicket(ticket);
    if (ret.response.return == 0) {
        return ret.response.arguments.uid;
    }
    else {
        logger_1.default.error(`checkTicket error`);
        return '';
    }
};
