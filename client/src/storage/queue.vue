<template>
  <div class="userList">
    <el-card>
      <!--查询-->
      <el-form :inline="true" :model="query" size="small">
        <el-tag>{{ getQueue() }}</el-tag>
        &nbsp;&nbsp;

        <el-form-item label="Index">
          <el-input
            v-model="query.index"
            :clearable="true"
            size="mini"
            placeholder="index"
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
            @confirm="handleDeleteQueue()"
            title="确定删除当前数据队列么？"
          >
            <el-button slot="reference" size="mini" type="danger">{{
              $t("storage.deleteQueue")
            }}</el-button>
          </el-popconfirm>
        </el-form-item>
      </el-form>

      <el-table :data="dataList" border stripe style="width: 100%">
        <el-table-column
          width="250px"
          prop="index"
          :label="$t('storage.data.index')"
        ></el-table-column>
        <el-table-column
          width="150px"
          prop="expireTime"
          :label="$t('storage.data.expireTime')"
        >
        </el-table-column>
        <el-table-column :label="$t('storage.data.data')">
          <template slot-scope="scope">
            <pre>{{ scope.row.data }}</pre>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('storage.data.operator')"
          width="150"
        >
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
        :model="editDialog.model"
        ref="storageForm"
        label-position="left"
        label-width="150px"
      >
        <el-form-item
          v-if="editDialog.add"
          :label="$t('storage.data.back')"
          prop="back"
          required
        >
          <el-switch
            v-model="editDialog.model.back"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="头部"
            inactive-text="尾部"
          >
          </el-switch>
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
  name: "QueueData",
  data() {
    return {
      dataList: [],
      query: {
        index: "",
        forward: false,
        limit: 15,
      },
      editDialog: {
        show: false,
        add: false,
        model: {
          back: true,
          expireTime: 0,
          data: "",
        },
      },
    };
  },
  watch: {
    $route(to, from) {
      //   console.log(from, to);
      if (to.params.queue) {
        this.fetchData();
      }
    },
  },
  methods: {
    getQueue() {
      return this.$route.params.queue;
    },
    handleDeleteQueue() {
      const loading = this.$Loading.show();
      this.$ajax
        .postJSON("/delete_queue", {
          obj: this.$route.params.obj,
          queue: this.$route.params.queue,
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
      const loading = this.$Loading.show();
      if (this.editDialog.add) {
        this.$ajax
          .postJSON("/add_queue_data", {
            obj: this.$route.params.obj,
            queue: this.$route.params.queue,
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
        this.$ajax
          .postJSON("/edit_queue_data", {
            obj: this.$route.params.obj,
            queue: this.$route.params.queue,
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
        data: "",
        expireTime: 0,
        back: false,
      };
    },
    handleEdit(row) {
      this.editDialog.show = true;
      this.editDialog.add = false;
      this.editDialog.model = {
        index: row.index,
        expireTime: row.expireTime,
        data: row.data,
      };
    },
    handleDelete(row) {
      const loading = this.$Loading.show();
      this.$ajax
        .postJSON("/delete_queue_data", {
          obj: this.$route.params.obj,
          queue: this.$route.params.queue,
          index: row.index,
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
        item.data.data.forEach((e) => {
          str += String.fromCharCode(e);
        });

        try {
          str = JSON.parse(str);
          str = JSON.stringify(str, null, 4);
        } catch (e) {}
        item.data = str;
      });

      return data;
    },
    moreData() {
      const loading = this.$Loading.show();
      this.$ajax
        .postJSON("/list_queue_data", {
          obj: this.$route.params.obj,
          queue: this.$route.params.queue,
          index: this.dataList[this.dataList.length - 1].index,
          forward: this.query.forward,
          limit: this.query.limit,
          include: false,
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
        .postJSON("/list_queue_data", {
          obj: this.$route.params.obj,
          queue: this.$route.params.queue,
          index: this.query.index,
          forward: this.query.forward,
          limit: this.query.limit,
          include: false,
        })
        .then((data) => {
          this.dataList = this.handleData(data);
          loading.hide();
        })
        .catch((err) => {
          this.$tip.error(
            `${this.$t("common.error")}: ${err.message || err.err_msg}`
          );
        });
    },
  },

  created() {},
  mounted() {},
};
</script>

