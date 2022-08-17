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

import { rpcClient } from "./rpc";

import logger from '../logger';

export interface TargetType {
    application: string
    serverName: string
    nodeName: string
};

export default class AdminService {

    public static async pingNode(nodeName: string) {

        let ret = await rpcClient.getAdminRegPrx().pingNode(nodeName);

        if (ret.response.return) {
            return ret.response.arguments.result;
        } else {
            logger.error(`ping node: ${nodeName} error`);
            console.log(`ping node: ${nodeName} error`);
            return false;

        }
    };

    public static registerPlugin = async (name: string, name_en: string, obj: string, type: number, path: string) => {

        let conf = new rpcClient.AdminRegProxy.PluginConf();

        conf.name = name;
        conf.name_en = name_en;
        conf.obj = obj;
        conf.type = type;
        conf.path = path;

        // console.log(rpcClient.getAdminRegPrx());
        // console.log(conf.toObject());
        let ret = await rpcClient.getAdminRegPrx().registerPlugin(conf);

        // console.log(ret);

        if (ret.response.return == 0) {
            return 0;
        } else {
            logger.error(`registerPlugin: ${conf} error`);
            console.log(`registerPlugin: ${conf} error`);
            return -1;
        }
    };

    public static hasDevAuth = async (application: string, server_name: string, uid: string) => {

        let ret = await rpcClient.getAdminRegPrx().hasDevAuth(application, server_name, uid);

        if (ret.response.return == 0) {
            return ret.response.arguments.has;
        } else {
            logger.error(`hasDevAuth error`);
            console.log(`hasDevAuth error`);
            return false;
        }
    };

    public static hasOpeAuth = async (application: string, server_name: string, uid: string) => {

        let ret = await rpcClient.getAdminRegPrx().hasOpeAuth(application, server_name, uid);

        if (ret.response.return == 0) {
            return ret.response.arguments.has;
        } else {
            logger.error(`hasDevAuth error`);
            console.log(`hasDevAuth error`);
            return false;
        }
    };

    public static hasAdminAuth = async (uid: string) => {

        let ret = await rpcClient.getAdminRegPrx().hasAdminAuth(uid);

        if (ret.response.return == 0) {
            return ret.response.arguments.has;
        } else {
            logger.error(`hasAdminAuth error`);
            console.log(`hasAdminAuth error`);
            return false;
        }
    };

    public static checkTicket = async (ticket: string) => {

        let ret = await rpcClient.getAdminRegPrx().checkTicket(ticket);

        if (ret.response.return == 0) {
            return ret.response.arguments.uid;
        } else {
            logger.error(`checkTicket error`);
            return '';
        }
    };

}