<template>
  <div class="home-container">
    <el-row>
      <el-col :span="6" class="left">
        <LeftList :tree="treeData" @getCurApiIndex="getCurApiIndex" />
      </el-col>
      <el-col :span="18" class="right">
        <div class="main">
          <el-form
            :model="baseTemplate"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm">
            <div class="layout">
              <div class="title">
                <span>基本设置</span>
                <el-button type="primary" size="mini" @click="newDoc">新建文档</el-button>
              </div>

              <el-row :gutter="20">
                <el-col class="input" :span="12">
                  <el-form-item label="接口名称" prop="methodName">
                    <el-input size="mini" v-model="baseTemplate.methodName" placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="input" :span="12">
                  <el-form-item label="接口描述" prop="description">
                    <el-input size="mini" v-model="baseTemplate.description" placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col class="input" :span="12">
                  <el-form-item label="负责组长" prop="groupOwner">
                    <el-input size="mini" v-model="baseTemplate.groupOwner" placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="input" :span="12">
                  <el-form-item label="接口负责" prop="methodOwner">
                    <el-input size="mini" v-model="baseTemplate.methodOwner" placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col class="input" :span="12">
                  <el-form-item label="接口状态" prop="state">
                    <el-select size="mini" v-model="baseTemplate.state" placeholder="请选择接口状态">
                      <el-option label="OPEN" value="true"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="input" :span="12">
                  <el-form-item label="安全级别" prop="securityLevel">
                    <el-radio
                      border
                      size="mini"
                      v-model="baseTemplate.securityLevel"
                      label="Anonym">Anonym</el-radio>
                    <el-radio
                      border
                      size="mini"
                      v-model="baseTemplate.securityLevel"
                      label="User">User</el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <el-button
              type="success"
              size="mini"
              @click="generateDoc('ruleForm')">生成
            </el-button>

            <div class="layout">
              <div class="title">
                <span>请求参数</span>
              </div>
              <el-row :gutter="10" v-for="(param,index) in params" :key="index">
                <el-col class="input" :span="5">
                  <el-form-item label-width="0" prop="paramName">
                    <el-input size="mini" v-model="param.paramName" placeholder="参数描述"></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="input" :span="3">
                  <el-form-item label-width="0" prop="paramType">
                    <el-select size="mini" v-model="param.paramType" placeholder="参数类型">
                      <el-option label="text" value="text"></el-option>
                      <el-option label="file" value="file"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="input" :span="6">
                  <el-form-item label-width="0" prop="paramDesc">
                    <el-input size="mini" v-model="param.paramDesc" placeholder="参数描述"></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="input" :span="3">
                  <el-form-item label-width="0" prop="paramRequired">
                    <el-select size="mini" v-model="param.paramRequired" placeholder="是否必传">
                      <el-option label="必传" value="true"></el-option>
                      <el-option label="非必传" value="false"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="input" :span="7">
                  <el-form-item label-width="0">
                    <el-button size="mini" type="primary" @click="addParam">添加参数</el-button>
                    <el-button size="mini" type="danger" @click="removeParam(index)">删除参数</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="layout">
              <div class="title">
                <span>返回数据</span>
              </div>
              <JsonEditor :apiIndex="apiListIndex" :apiData="curApiData" />
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <!-- 新建文档选择分组弹窗 -->
    <el-dialog
      title="选择分组"
      width="40%"
      :visible.sync="groupModelVisible"
      :before-close="groupModelClose">
      <div>
        <el-select style="width:100%" size="small" v-model="searchGroup" filterable placeholder="请选择">
          <el-option
            v-for="item in groupSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="groupModelVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="groupModelVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import jsonData from "./../../../static/info.json";
import LeftList from "@/components/LeftList";
import JsonEditor from "@/components/JsonEditor";

