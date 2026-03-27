<script setup lang="ts">
import { ref } from "vue";

const editing = ref(false);
const showFullStats = ref(false);

const tem = ref({
  report: "Report goes here. Short summary of findings..",
  stats: {
    totalCilia: 120,
    ciliaWithDyneinArms: 45,
    totalMTD: 30,
    totalIAD: 18,
    totalODA: 12,
  },
  fullStats: {
    // optional extra fields for expanded view
    mtdNormal: 20,
    mtdAbnormal: 10,
    odaAbsent: 6,
    iADAbsent: 4,
  },
  images: [
    { id: "img1", name: "img0001.tiff" },
    { id: "img2", name: "img0002.tiff" },
    { id: "img3", name: "img0003.tiff" },
    { id: "img4", name: "img0004.tiff" },
    { id: "img5", name: "img0005.tiff" },
    { id: "img6", name: "img0006.tiff" },
  ],
});

function save() {
  editing.value = false;
  // TODO: persist to store/API
}

function cancel() {
  editing.value = false;
  // TODO: reset from source of truth
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <h3>TEM</h3>
      <div class="card-actions">
        <button v-if="!editing" class="button button--ghost" @click="editing = true">Edit</button>
        <button v-else class="button" @click="save">Save</button>
        <button v-if="editing" class="button button--ghost" @click="cancel">Cancel</button>
      </div>
    </div>

    <!-- Report -->
    <div class="block">
      <label class="label">Report</label>
      <div v-if="!editing" class="text-block">{{ tem.report }}</div>
      <textarea v-else v-model="tem.report" class="input" rows="4"></textarea>
    </div>

    <!-- Quick stats -->
    <div class="block">
      <div class="block-header">
        <h4>Statistics</h4>
        <button class="button button--ghost" @click="showFullStats = !showFullStats">
          {{ showFullStats ? "Hide full statistics" : "Show full statistics" }}
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat">
          <span class="label">Total cilia</span>
          <span>{{ tem.stats.totalCilia }}</span>
        </div>
        <div class="stat">
          <span class="label">Cilia with dynein arms</span>
          <span>{{ tem.stats.ciliaWithDyneinArms }}</span>
        </div>
        <div class="stat">
          <span class="label">Total MTD</span>
          <span>{{ tem.stats.totalMTD }}</span>
        </div>
        <div class="stat">
          <span class="label">Total IAD</span>
          <span>{{ tem.stats.totalIAD }}</span>
        </div>
        <div class="stat">
          <span class="label">Total ODA</span>
          <span>{{ tem.stats.totalODA }}</span>
        </div>
      </div>

      <!--<div v-if="showFullStats" class="stats-grid">
        <div class="stat">
          <span class="label">MTD normal</span>
          <span>{{ tem.fullStats.mtdNormal }}</span>
        </div>
        <div class="stat">
          <span class="label">MTD abnormal</span>
          <span>{{ tem.fullStats.mtdAbnormal }}</span>
        </div>
        <div class="stat">
          <span class="label">ODA absent</span>
          <span>{{ tem.fullStats.odaAbsent }}</span>
        </div>
        <div class="stat">
          <span class="label">IAD absent</span>
          <span>{{ tem.fullStats.iADAbsent }}</span>
        </div>
      </div> -->
    </div>

    <!-- Images -->
    <div class="block">
      <div class="block-header">
        <h4>TEM Images</h4>
        <div class="block-actions">
          <button class="button upload-slides-button">Upload slides</button>
          <button class="button button--ghost">Open in CiliaScan</button>
        </div>
      </div>

      <div class="image-grid">
        <div class="image-card" v-for="img in tem.images" :key="img.id">
          <img class="tem-image" src="../../assets/tem_image.png" alt="TEM image" />
          <div class="image-title">{{ img.name }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tem-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions,
.block-actions {
  display: flex;
  gap: 8px;
}

.block {
  margin-top: 4px;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.label {
  font-size: 12px;
  color: #6b7280;
}

.text-block {
  background: #f9fafb;
  border: 1px solid #eef1f6;
  padding: 10px;
  border-radius: 8px;
  color: #111827;
}

.input {
  border: 1px solid #e1e5ea;
  padding: 8px 10px;
  border-radius: 8px;
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.stat {
  display: grid;
  gap: 4px;
  padding: 8px;
  border: 1px solid #eef1f6;
  border-radius: 8px;
  background: #fff;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.image-card {
  border: 1px solid #eef1f6;
  border-radius: 8px;
  padding: 8px;
}

.image-placeholder {
  background: #f4f6f9;
  height: 80px;
  border-radius: 6px;
  margin-bottom: 6px;
}

.image-title {
  font-size: 13px;
}

.button {
    padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #e1e5ea;
  background-color: white;
}

.button:hover {
  background-color: whitesmoke;
}

.button--ghost {
  background: transparent;
}

.upload-slides-button {
    background-color: var(--accent);
    color: white;
}
</style>
