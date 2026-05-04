<script setup lang="ts">
import { ref } from "vue";

const editing = ref(false);
const showFullStats = ref(false);
const temImageStatuses = ["Evaluated", "Not evaluated", "Excluded"] as const;
type TemImageStatus = (typeof temImageStatuses)[number];

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
    mtdNormal: 20,
    mtdAbnormal: 10,
    odaAbsent: 6,
    iADAbsent: 4,
  },
  images: [
    { id: "img1", name: "img0001.tiff", status: "Evaluated" as TemImageStatus },
    { id: "img2", name: "img0002.tiff", status: "Not evaluated" as TemImageStatus },
    { id: "img3", name: "img0003.tiff", status: "Excluded" as TemImageStatus },
    { id: "img4", name: "img0004.tiff", status: "Evaluated" as TemImageStatus },
    { id: "img5", name: "img0005.tiff", status: "Not evaluated" as TemImageStatus },
    { id: "img6", name: "img0006.tiff", status: "Excluded" as TemImageStatus },
  ],
});

function nextTemImageStatus(status: TemImageStatus): TemImageStatus {
  const index = temImageStatuses.indexOf(status);
  return temImageStatuses[(index + 1) % temImageStatuses.length];
}

function save() {
  editing.value = false;
}

function cancel() {
  editing.value = false;
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <div>
        <h3>TEM</h3>
        <p class="muted">TEM report, structured counts, and linked image set.</p>
      </div>
      <div class="card-actions">
        <button v-if="!editing" class="button button--ghost" @click="editing = true">Edit</button>
        <button v-else class="button button--accent" @click="save">Save</button>
        <button v-if="editing" class="button button--ghost" @click="cancel">Cancel</button>
      </div>
    </div>

    <!-- Report -->
    <div class="block">
      <label class="label">Report</label>
      <div v-if="!editing" class="text-block">{{ tem.report }}</div>
      <textarea v-else v-model="tem.report" class="input" rows="4"></textarea>
    </div>

    <!-- staty -->
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
          <span class="stat-value">{{ tem.stats.totalCilia }}</span>
        </div>
        <div class="stat">
          <span class="label">Cilia with dynein arms</span>
          <span class="stat-value">{{ tem.stats.ciliaWithDyneinArms }}</span>
        </div>
        <div class="stat">
          <span class="label">Total MTD</span>
          <span class="stat-value">{{ tem.stats.totalMTD }}</span>
        </div>
        <div class="stat">
          <span class="label">Total IAD</span>
          <span class="stat-value">{{ tem.stats.totalIAD }}</span>
        </div>
        <div class="stat">
          <span class="label">Total ODA</span>
          <span class="stat-value">{{ tem.stats.totalODA }}</span>
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
          <div class="image-meta">
            <button
              class="image-status"
              :data-status="img.status"
              @click="img.status = nextTemImageStatus(img.status)"
            >
              {{ img.status }}
            </button>
          </div>
          <div class="image-title">{{ img.name }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tem-image {
  width: 100%;
  height: 104px;
  object-fit: cover;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-actions,
.block-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.block {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: #fff;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

h3 {
  margin: 0;
}

h4 {
  margin: 0;
  font-size: 15px;
}

.muted {
  color: #6b7280;
  font-size: 13px;
  margin: 2px 0 0;
}

.label {
  font-size: 12px;
  color: #6b7280;
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.text-block {
  background: #f9fafd;
  border: 1px solid #eef1f6;
  padding: 12px;
  border-radius: 10px;
  color: #111827;
  line-height: 1.4;
  white-space: pre-wrap;
}

.input {
  border: 1px solid #e1e5ea;
  padding: 10px 12px;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(75, 108, 255, 0.12);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stat {
  display: grid;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid #eef1f6;
  border-radius: 10px;
  background: #fbfcff;
}

.stat-value {
  font-size: 20px;
  font-weight: 750;
  color: #111827;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.image-card {
  border: 1px solid #eef1f6;
  border-radius: 10px;
  padding: 10px;
  background: #fbfcff;
}

.image-title {
  font-size: 13px;
  margin-top: 8px;
  color: #374151;
  font-weight: 600;
}

.image-meta {
  margin-top: 8px;
}

.image-status {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease;
}

.image-status:hover {
  transform: translateY(-1px);
  filter: brightness(0.98);
}

.image-status[data-status="Evaluated"] {
  background: #e7f6ed;
  color: #1b5e20;
  border-color: #cfeedd;
}

.image-status[data-status="Not evaluated"] {
  background: #fff4e5;
  color: #8a5a00;
  border-color: #ffe1b3;
}

.image-status[data-status="Excluded"] {
  background: #f1f3f7;
  color: #4b5563;
  border-color: #e1e5ea;
}

.button {
  padding: 6px 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #e1e5ea;
  background-color: white;
  font-size: 14px;
}

.button:hover {
  background-color: whitesmoke;
}

.button--ghost {
  background: transparent;
}

.button--accent {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.button--accent:hover {
  background: var(--accent-hover);
}

.upload-slides-button {
  background-color: var(--accent);
  color: white;
}

.upload-slides-button:hover{
  background-color: var(--accent-hover);
}

@media (max-width: 720px) {
  .stats-grid,
  .image-grid {
    grid-template-columns: 1fr;
  }
}
</style>
