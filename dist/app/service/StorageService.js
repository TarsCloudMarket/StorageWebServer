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
Object.defineProperty(exports, "__esModule", { value: true });
const Dao_1 = require("../dao/Dao");
class StorageService {
    constructor() {
        this._dao = new Dao_1.Dao();
    }
    async initialize(config) {
        await this._dao.initialize(config);
    }
    async getStorageList() {
        return await this._dao.getStorageList();
    }
    ;
    async addStorage(obj, name) {
        return await this._dao.addStorage(obj, name);
    }
    ;
    async updateStorage(obj, name) {
        return await this._dao.updateStorage(obj, name);
    }
    ;
    async deleteStorage(obj) {
        return await this._dao.deleteStorage(obj);
    }
    ;
}
exports.default = StorageService;
