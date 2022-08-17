
// import path from "path";

const webConf = {

    config: {
        dbConf: {
            database: "db_storage_config",
            model: "db_storage_config",
            host: "127.0.0.1",
            port: "3306",
            user: "tarsAdmin",
            password: "Tars@2019",
            charset: "utf8mb4",
            pool: {
                "max": 10,
                "min": 0,
                "idle": 10000
            }
        },
        port: "4300",
        path: "/plugins/base/storage"
    }

};

export default webConf;