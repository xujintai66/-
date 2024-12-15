<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter'
import { query } from '@/api/login'

/* 数据区 */
const account = ref('')
const passWord = ref('')
const router = useRouter()
const store = useCounterStore()
const type = ref(0)

/* 方法区 */
watch(account, (oldValue, newValue) => {
  console.log(newValue)
})
const login = async () => {
  if (account.value === '' || passWord.value === '') {
    alert('用户名或账号不能为空')
  } else {
    const result = await loginQuery()
    if (result === 1) {
      if (type.value === 0) {
        store.count = 1
        router.push({
          path: '/',
          query: {
            id: account.value,
          },
        })
      } else {
        store.count = 2
        router.push('/teacher')
      }
    }
    account.value = ''
    passWord.value = ''
  }
}
const loginQuery = async () => {
  const { data } = await query(account.value, passWord.value)
  if (data.code === 200) {
    type.value = data.data[0].type
    return 1
  } else {
    alert(`${data.message}`)
    return 0
  }
}

const press = async () => {
  login()
}
</script>

<template>
  <div class="container">
    <div class="mainLeft">
      <img src="../assets/img/loginImg.png" alt="" class="mainImg" />
    </div>
    <div class="mainRight">
      <div class="rightText">系统名字</div>
      <div class="Input" @keydown.enter="press">
        <div>账号：</div>
        <input type="text" v-model="account" />
      </div>
      <div class="Input" @keydown.enter="press">
        <div>密码：</div>
        <input type="password" v-model="passWord" />
      </div>
      <div class="buttonPart" @click="login">
        <div class="buttonLogin">
          <div>登陆</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .mainLeft {
    height: 400px;
    .mainImg {
      height: 100%;
    }
  }
  .mainRight {
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 400px;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    .rightText {
      height: 50px;
      line-height: 50px;
    }
    .Input {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .buttonPart {
      cursor: pointer;
      .buttonLogin {
        color: white;
        height: 50px;
        width: 150px;
        line-height: 50px;
        text-align: center;
        border-radius: 5px;
        box-shadow: 0 0 5px black;
        background-color: red;
        &:active {
          background-color: darkred;
          box-shadow: 0 0 3px black;
          transform: translateY(1px); /* 按钮按下时稍微向下移动，模拟按下的感觉 */
        }
      }
    }
  }
}
</style>
