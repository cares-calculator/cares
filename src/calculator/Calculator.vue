<template>
  <main>
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
  </main>
</template>
<script>
import InlineInfo from './InlineInfo.vue'
import SURGERY_TYPES from './surgeryTypes.js'

export default {
  components: {
    InlineInfo,
  },
  data: {
    ageRanges: [
      ['< 30', 0],
      ['30 - 49', 3],
      ['50 - 74', 5],
      ['75 - 84', 6],
      ['≥ 85', 8],
    ],

    anaemiaScores: [
      ['None', 0],
      ['Mild', 1],
      ['Moderate/Severe', 3],
    ],

    RDWScores: [
      ['≤ 15.7', 0],
      ['> 15.7', 2],
    ],

    IHDScores: [
      ['No', 0],
      ['Yes', 2],
    ],

    ASAScores: [
      ['ASA1/ASA2', 0],
      ['ASA3', 4],
      ['ASA4', 7],
    ],

    surgeryTypes: [
      ['Elective', 0],
      ['Emergency', 3],
    ],

    sexTypes: [
      ['Male', 1],
      ['Female', 0],
    ],

    chfTypes: [
      ['No', 0],
      ['Yes', 1],
    ],

    ageScore: null,
    anaemiaScore: null,
    RDWScore: null,
    IHDScore: null,
    chfType: null,
    ASAScore: null,
    surgeryType: null,
    sexType: null,


    risks: [
      // min, max, 30-day mortality risk, risk of post-operative, suggestion
      [0,   10,    0,  0.1],
      [11,  20,  0.2,  0.9],
      [21,  30,  1.9,  4.9],
      [31, 1e9, 11.5, 14.9],
    ],

    procedure: {
      searchQuery: '',
      organ: null,
      procedureName: null,
      procedureRisk: null,

      selectedOrgan: null,
      selectedProcedure: null,
      selectedProcedureRisk: null,

      searchResults: [],
    }
  },

  watch: {
    'procedure.searchQuery': _.throttle(function (s) {
      if (!s) {
        this.procedure.searchResults = []
      } else {
        const q = s.toUpperCase()
        this.procedure.searchResults = SURGERY_TYPES.filter(function (t) {
          const b = (t[0] + ' -- ' + t[1]).toUpperCase()
          return b.indexOf(q) !== -1
        })
      }
    }, 400)
  },

  computed: {
    scoreComponents: function () {
      return [
        this.ageScore,
        this.anaemiaScore,
        this.RDWScore,
        this.IHDScore,
        this.chfType,
        this.ASAScore,
        this.surgicalRiskScore,
        this.surgeryType,
        this.sexType,
      ]
    },

    subtotalScore: function () {
      return this.scoreComponents.reduce(
        function (x, y) {
          return (x || 0) + (y || 0)
        },
        0
      )
    },

    totalScore: function () {
      return this.scoreComponents.reduce(
        function (x, y) {
          if (x === null || y === null) return null
          return x + y
        },
        0
      )
    },

    riskLevel: function () {
      if (this.totalScore === null) {
        return null
      }
      for (let i = 0; i < this.risks.length; i++) {
        const [min, max] = this.risks[i]
        if (min <= this.totalScore && this.totalScore <= max) {
          return i
        }
      }
    },

    surgicalRiskScore: function () {
      return (this.procedure.selectedProcedureRisk === 'H') ? 2
        : (this.procedure.selectedProcedureRisk === 'M') ? 2
        : (this.procedure.selectedProcedureRisk === 'L') ? 0
        : null
    },

  },
  methods: {
    procedureSelectResult(organ, procedureName, procedureRisk) {
      this.procedure.selectedProcedure = organ + ' -- ' + procedureName
      this.procedure.selectedProcedureRisk = procedureRisk.charAt(0)
        .toUpperCase()

      this.procedure.searchQuery = ''
    },
  }
}
</script>
