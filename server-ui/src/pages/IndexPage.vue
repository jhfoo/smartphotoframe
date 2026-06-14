<template>
  <!-- <q-page class="fullscreen"> -->
  <q-page class="bg-black flex flex-center text-white">
    <q-img
      :src="PhotoUrl"
      class="absolute-full"
      :class="{ grayscale: isDark }"
      fit="contain"
      @error="ImageLoadError"
      @load="isShowDialog = false"
    />
    <div class="absolute-top-right q-ma-md">
      <q-card
        class=" text-black"
        :class="{ 'card-bg-dark': isDark, 'card-bg-light': !isDark }"
        flat
      >
        <q-card-section class="q-pa-md">
          <h5
            class="q-my-none"
            :class="{ 'text-grey-8': isDark, 'text-grey-5': !isDark }"
            align="right"
          >
            {{ now.format("DD MMM") }}
          </h5>
          <h2
            class="q-my-none"
            :class="{ 'text-grey-6': isDark, 'text-yellow': !isDark }"
          >
            {{ now.format("hh:mm")
            }}<span style="font-size: 0.5em">{{ now.format(" A") }}</span>
          </h2>
          <h4
            class="q-mt-md q-mb-none"
            :class="{ 'text-grey-8': isDark, 'text-grey-5': !isDark }"
            align="center"
          >
            {{ now.format("ddd").toUpperCase() }}
          </h4>
        </q-card-section>
      </q-card>
    </div>
    <div class="absolute-bottom-right q-ma-md">
      <q-card
        v-if="AlbumName"
        class="q-mt-md text-black"
        :class="{ 'card-bg-dark': isDark, 'card-bg-light': !isDark }"
        flat
        @click="isShowDialog = !isShowDialog"
      >
        <q-card-section class="q-pa-md">
          <h5
            class="q-my-none"
            :class="{ 'text-grey-8': isDark, 'text-white': !isDark }"
            align="left"
          >
            <h5 class="q-my-none" align="right">{{ AlbumName }}</h5>
            <h6 class="q-my-none text-grey" align="right">{{ PhotoList.length }} photos</h6>
          </h5>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="isShowDialog" position="standard">
      <q-card style="width: 350px" class="bg-red">
        <q-card-section class="row items-center no-wrap">
          <div>{{ DialogMessage }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import axios from "axios";

// https://fastly.picsum.photos/id/638/1920/1080.jpg?hmac=NAOd23VbjYey0n--NRzGkAdDkC1xF2c-RM21RQi552k
const PhotoUrl = ref("");
const now = ref(dayjs());
const AlbumName = ref("");
const DialogMessage = ref("");
const isShowDialog = ref(false);
var PhotoList = [];
var ImageId = null;


setInterval(() => {
  now.value = dayjs();
}, 5 * 1000);

const isDark = ref(false);
isDark.value = false;

const BaseUrl = "http://192.168.0.75:8000";
var DefaultAlbum = null;

await playAlbum()

async function playAlbum() {
  try {
    DefaultAlbum = await getDefaultAlbum();
    if (DefaultAlbum) {
      AlbumName.value = DefaultAlbum.AlbumName;
      PhotoList = await getPhotoList(DefaultAlbum.AlbumId);
      if (PhotoList) {
        await setPhotoUrl(0);
      }
    }
  } catch (err) {
    const now = dayjs()
    DialogMessage.value = `[${now.format('HH:mm:ss')}] Unable to load default album`
    isShowDialog.value = true;

    // retry
    setTimeout(async () => {
      await playAlbum();
    }, 5 * 1000);
  }
}

async function getDefaultAlbum() {
  const resp = await axios.get(
    `${BaseUrl}/api/smartphotoframe/default/album`,
  );
  if (resp.status === 200) {
    isShowDialog.value = false;
    console.log(resp.data);
    return resp.data;
  }
}

async function setPhotoUrl(idx: number) {
  try {
    const TestDefaultAlbum = await getDefaultAlbum();
    var NextIdx = idx;

    if (TestDefaultAlbum != null) {
      // check if AlbumId has changed
      if (TestDefaultAlbum.AlbumId != DefaultAlbum.AlbumId) {
        DefaultAlbum = TestDefaultAlbum;
        AlbumName.value = DefaultAlbum.AlbumName;
        PhotoList = await getPhotoList(DefaultAlbum.AlbumId);
        setTimeout(async () => {
          await setPhotoUrl(0);
        }, 0);
        return;
      }

      // AlbumId did not change, update photo URL
      const PhotoObj = PhotoList[idx];
      // console.log(PhotoObj)
      // console.log(`PhotoList.length: ${PhotoList.length}, idx: ${idx}`)
      ImageId = PhotoObj.id;
      const url = `${BaseUrl}/api/smartphotoframe/photo/${PhotoObj.id}/cache/${PhotoObj.additional.thumbnail.cache_key}/UserId/${PhotoObj.owner_user_id}`;
      // console.log(`url: ${url}`)
      PhotoUrl.value = url;

      // determine next index
      var NextIdx = idx + 1;
      if (idx >= PhotoList.length - 1) {
        NextIdx = 0;
      }
    }

    setTimeout(() => {
      setPhotoUrl(NextIdx);
    }, 10 * 1000);
  } catch (err) {
    const now = dayjs()
    DialogMessage.value = `[${now.format('HH:mm:ss')}] Cannot connect to server`
    isShowDialog.value = true;

    // retry
    setTimeout(async () => {
      await playAlbum();
    }, 5 * 1000);
  }
}

async function getPhotoList(AlbumId: number) {
  const resp = await axios.get(
    `${BaseUrl}/api/smartphotoframe/album/${AlbumId}/photos`,
  );
  if (resp.status === 200) {
    // only return photos, ignore videos
    const photos = resp.data.filter((album) => album.type == "photo");
    return photos;
  } else {
    return null;
  }
}

function ImageLoadError() {
  isShowDialog.value = true;
  DialogMessage.value = `Failed to load image: ${ImageId}`;
}

</script>

<style>
.grayscale {
  filter: grayscale(100%) brightness(50%);
}
.card-bg-dark {
  background-color: rgba(0, 0, 0, 0.5);
}
.card-bg-light {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
