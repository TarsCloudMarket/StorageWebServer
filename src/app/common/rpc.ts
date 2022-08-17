

import { client } from "@tars/rpc";
import { Base as StorageProxy } from "./protocol/StorageProxy";
import { tars } from "./protocol/AdminRegProxy";

if (!process.env.TARS_CONFIG) {
    client.setProperty("locator", "tars.tarsregistry.QueryObj@tcp -h 127.0.0.1 -p 17890");
}

//tars环境自动寻址,非tars写死
let servant = "";

//本地启动读取配置
if (!process.env.TARS_CONFIG) {
    servant = "@tcp -h 42.193.249.129 -p 8080 -t 60000";
}

export class rpcClient {

    public static StorageProxy = StorageProxy;
    public static AdminRegProxy = tars;

    protected static storagePrx = new Map<string, StorageProxy.StorageProxy>();

    protected static adminRegPrx: tars.AdminRegProxy;

    public static getStoragePrx(obj: string): StorageProxy.StorageProxy {
        if (!this.storagePrx.has(obj)) {

            this.storagePrx.set(obj, client.stringToProxy(this.StorageProxy.StorageProxy, obj + servant));

        }
        return this.storagePrx.get(obj)!;
    }

    public static getAdminRegPrx(): tars.AdminRegProxy {
        if (!this.adminRegPrx) {
            this.adminRegPrx = client.stringToProxy(tars.AdminRegProxy, "tars.tarsAdminRegistry.AdminRegObj" + servant);
        }
        return this.adminRegPrx!;
    }
}

