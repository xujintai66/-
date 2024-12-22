<script setup>
import { ref, onMounted } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { useRoute, useRouter } from 'vue-router'
import { pass } from '@/api/pass'

/* 数据区 */
const store = useCounterStore()
let returnData = ref({})
const route = useRoute()
const router = useRouter()
const reason = ref('')

/* 方法区 */

const Pass = async () => {
  const { data } = await pass(returnData.value.stuId, 2, reason.value)
  if (data.code === 200) {
    store.returnData.splice(route.query.id, 1)
    alert('提交成功')
  } else {
    alert('提交失败')
  }
  router.push('/teacher')
}

const unPass = async () => {
  const { data } = await pass(returnData.value.stuId, 1, reason.value)
  if (data.code === 200) {
    store.returnData.splice(route.query.id, 1)
    alert('提交成功')
  } else {
    alert('提交失败')
  }
  router.push('/teacher')
}

onMounted(() => {
  returnData.value = store.returnData[route.query.id]
  console.log(returnData.value)
})
</script>

<template>
  <div>{{ returnData.laboratory }}</div>
  <div>{{ returnData.name }}</div>
  <div>{{ returnData.stuId }}</div>
  <div>{{ returnData.major }}</div>
  <div>{{ returnData.phone }}</div>
  <div>{{ returnData.startTime }}</div>
  <div>{{ returnData.endTime }}</div>
  <div>{{ returnData.device }}</div>
  <div>{{ returnData.teacher }}</div>
  <div>{{ returnData.project }}</div>
  <div>{{ returnData.result }}</div>
  <textarea name="reason" id="" v-model="reason" placeholder="请输入批改意见"></textarea>
  <button @click="Pass">通过</button>
  <button @click="unPass">不通过</button>
</template>

<style scoped></style>
