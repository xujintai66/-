<script setup>
import { ref, onMounted } from 'vue'
import { submit } from '@/api/submit'
import { Return } from '@/api/return'
import { isCheck } from '@/api/isCheck'
import { useRoute } from 'vue-router'

/* 数据区 */
const returnData = ref({})
const formData = ref({
  laboratory: '',
  name: '',
  stuId: '',
  major: '',
  phone: '',
  startTime: '',
  endTime: '',
  device: '',
  teacher: '',
  project: '',
  result: '',
})
const route = useRoute()
const stuId = ref('')
const numOfCheck = ref(0)
const info = ref({})
const reason = ref('')
const checkText = ref('')
const startDate = ref({})
const endDate = ref({})

//const checkData = ref({})
let isShow = ref(1)

/* 提交表单到数据库 */
const submitForm = async () => {
  const form = document.getElementById('labApplicationForm')
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }
  const formDataToSend = new FormData()
  formDataToSend.append('laboratory', formData.value.laboratory)
  formDataToSend.append('name', formData.value.name)
  formDataToSend.append('stuId', formData.value.stuId)
  formDataToSend.append('major', formData.value.major)
  formDataToSend.append('phone', formData.value.phone)
  formDataToSend.append('startTime', formData.value.startTime)
  formDataToSend.append('endTime', formData.value.endTime)
  formDataToSend.append('device', formData.value.device)
  formDataToSend.append('teacher', formData.value.teacher)
  formDataToSend.append('project', formData.value.project)
  formDataToSend.append('result', formData.value.result)
  console.log(formDataToSend)
  const { data } = await submit(formDataToSend)
  console.log(data)
}

const limit = () => {
  console.log(startDate.value.value)

  if (startDate.value.value) {
    // 计算最大结束日期（开始日期 + 1年 - 1天）
    const maxEndDate = new Date(startDate.value.value)
    maxEndDate.setFullYear(maxEndDate.getFullYear() + 1)
    maxEndDate.setDate(maxEndDate.getDate() - 1)
    if (!endDate.value.value) {
      endDate.value.value = startDate.value.value
      endDate.value.min = startDate.value.value
      endDate.value.max = maxEndDate.toISOString().split('T')[0]
    }
    // 设置结束日期输入框的最小值和最大值
    else {
      endDate.value.min = startDate.value.value
      endDate.value.max = maxEndDate.toISOString().split('T')[0]
    }

    // 清空已选择的不合规结束日期
    if (
      new Date(endDate.value.value) > maxEndDate ||
      new Date(endDate.value.value) < startDate.value.value
    ) {
      endDate.value.value = ''
    }
  }
}

const ReturnData = async () => {
  const { data } = await Return()
  returnData.value = data
}

/* 查看是否提交过 */
const check = async (stuId) => {
  const { data } = await isCheck(stuId)
  numOfCheck.value = data.ischeck.isChecked
  reason.value = data.ischeck.reason
  info.value = data.info
  console.log(data)
}

/* 切换当前需要查看的地方 */
const changeShow = (a) => {
  if (a === 1) {
    isShow.value = false
  } else {
    isShow.value = true
  }
}

onMounted(async () => {
  const startDateInput = document.getElementById('startDate')
  const endDateInput = document.getElementById('endDate')
  // 获取当前日期并格式化为 yyyy-MM-dd 格式
  const currentDate = new Date()
  const formattedDate = currentDate.toISOString().split('T')[0]
  // 设置开始日期输入框的默认值
  startDateInput.value = formattedDate
  // 设置结束日期输入框的默认值
  endDateInput.value = formattedDate

  /* 获取url中的参数然后 */
  stuId.value = route.query.id
  /* 查找是否已经提交过 */
  ReturnData()
  await check(stuId.value)
  if (numOfCheck.value === 0) {
    checkText.value = '未批改'
  } else if (numOfCheck.value === 1) {
    checkText.value = '未通过'
  } else {
    checkText.value = '已通过'
  }
})
</script>

