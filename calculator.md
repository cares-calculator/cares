{% raw %}
<div id="app" markdown="0"> <!-- this is where Vue must take over -->
<div class="two-column">
  <div class="column">

    <section>
      <h2>Nature of Surgery</h2>

      <div class="field">
        <inline-info>
          <span class="field-name" slot="title">Nature of Surgery:</span>
          Is the surgery an emergency surgery?
        </inline-info>
        <label v-for="[category, score] in surgeryTypes">
          <input type="radio" :value="score" v-model="surgeryType" />
          {{ category }}
        </label>
      </div>

      <div class="field">
        <div class="field-name">Surgical Procedure:</div>

        <!-- not using components until we need something more complex -->
        <input type="text"
          v-if="procedure.selectedProcedure === null"
          class="search-field"
          ref="txt"
          placeholder="Search for procedure, e.g. Aortic dissection" v-model="procedure.searchQuery"/>

        <div v-if="procedure.searchQuery"
            style="height: 200px; overflow: auto; border: solid 1px black; max-height: 80vh">
          <template v-for="[organ, procedureName, procedureRisk] in procedure.searchResults">
            <div class="search-result-entry"
              v-on:click="procedureSelectResult(organ, procedureName, procedureRisk)">
              {{ organ }} -- {{procedureName}}
            </div>
          </template>
        </div>

        <div v-if="procedure.selectedProcedure !== null">
            {{ procedure.selectedProcedure }}
            <strong>({{ procedure.selectedProcedureRisk === 'H' ? 'High-risk'
          : procedure.selectedProcedureRisk === 'M' ? 'Medium-risk'
          : procedure.selectedProcedureRisk === 'L' ? 'Low-risk'
          : 'N.A.'}})</strong>

          <a href="#" v-on:click.prevent="
          procedure.searchQuery = procedure.selectedProcedure,
          procedure.selectedProcedure = null,
          $nextTick(function () { this.$refs.txt.select() })
          " style="font-size: 80%">Change...</a>

          <div v-if="surgicalRiskScore === null" class="inline-info-style">
            The selected surgical procedure is not covered by this risk calculator.
          </div>

        </div>
        <div v-else>
          <em>None selected</em>
        </div>
      </div>
    </section>

    <section>
      <h2>Basic Patient Profile</h2>

      <div class="field">
        <div class="field-name">Age:</div>
        <label v-for="[age, score] in ageRanges">
          <input type="radio" :value="score" v-model="ageScore" />
          {{ age }}
        </label>
      </div>

      <div class="field">
        <div class="field-name">Sex of Patient:</div>
        <label v-for="[category, score] in sexTypes">
          <input type="radio" :value="score" v-model="sexType" />
          {{ category }}
        </label>
      </div>

      <div class="field">
        <inline-info>
          <span class="field-name" slot="title">RDW:</span>
          Red-cell distribution width is a measure of the variation in...
        </inline-info>
        <label v-for="[category, score] in RDWScores">
          <input type="radio" :value="score" v-model="RDWScore" />
          {{ category }}
        </label>
      </div>
    </section>
  </div>

  <div class="column">
    <section>
      <h2>Co-morbidities</h2>
      <button v-on:click="ASAScore = 0, IHDScore = 0, chfType = 0, anaemiaScore = 0">
        No Co-morbidities
      </button>


      <div class="field">
        <div class="field-name">Anaemia Score:</div>
        <label v-for="[category, score] in anaemiaScores">
          <input type="radio" :value="score" v-model="anaemiaScore" />
          {{ category }}
        </label>
      </div>

      <div class="field">
        <div class="field-name">ASA Score:</div>
        <label v-for="[category, score] in ASAScores">
          <input type="radio" :value="score" v-model="ASAScore" />
          {{ category }}
        </label>
      </div>

      <div class="field">
        <div class="field-name">History of Ischaemic Heart Disease:</div>
        <label v-for="[category, score] in IHDScores">
          <input type="radio" :value="score" v-model="IHDScore" />
          {{ category }}
        </label>
      </div>
      <div class="field">
        <div class="field-name">History of Congestive Heart Failure:</div>
        <label v-for="[category, score] in chfTypes">
          <input type="radio" :value="score" v-model="chfType" />
          {{ category }}
        </label>
      </div>
    </section>
  </div> <!--column -->
</div><!-- two-column -->
<section markdown="0">
  <strong>Total score</strong> {{subtotalScore}}
  <div v-if="riskLevel === null">
    Please fill up all fields to compute the score
  </div>
  <div v-else>
    <dl>
      <dt>30-day mortality risk (%):</dt>
      <dd>{{ risks[riskLevel][2] }}</dd>

      <dt>Risk of post-operative ICU stay > 24h (%):</dt>
      <dd>{{ risks[riskLevel][3] }}</dd>

      <dt>Recommendation:</dt>
      <dd v-if="riskLevel === 0">
        Proceed with surgery
      </dd>
      <dd v-else-if="riskLevel === 1">
        Search for modifiable risk factors and optimize if possible
      </dd>
      <dd v-else-if="riskLevel === 2">
        <ol>
          <li>Search for modifiable risk factors and optimize if possible.</li>
          <li>Arrange for appropriate postoperative monitoring / clinical care</li>
          <li>Plan for possible ICU admission/ High dependency care</li>
        </ol>
      </dd>
      <dd v-else-if="riskLevel === 3">
        <ol>
          <li>Search for modifiable risk factors and optimize if possible.</li>
          <li>Arrange for appropriate postoperative monitoring / clinical care</li>
          <li>Plan for possible ICU admission/ High dependency care</li>
          <li>Consider alternative surgical or non-surgical options if appropriate</li>
          <li>Strongly consider not proceeding without availability of ICU bed.</li>
        </ol>
      </dd>
    </dl>
  </div><!--column-->
</section>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js"></script>
<script src="calculator/surgeryTypes.js"></script>
<script src="calculator/calculator.js"></script>
{% endraw %}
