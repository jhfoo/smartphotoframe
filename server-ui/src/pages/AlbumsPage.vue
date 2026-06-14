<template>
  <!-- <q-page class="fullscreen"> -->
  <q-page class="bg-black flex flex-center text-white">
    <q-table title="Albums" :rows="rows" :columns="columns" row-key="name">
      <template v-slot:body-cell-AlbumId="props">
        <q-td :props="props">
          <!-- Render raw HTML securely using v-html -->
          <div v-html="props.value"></div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const BaseUrl = "http://192.168.0.75:8000";

const columns = [
  {
    name: "AlbumId",
    required: true,
    label: "Album ID",
    align: "left",
    field: (row) => row.id,
    format: (val) =>
      `<a href="${BaseUrl}/api/smartphotoframe/default/album/${val}">${val}</a>`,
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Album Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "PhotoCount",
    align: "center",
    label: "Photos",
    field: "PhotoCount",
    sortable: true,
  },
  { name: "MediaCount", label: "Total", field: "MediaCount", sortable: true },
];

const rows = ref([
  {
    name: "Frozen Yogurt",
    PhotoCount: 159,
    MediaCount: 6.0,
  },
]);

await fetchAlbums();

async function updatePhotoCount(albums) {
  for (const album of albums) {
    const resp = await axios.get(
      `${BaseUrl}/api/smartphotoframe/album/${album.id}/photos`,
    );
    const photos = resp.data.filter((album) => album.type == "photo");
    rows.value.find((row) => row.name === album.name).PhotoCount =
      photos.length;
  }
}

async function fetchAlbums() {
  const resp = await axios.get(`${BaseUrl}/api/smartphotoframe/album/list`);
  console.log(resp.data);
  rows.value = resp.data.map((album) => ({
    id: album.id,
    name: album.name,
    PhotoCount: 0,
    MediaCount: 0,
  }));

  setTimeout(async () => {
    await updatePhotoCount(resp.data);
  }, 0);
}

async function getDefaultAlbum() {
  const resp = await axios.get(`${BaseUrl}/api/smartphotoframe/default/album`);
  if (resp.status === 200) {
    console.log(resp.data);
    return resp.data;
  }
}
</script>