<template>
  <div class="topContainer">
    <div class="topTitle" @click="changeShow(0)">填写新表</div>
    <div class="topTitle" @click="changeShow(1)">查看已提交的表</div>
  </div>
  <div class="submit" v-if="isShow">
    <div class="container">
      <h1>实验室申请表单</h1>
      <form id="labApplicationForm">
        <!-- 申请的实验室 -->
        <label for="labSelect">申请的实验室</label>
        <select id="labSelect" required v-model="formData.laboratory">
          <option value="" disabled selected>请选择</option>
          <option value="119+121计算机学生创新实践基地">119+121计算机学生创新实践基地</option>
          <option value="315计算机竞赛战队加油站">315计算机竞赛战队加油站</option>
          <option value="239 CSSE CODE & Media Lab">239 CSSE CODE & Media Lab</option>
        </select>

        <!-- 用户基本信息 -->
        <label for="name">申请人姓名</label>
        <input type="text" id="name" placeholder="请填写姓名" required v-model="formData.name" />

        <label for="studentId">学号</label>
        <input
          type="text"
          id="studentId"
          placeholder="请填写学号"
          required
          v-model="formData.stuId"
        />

        <label for="major">专业</label>
        <input type="text" id="major" placeholder="请填写专业" required v-model="formData.major" />

        <label for="phone">手机号</label>
        <input type="tel" id="phone" placeholder="+86 请填写" required v-model="formData.phone" />

        <!-- 开始日期 -->
        <label for="startDate">开始日期</label>
        <input
          type="date"
          id="startDate"
          required
          v-model="formData.startTime"
          ref="startDate"
          @change="limit"
        />

        <!-- 拟结束日期 -->
        <label for="endDate">拟结束日期</label>
        <input type="date" id="endDate" required v-model="formData.endTime" ref="endDate" />
        <small class="date-hint">每次申请时间最长为一年</small>
        <!-- 提示信息 -->

        <label for="equipment">所需设备</label>
        <input
          type="text"
          id="equipment"
          placeholder="例：主机、显示器等"
          v-model="formData.device"
        />

        <!-- 指导老师 -->
        <label for="teacher">指导老师</label>
        <input
          type="text"
          id="teacher"
          placeholder="请填写指导老师姓名"
          required
          v-model="formData.teacher"
        />

        <!-- 项目名称 -->
        <label for="projectName">项目名称或参赛题目</label>
        <input
          type="text"
          id="projectName"
          placeholder="请填写项目名称"
          required
          v-model="formData.project"
        />

        <!-- 申请原因 -->
        <label for="reason">预计取得的成效</label>
        <textarea
          id="reason"
          placeholder="会在工位到期时验收成果，请认真填写"
          required
          v-model="formData.result"
        ></textarea>

        <!-- 审批流程 -->
        <h3>审批流程</h3>
        <div class="approvers">
          <div>
            <span>指导老师：</span>
            <span class="approver-name" id="teacherApprover">尹义飞</span>
          </div>
          <div>
            <span>实验室管理员：</span>
            <span class="approver-name">黄程程</span>
            <span class="approver-name">尹义飞</span>
            <span class="approver-name">林佳利</span>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button type="submit" @click.prevent="submitForm">提交</button>
        <button type="reset" class="cancel-btn">重置</button>
      </form>
    </div>
  </div>
  <div class="submitted" v-else>
    <div>{{ stuId }}</div>
    <div>{{ numOfCheck }}</div>
    <div>{{ checkText }}</div>
    <div>{{ info.name }}</div>
    <div>{{ reason }}</div>
  </div>
</template>

<style scoped>
.topContainer {
  width: 100%;
  height: 100px;
  background-color: aqua;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .topTitle {
    width: 50%;
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 30px;
    cursor: pointer;
  }
  .topTitle:first-child {
    border-right: 1px solid #000;
  }
}

/* 页面整体背景颜色 */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f6f9; /* 浅灰色背景 */
  margin: 0;
  padding: 20px;
}

/* 容器样式：居中卡片风格 */
.container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff; /* 白色背景 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-top: 5px solid #007bff; /* 蓝色顶部边框 */
}

/* 标题样式 */
h1 {
  text-align: center;
  color: #007bff; /* 标题蓝色 */
  margin-bottom: 20px;
}

/* 标签文字颜色 */
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333333; /* 深灰色 */
}

/* 输入框、下拉框、文本区域样式 */
input,
select,
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ced4da; /* 浅灰边框 */
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s ease-in-out;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #007bff; /* 输入框聚焦时边框变蓝 */
  outline: none; /* 去除默认的外框 */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.2); /* 蓝色阴影 */
}

/* 按钮样式 */
button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease-in-out;
}

button[type='submit'] {
  background-color: #007bff; /* 蓝色按钮 */
  color: #ffffff; /* 白色文字 */
}

button[type='submit']:hover {
  background-color: #0056b3; /* 深蓝色悬浮效果 */
}

.cancel-btn {
  background-color: #6c757d; /* 灰色按钮 */
  color: #ffffff;
}

.cancel-btn:hover {
  background-color: #5a6268; /* 深灰色悬浮效果 */
}

/* 审批流程部分 */
.approvers {
  margin-bottom: 20px;
}

.approver-name {
  display: inline-block;
  background-color: #e9ecef; /* 浅灰色背景 */
  color: #495057; /* 深灰文字 */
  padding: 6px 12px;
  margin: 5px 5px 0 0;
  border-radius: 5px;
  font-size: 14px;
}

/* 小标题样式 */
h3 {
  color: #343a40; /* 深灰色 */
  border-bottom: 2px solid #007bff; /* 蓝色底边 */
  padding-bottom: 5px;
  margin-bottom: 15px;
}
</style>
