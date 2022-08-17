"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConf = exports.pageConf = void 0;
const PageController_1 = __importDefault(require("./controller/PageController"));
const LocaleController_1 = __importDefault(require("./controller/LocaleController"));
const StorageController_1 = __importDefault(require("./controller/StorageController"));
const DataController_1 = __importDefault(require("./controller/DataController"));
const pageConf = [
    //首页
    ["get", "/", PageController_1.default, PageController_1.default.index],
];
exports.pageConf = pageConf;
const apiConf = [
    ["get", "/get_locale", LocaleController_1.default, LocaleController_1.default.getLocale],
    ["get", "/list_storage", StorageController_1.default, StorageController_1.default.list],
    ["post", "/add_storage", StorageController_1.default, StorageController_1.default.add],
    ["post", "/del_storage", StorageController_1.default, StorageController_1.default.del],
    ["post", "/create_data", DataController_1.default, DataController_1.default.createData],
    ["get", "/list_table", DataController_1.default, DataController_1.default.listTable],
    ["get", "/list_queue", DataController_1.default, DataController_1.default.listQueue],
    ["post", "/list_table_data", DataController_1.default, DataController_1.default.listTableData],
    ["post", "/list_queue_data", DataController_1.default, DataController_1.default.listQueueData],
    ["post", "/delete_table_data", DataController_1.default, DataController_1.default.deleteTableData],
    ["post", "/delete_table", DataController_1.default, DataController_1.default.deleteTable],
    ["post", "/delete_queue_data", DataController_1.default, DataController_1.default.deleteQueueData],
    ["post", "/edit_table_data", DataController_1.default, DataController_1.default.editTableData],
    ["post", "/edit_queue_data", DataController_1.default, DataController_1.default.editQueueData],
    ["post", "/add_table_data", DataController_1.default, DataController_1.default.addTableData],
    ["post", "/add_queue_data", DataController_1.default, DataController_1.default.addQueueData],
    ["post", "/delete_queue", DataController_1.default, DataController_1.default.deleteQueue],
];
exports.apiConf = apiConf;
