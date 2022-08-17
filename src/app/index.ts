
import PageController from "./controller/PageController";
import LocaleController from "./controller/LocaleController";
import StorageController from "./controller/StorageController";
import DataController from "./controller/DataController";
import { confType } from "../midware/type";

const pageConf: Array<confType> = [
    //首页
    ["get", "/", PageController, PageController.index],
];

const apiConf: Array<confType> = [
    ["get", "/get_locale", LocaleController, LocaleController.getLocale],
    ["get", "/list_storage", StorageController, StorageController.list],
    ["post", "/add_storage", StorageController, StorageController.add],
    ["post", "/del_storage", StorageController, StorageController.del],
    ["post", "/create_data", DataController, DataController.createData],
    ["get", "/list_table", DataController, DataController.listTable],
    ["get", "/list_queue", DataController, DataController.listQueue],
    ["post", "/list_table_data", DataController, DataController.listTableData],
    ["post", "/list_queue_data", DataController, DataController.listQueueData],
    ["post", "/delete_table_data", DataController, DataController.deleteTableData],
    ["post", "/delete_table", DataController, DataController.deleteTable],
    ["post", "/delete_queue_data", DataController, DataController.deleteQueueData],
    ["post", "/edit_table_data", DataController, DataController.editTableData],
    ["post", "/edit_queue_data", DataController, DataController.editQueueData],
    ["post", "/add_table_data", DataController, DataController.addTableData],
    ["post", "/add_queue_data", DataController, DataController.addQueueData],
    ["post", "/delete_queue", DataController, DataController.deleteQueue],

];

export { pageConf, apiConf };