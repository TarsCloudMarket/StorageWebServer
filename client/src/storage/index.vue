<template>
  <el-container style="border: 1px solid #eee; min-height: 800px" id="index">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['default']" @select="handleStorageSelect">
        <el-submenu index="default">
          <template slot="title"
            ><i class="el-icon-plus" @click="addStorage"></i
            >{{ $t("storage.list") }}</template
          >

          <el-menu-item
            :index="t.obj"
            v-for="t in storageList"
            v-bind:key="t.id"
          >
            <span>
              {{ t.name }}
              <i
                class="el-icon-delete"
                style="float: right; line-height: 50px; font-size: 10px"
                @click="doDelStorage(t.obj)"
              ></i></span
          ></el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-aside
      width="200px"
      style="background-color: rgb(238, 241, 246)"
      v-if="obj"
    >
      <el-menu :default-openeds="['1']" @select="handleTableSelect">
        <el-submenu index="1">
          <template slot="title"
            ><i class="el-icon-plus" @click="addTable"></i
            >{{ $t("storage.table") }}
            <i
              class="el-icon-refresh-right"
              style="font-size: 14px"
              @click="fetchTable(obj)"
            ></i
          ></template>

          <el-menu-item :index="t" v-for="t in tableList[obj]" v-bind:key="t">{{
            t
          }}</el-menu-item>
        </el-submenu>
      </el-menu>

      <el-menu :default-openeds="['1']" @select="handleQueueSelect">
        <el-submenu index="1">
          <template slot="title"
            ><i class="el-icon-plus" @click="addQueue"></i
            >{{ $t("storage.queue") }}
            <i
              class="el-icon-refresh-right"
              style="font-size: 14px"
              @click="fetchQueue(obj)"
            ></i
          ></template>

          <el-menu-item :index="t" v-for="t in queueList[obj]" v-bind:key="t">{{
            t
          }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-main>
      <router-view
        v-if="obj && storage"
        @deleteTableQueue="deleteTableQueue"
      ></router-view>
    </el-main>

    <el-dialog
      :title="$t('storage.add')"
      :visible.sync="storageDialog.show"
      width="40%"
    >
      <el-form :model="storageDialog.model" ref="storageForm">
        <el-form-item
          :label="$t('storage.obj')"
          label-width="200"
          required
          prop="obj"
        >
          <el-input v-model="storageDialog.model.obj"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('storage.name')"
          label-width="200"
          required
          prop="name"
        >
          <el-input v-model="storageDialog.model.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storageDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="doAddStorage">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="
        this.createDialog.model.type == 'table'
          ? $t('storage.createTable')
          : $t('storage.createQueue')
      "
      :visible.sync="createDialog.show"
      width="40%"
    >
      <el-form :model="createDialog.model" ref="createForm">
        <el-form-item
          :label="$t('storage.dataName')"
          label-width="200"
          required
          prop="name"
        >
          <el-input v-model="createDialog.model.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="doCreate">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>


<script>
import moment from "moment";
export default {
  name: "StorageIndex",
  data() {
    return {
      obj: "",
      storage: "",
      tableList: {},
      queueList: {},
      storageList: [],
      createDialog: {
        show: false,
        model: {
          type: "",
          name: "",
        },
      },
      storageDialog: {
        show: false,
        model: {
          obj: "",
          name: "",
        },
      },
    };
  },
  methods: {
    handleStorageSelect(key, keyPath) {
      //   console.log("handleSelect:", key);
      this.obj = key;
      this.storage = "";
      this.fetchTable(this.obj);
      this.fetchQueue(this.obj);
    },
    handleQueueSelect(key, keyPath) {
      //   console.log("handleQueueSelect:", key);
      this.storage = key;
      this.$router.push(`/queue/${this.obj}/${key}`);
    },
    handleTableSelect(key, keyPath) {
      //   console.log("handleTableSelect:", key);
      this.storage = key;
      this.$router.push(`/table/${this.obj}/${key}`);
    },
    deleteTableQueue(obj) {
      this.storage = "";

      if (this.$route.name == "table") {
        this.fetchTable(obj);
      } else {
        this.fetchQueue(obj);
      }
    },
    fetchData() {
      this.$ajax
        .getJSON("/list_storage")
        .then((data) => {
          this.storageList = data;
          //   console.log(data);
        })
        .catch((err) => {
          this.$tip.error(
            `${this.$t("common.error")}: ${err.message || err.err_msg}`
          );
        });
    },
    fetchTable(obj) {
      this.$ajax
        .getJSON("/list_table", { obj: obj })
        .then((data) => {
          this.$set(this.tableList, obj, data);
        })
        .catch((err) => {
          this.$tip.error(
            `${this.$t("common.error")}: ${err.message || err.err_msg}`
          );
        });
    },
    fetchQueue(obj) {
      this.$ajax
        .getJSON("/list_queue", { obj: obj })
        .then((data) => {
          this.$set(this.queueList, obj, data);
        })
        .catch((err) => {
          this.$tip.error(
            `${this.$t("common.error")}: ${err.message || err.err_msg}`
          );
        });
    },
    addStorage(e) {
      this.storageDialog.show = true;
      this.storageDialog.obj = "";
      this.storageDialog.name = "";
      e.stopPropagation();
    },
    doAddStorage() {
      this.$refs["storageForm"].validate((valid) => {
        if (valid) {
          const loading = this.$Loading.show();
          this.$ajax
            .postJSON("/add_storage", this.storageDialog.model)
            .then(() => {
              this.storageDialog.show = false;
              loading.hide();
              this.fetchData();
            })
            .catch((err) => {
              loading.hide();
              this.$tip.error(
                `${this.$t("common.error")}: ${err.message || err.err_msg}`
              );
            });
        } else {
          return false;
        }
      });
    },
    doDelStorage(obj) {
      this.$confirm("此操作删除存储记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.$Loading.show();
          this.$ajax
            .postJSON("/del_storage", { obj: obj })
            .then(() => {
              loading.hide();
              this.fetchData();
            })
            .catch((err) => {
              loading.hide();
              this.$tip.error(
                `${this.$t("common.error")}: ${err.message || err.err_msg}`
              );
            });
        })
        .catch(() => {});
    },
    doCreate() {
      this.$refs["createForm"].validate((valid) => {
        if (valid) {
          const loading = this.$Loading.show();
          this.$ajax
            .postJSON("/create_data", {
              obj: this.obj,
              type: this.createDialog.model.type,
              name: this.createDialog.model.name,
            })
            .then(() => {
              this.createDialog.show = false;
              loading.hide();
              if (this.createDialog.model.type == "table") {
                this.fetchTable(this.obj);
              } else {
                this.fetchQueue(this.obj);
              }
            })
            .catch((err) => {
              loading.hide();
              this.$tip.error(
                `${this.$t("common.error")}: ${err.message || err.err_msg}`
              );
            });
        } else {
          return false;
        }
      });
    },
    addTable(e) {
      this.createDialog.show = true;
      this.createDialog.model.type = "table";

      e.stopPropagation();
    },
    addQueue(e) {
      this.createDialog.show = true;
      this.createDialog.model.type = "queue";
      e.stopPropagation();
    },
  },
  mounted() {
    this.obj = this.$route.params.obj;
    this.storage = this.$route.params[this.$route.name];

    this.fetchData();

    if (this.obj) {
      this.fetchTable(this.obj);
      this.fetchQueue(this.obj);
    }
  },
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>