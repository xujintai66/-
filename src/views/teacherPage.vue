<script setup>
import { onMounted, ref } from 'vue'
import { Return } from '@/api/return'
import { deleteInfo } from '@/api/delete'
import { useCounterStore } from '@/stores/counter'
import { useRouter } from 'vue-router'
import { ReturnIsCheck } from '@/api/returnIscheck'

/* 数据区 */
const store = useCounterStore()
const router = useRouter()
const Filiter = ref([])

/* 方法区 */
const ReturnData = async () => {
  let { data } = await Return()
  const aaa = await ReturnIsCheck()
  Filiter.value = aaa.data.ischeck
  console.log(Filiter.value)

  data = data.filter((element) => {
    return !Filiter.value.some((item) => item === element.stuId)
  })
  console.log(data)

  store.returnData = data
}

const Delete = async (stuId) => {
  const { data } = await deleteInfo(stuId)
  console.log(data)
}

const GoToInfo = (id) => {
  router.push({
    path: '/fact',
    query: {
      id: id,
    },
  })
}

onMounted(() => {
  ReturnData()
})
</script>

<template>
  <div class="container">
    <div
      v-for="(item, index) in store.returnData"
      v-bind:key="item.name"
      class="stuInfo"
      @click="GoToInfo(index)"
    >
      <div class="Info">姓名：{{ item.name }}</div>
      <div class="Info">学号：{{ item.stuId }}</div>
      <div class="Info">实验室：{{ item.laboratory }}</div>
      <div>></div>
    </div>
    <div v-if="!store.returnData[0]">目前没有需批改的表单</div>
  </div>
  <button @click="Delete(returnData[0].stuId)">1111s</button>
</template>

<style scoped>
.container {
  width: 100%;
  height: 500px;
  .stuInfo {
    margin: 0 auto;
    width: 800px;
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid #000;
    cursor: pointer;
    .Info {
      width: 250px;
      padding: 5px 0;
      margin: 0 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
