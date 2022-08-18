<template>
  <div class="userList">
    <el-card>
      <!--查询-->
      <el-form :inline="true" :model="query" size="small">
        <el-tag>{{ getTable() }}</el-tag>
        &nbsp;&nbsp;

        <el-form-item label="Mkey">
          <el-input
            v-model="query.mkey"
            :clearable="true"
            size="mini"
            placeholder="MKey"
          ></el-input>
        </el-form-item>

        <el-form-item label="Ukey">
          <el-input
            v-model="query.ukey"
            :clearable="true"
            size="mini"
            placeholder="UKey"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-switch
            size="mini"
            v-model="query.forward"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="逆序"
            inactive-text="正序"
            @change="fetchData"
          >
          </el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="fetchData"
            >查询</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button size="mini" type="primary" @click="addData()">{{
            $t("storage.data.add")
          }}</el-button>
          &nbsp;
          <i class="el-icon-refresh-right" @click="fetchData()"></i>
        </el-form-item>

        <el-form-item style="float: right">
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            @confirm="handleDeleteTable()"
            title="确定删除当前数据表么？"
          >
            <el-button slot="reference" size="mini" type="danger">{{
              $t("storage.deleteTable")
            }}</el-button>
          </el-popconfirm>
        </el-form-item>
      </el-form>

      <el-table :data="dataList" border stripe style="width: 100%">
        <el-table-column
          width="250px"
          prop="skey.mkey"
          :label="$t('storage.data.mkey')"
        ></el-table-column>
        <el-table-column
          width="200px"
          prop="skey.ukey"
          :label="$t('storage.data.ukey')"
        ></el-table-column>
        <el-table-column
          width="100px"
          prop="svalue.version"
          :label="$t('storage.data.version')"
        >
        </el-table-column>
        <el-table-column
          width="150px"
          prop="svalue.expireTime"
          :label="$t('storage.data.expireTime')"
        >
        </el-table-column>
        <el-table-column
          width="100px"
          prop="svalue.timestamp"
          :label="$t('storage.data.timestamp')"
        >
        </el-table-column>
        <el-table-column :label="$t('storage.data.data')">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" placement="top-start">
              <pre slot="content">{{ scope.row.svalue.data }}</pre>
              <span>{{ scope.row.svalue.data.length }} bytes</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column fixed="right" :label="$t('storage.data.operator')">
          <template slot-scope="scope">
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              @confirm="handleDelete(scope.row)"
              title="确定删除这条数据么？"
            >
              <el-button slot="reference" type="text" size="small">{{
                $t("storage.data.delete")
              }}</el-button>
            </el-popconfirm>
            &nbsp;
            <el-button
              @click="handleEdit(scope.row)"
              type="text"
              size="small"
              >{{ $t("storage.data.edit") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-divider content-position="center" v-if="this.dataList.length > 0"
        ><span @click="moreData" style="cursor: pointer"
          >more~~~~</span
        ></el-divider
      >
    </el-card>

    <el-dialog
      :title="editDialog.add ? $t('storage.data.add') : $t('storage.data.edit')"
      :visible.sync="editDialog.show"
      v-if="editDialog.show"
      width="40%"
    >
      <el-form
        label-position="left"
        label-width="150px"
        :model="editDialog.model"
        ref="storageForm"
      >
        <el-form-item :label="$t('storage.data.mkey')" prop="mkey" required>
          <el-input
            style="width: 60%"
            :disabled="!editDialog.add"
            type="text"
            v-model="editDialog.model.mkey"
            required
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('storage.data.ukey')" prop="ukey" required>
          <el-input
            style="width: 60%"
            :disabled="!editDialog.add"
            type="text"
            v-model="editDialog.model.ukey"
            required
          >
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('storage.data.version')"
          prop="version"
          required
        >
          <el-input-number
            v-model="editDialog.model.version"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          :label="$t('storage.data.expireTime')"
          prop="expireTime"
          required
        >
          <el-input-number
            v-model="editDialog.model.expireTime"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          :label="$t('storage.data.timestamp')"
          prop="timestamp"
          required
        >
          <el-input-number
            v-model="editDialog.model.timestamp"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('storage.data.data')" label-width="200">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 20 }"
            v-model="editDialog.model.data"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editDialog.show = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="doEditData"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "TableData",
  data() {
    return {
      dataList: [],
      query: {
        mkey: "",
        ukey: "",
        forward: false,
        limit: 15,
      },
      editDialog: {
        show: false,
        add: false,
        model: {},
      },
    };
  },
  watch: {
    $route(to, from) {
      if (to.params.table) {
        this.fetchData();
      }
    },
  },
  methods: {
    getTable() {
      return this.$route.params.table;
    },
    handleDeleteTable() {
      const loading = this.$Loading.show();
      this.$ajax
        .postJSON("/delete_table", {
          obj: this.$route.params.obj,
          table: this.$route.params.table,
        })
        .then((data) => {
          loading.hide();
          this.$common.showSucc();
          this.$emit("deleteTableQueue", this.$route.params.obj);
        })
        .catch((err) => {
          loading.hide();
          this.$tip.error(
            `${this.$t("common.error")}: ${err.message || err.err_msg}`
          );
        });
    },
    doEditData() {
      if (this.editDialog.add) {
        const loading = this.$Loading.show();
        this.$ajax
          .postJSON("/add_table_data", {
            obj: this.$route.params.obj,
            table: this.$route.params.table,
            data: this.editDialog.model,
          })
          .then((data) => {
            loading.hide();
            this.fetchData();
            this.$common.showSucc();
            this.editDialog.show = false;

            this.editDialog.model = {};
          })
          .catch((err) => {
            loading.hide();
            this.$tip.error(
              `${this.$t("common.error")}: ${err.message || err.err_msg}`
            );
          });
      } else {
        const loading = this.$Loading.show();
        this.$ajax
          .postJSON("/edit_table_data", {
            obj: this.$route.params.obj,
            table: this.$route.params.table,
            data: this.editDialog.model,
          })
          .then((data) => {
            loading.hide();
            this.fetchData();
            this.$common.showSucc();
            this.editDialog.show = false;

            this.editDialog.model = {};
          })
          .catch((err) => {
            loading.hide();
            this.$tip.error(
              `${this.$t("common.error")}: ${err.message || err.err_msg}`
            );
          });
      }
    },
    addData() {
      this.editDialog.show = true;
      this.editDialog.add = true;
      this.editDialog.model = {};
      this.editDialog.model = {
        mkey: "",
        ukey: "",
        version: 1,
        expireTime: 0,
        timestamp: 0,
        data: "",
      };
    },
    handleEdit(row) {
      this.editDialog.show = true;
      this.editDialog.add = false;
      this.editDialog.model = {
        mkey: row.skey.mkey,
        ukey: row.skey.ukey,
        version: row.svalue.version,
        expireTime: row.svalue.expireTime,
        timestamp: row.svalue.timestamp,
        data: row.svalue.data,
      };
      //   this.editDialog.model = row;
    },
    handleDelete(row) {
      const loading = this.$Loading.show();
      this.$ajax
        .postJSON("/delete_table_data", {
          obj: this.$route.params.obj,
          table: this.$route.params.table,
          mkey: row.skey.mkey,
          ukey: row.skey.ukey,
        })
        .then((data) => {
          loading.hide();
          this.fetchData();
          this.$common.showSucc();
        })
        .catch((err) => {
          loading.hide();
          this.$tip.error(
            `${this.$t("common.error")}: ${err.message || err.err_msg}`
          );
        });
    },

    handleData(data) {
      if (data.length == 0) {
        this.$common.showSucc("no data~~~");
      }
      data.forEach((item) => {
        let str = "";

        str = Buffer.from(item.svalue.data.data).toString();

        try {
          str = JSON.parse(str);
          str = JSON.stringify(str, null, 4);
        } catch (e) {}
        item.svalue.data = str;
      });

      return data;
    },
    moreData() {
      const loading = this.$Loading.show();
      this.$ajax
        .postJSON("/list_table_data", {
          obj: this.$route.params.obj,
          table: this.$route.params.table,
          mkey: this.dataList[this.dataList.length - 1].skey.mkey,
          ukey: this.dataList[this.dataList.length - 1].skey.ukey,
          forward: this.query.forward,
          limit: this.query.limit,
          include: false,
          over: this.query.mkey.length == 0,
        })
        .then((data) => {
          this.dataList = this.dataList.concat(this.handleData(data));
          loading.hide();
        })
        .catch((err) => {
          loading.hide();
          this.$tip.error(
            `${this.$t("common.error")}: ${err.message || err.err_msg}`
          );
        });
    },
    fetchData() {
      const loading = this.$Loading.show();

      this.$ajax
        .postJSON("/list_table_data", {
          obj: this.$route.params.obj,
          table: this.$route.params.table,
          mkey: this.query.mkey,
          ukey: this.query.ukey,
          forward: this.query.forward,
          limit: this.query.limit,
          include: false,
          over: this.query.mkey.length == 0,
        })
        .then((data) => {
          this.dataList = this.handleData(data);
          loading.hide();
        })
        .catch((err) => {
          loading.hide();
          this.$tip.error(
            `${this.$t("common.error")}: ${err.message || err.err_msg}`
          );
        });
    },
  },

  created() {},
  mounted() {
    this.fetchData();
  },
};
</script>

