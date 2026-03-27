<template lang="html">
    <div>
        <section class="card card--empty">
  <div class="empty-title">Not available</div>
  <div class="empty-subtitle">Nothing there yet =C</div>
</section>

    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="css" scoped>
    .card--empty {
  display: grid;
  place-items: center;
  min-height: 140px;
  border: 1px dashed #d7dce3;
  background: #fafbfe;
}

.empty-title {
  font-weight: 700;
  color: #6b7280;
}

.empty-subtitle {
  font-size: 13px;
  color: #9aa3af;
}

</style>