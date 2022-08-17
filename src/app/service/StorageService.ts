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

import { Dao } from '../dao/Dao';

export default class StorageService {

    private _dao: Dao = new Dao();
    public async initialize(config: any) {

        await this._dao.initialize(config);
    }

    public async getStorageList() {
        return await this._dao.getStorageList();
    };

    public async addStorage(obj: string, name: string) {
        return await this._dao.addStorage(obj, name);
    };

    public async updateStorage(obj: string, name: string) {
        return await this._dao.updateStorage(obj, name);
    };

    public async deleteStorage(obj: string) {
        return await this._dao.deleteStorage(obj);
    };

}