export default {
  name: "home-container",
  components: { LeftList, JsonEditor },
  mounted() {
    this.apiList = jsonData.apiList;
    this.treeData = this.getMenuTree(this.apiList);
    this.curApiData = this.apiList[this.apiListIndex];
    this.getBaseTemplate(this.curApiData);
  },
  data() {
    const verApiName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入接口名称"));
      }
      if (!/^node_(\w+\.[a-zA-Z0-9]+)$/gi.test(value)) {
        return callback(new Error("接口名格式错误"));
      }
      callback();
    };
    return {
      apiList: [],
      treeData: [],
      apiListIndex: 0,
      curApiData: {},
      baseTemplate: {},
      params: [
        {
          paramName: "",
          paramType: "text",
          paramDesc: "",
          paramRequired: "true"
        }
      ],
      rules: {
        methodName: [
          { required: true, validator: verApiName, trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入接口描述", trigger: "change" }
        ],
        groupOwner: [
          { required: true, message: "请输入负责组长", trigger: "change" }
        ],
        methodOwner: [
          { required: true, message: "请输入接口负责", trigger: "change" }
        ],
        securityLevel: [
          { required: true, message: "请选择安全等级", trigger: "change" }
        ],
        state: [
          { required: true, message: "请输入接口状态", trigger: "change" }
        ]
      },
      groupModelVisible: false,
      groupSelect: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      searchGroup: ''
    }
  },
  methods: {
    getMenuTree(apiList) {
      const map = {}, dest = [];
      for(let i = 0; i < apiList.length; i++) {
        const curI = apiList[i];
        if(!map[curI.groupName]) {
          dest.push({
            label: curI.groupName,
            groupIndex: i,
            children: [
              {
                label: curI.methodName.split('.')[1],
                methodIndex: i
              }
            ]
          })
          map[curI.groupName] = curI;
        } else {
          for(let j = 0; j < dest.length; j++) {
            const curJ = dest[j];
            if(curJ.label === curI.groupName) {
              curJ.children.push({
                label: curI.methodName.split('.')[1],
                methodIndex: i
              });
            }
          }
        }
      }
      return dest;
    },
    getCurApiIndex(apiListIndex) {
      this.apiListIndex = apiListIndex;
      this.curApiData = jsonData.apiList[apiListIndex];
      this.getBaseTemplate(this.curApiData);
      console.log(apiListIndex)
    },
    getBaseTemplate(curApiData) {
      this.baseTemplate = {
        methodName: this.curApiData.methodName,
        description: this.curApiData.description,
        groupOwner: this.curApiData.groupOwner,
        methodOwner: this.curApiData.methodOwner,
        securityLevel: this.curApiData.securityLevel,
        state: 'OPEN',
      }
    },
    // 生成文档
    generateDoc(formName, name) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            customClass: 'msgBox',
            showClose: true,
            message: '验证通过',
            type: 'success'
          });
          // 更新左侧列表
          this.apiList[this.apiListIndex].methodName = this.baseTemplate.methodName;
          this.treeData = this.getMenuTree(this.apiList);
        } else {
          this.$message.error("请输入接口名称");
          return false;
        }
      });
    },
    // 添加参数
    addParam() {
      this.params.push({
        paramName: "",
        paramType: "text",
        paramDesc: "",
        paramRequired: "true"
      });
    },
    // 删除参数
    removeParam(index) {
      this.params.splice(index, 1);
    },
    // 筛选掉非法的param
    filterParams(params) {
      if (params && params.length) {
        params = params.filter(item => {
          return item.paramName !== "" && item.paramDesc !== "";
        });
      }
      return params;
    },
    // 新建文档
    newDoc() {
      // 初始化现有数据
      this.apiListIndex = 0;
      this.curApiData = {};
      this.baseTemplate = {};

      this.groupSelect = this.treeData;
      this.groupModelVisible = true;
    },
    groupModelClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style lang="scss">
.home-container {
  height: 100%;
  min-height: 100vh;
  .el-row {
    height: 100%;
  }
  .left {
    height: 100%;
  }
  .right {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .main {
      flex: 1;
      padding: 15px;
      background: $white;
      .el-form-item,
      .el-select {
        width: 100%;
      }
      .el-radio {
        margin-right: 10px;
      }
      .title {
        margin-bottom: 20px;
        padding-bottom: 10px;
        font-size: 16px;
        border-bottom: 1px solid #409eff;
        display: flex;
        align-items: center;
        & > span {
          margin-right: 20px;
        }
      }
      .el-form-item__content, .el-form-item__label {
        line-height: 30px;
      }
    }
  }
}
.msgBox {
  left: calc(50% + 144px);
}
</style>


