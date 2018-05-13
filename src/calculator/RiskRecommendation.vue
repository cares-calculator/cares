<template>
  <div v-if="riskLevel === 0">
    Proceed with surgery
  </div>
  <div v-else-if="riskLevel === 1">
    Search for modifiable risk factors and optimize if possible
  </div>
  <div v-else-if="riskLevel === 2">
    <ol>
      <li>Search for modifiable risk factors and optimize if possible.</li>
      <li>Arrange for appropriate postoperative monitoring / clinical care</li>
      <li>Plan for possible ICU admission/ High dependency care</li>
    </ol>
  </div>
  <div v-else-if="riskLevel === 3">
    <ol>
      <li>Search for modifiable risk factors and optimize if possible.</li>
      <li>Arrange for appropriate postoperative monitoring / clinical care</li>
      <li>Plan for possible ICU admission/ High dependency care</li>
      <li>Consider alternative surgical or non-surgical options if appropriate</li>
      <li>Strongly consider not proceeding without availability of ICU bed.</li>
    </ol>
  </div>
</template>
<script>
export default {
  props: ['riskLevel']
}
</script>
