<template>
  <div>
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
              <template v-for="[organ, procedureName, procedureRisk] in procedure.searchResults.slice(0, 200)">
                <div class="search-result-entry"
                  v-on:click="procedureSelectResult(organ, procedureName, procedureRisk)">
                  {{ organ }} -- {{procedureName}}
                </div>
              </template>
              <template v-if="procedure.searchResults.length > 200">
                <div class="search-result-entry">
                  <em>(... additional results hidden -- refine your search query)</em>
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
              <span class="field-name" slot="title">Red cell distribution width (RDW):</span>
              Red cell distribution width (RDW) is reported as a coefficient of variation (percentage)
              of red blood cell volume in the automated full blood count. The chosen value of 15.7% was
              the upper limit of normal range in our laboratory.
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
            <inline-info>
              <span class="field-name" slot="title">Anaemia Score:</span>
              <p>Defined according to WHO definition</p>
              <p>Mild anaemia – In men, Hb between 11.0-12.9g/dL; in women, Hb between 11.0-11.9g/dL</p>
              <p>Moderate/severe anaemia – Hb≤ 10.9g/dL</p>
            </inline-info>
            <label v-for="[category, score] in anaemiaScores">
              <input type="radio" :value="score" v-model="anaemiaScore" />
              {{ category }}
            </label>
          </div>

          <div class="field">
            <inline-info>
              <span class="field-name" slot="title">American Society of Anesthesiologists (ASA) Physical Status (PS) Score:</span>
              <ol>
                <li>Healthy person.</li>
                <li>Mild systemic disease.</li>
                <li>Severe systemic disease.</li>
                <li>Severe systemic disease that is a constant threat to life.</li>
                <li>A moribund person who is not expected to survive without the operation.</li>
              </ol>
            </inline-info>
            <label v-for="[category, score] in ASAScores">
              <input type="radio" :value="score" v-model="ASAScore" />
              {{ category }}
            </label>
          </div>

          <div class="field">
            <inline-info>
              <span class="field-name" slot="title">History of Ischaemic Heart Disease:</span>
              As defined in the Revised Cardiac Risk Index (RCRI)<sup>2</sup> - History of myocardial infarction (MI);
              history of positive exercise test; current chest pain considered due to myocardial ischaemia;
              use of nitrate therapy or ECG with pathological Q waves. One of the components of Revised
              Cardiac Risk Index (RCRI)<sup>2</sup>
            </inline-info>
            <label v-for="[category, score] in IHDScores">
              <input type="radio" :value="score" v-model="IHDScore" />
              {{ category }}
            </label>
          </div>
          <div class="field">
            <inline-info>
              <span class="field-name" slot="title">History of Congestive Heart Failure:</span>
              As defined in the Revised Cardiac Risk Index (RCRI)<sup>2</sup> - Pulmonary edema, bilateral
              rales or S3 gallop; paroxysmal nocturnal dyspnea; chest x-ray (CXR) showing
              pulmonary vascular redistribution
            </inline-info>
            <label v-for="[category, score] in chfTypes">
              <input type="radio" :value="score" v-model="chfType" />
              {{ category }}
            </label>
          </div>
        </section>
      </div> <!--column -->
    </div><!-- two-column -->
    <section markdown="0">
      <strong>Score components</strong>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[type, score] in scoreComponents" :key="type">
            <td>{{type}}</td>
            <td style="text-align: center">{{score}}</td>
          </tr>
        </tbody>
      </table>
    </section>
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
      ['30 - 49', 4],
      ['50 - 74', 7],
      ['75 - 84', 8],
      ['≥ 85', 10],
    ],

    anaemiaScores: [
      ['None', 0],
      ['Mild', 2],
      ['Moderate/Severe', 5],
    ],

    RDWScores: [
      ['≤ 15.7', 0],
      ['> 15.7', 3],
    ],

    IHDScores: [
      ['No', 0],
      ['Yes', 3],
    ],

    ASAScores: [
      ['ASA1/ASA2', 0],
      ['ASA3', 7],
      ['ASA4', 11],
    ],

    surgeryTypes: [
      ['Elective', 0],
      ['Emergency', 5],
    ],

    sexTypes: [
      ['Male', 2],
      ['Female', 0],
    ],

    chfTypes: [
      ['No', 0],
      ['Yes', 2],
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
        ['Elective/Emergency surgery', this.surgeryType],
        ['Surgical risk', this.surgicalRiskScore],
        ['Age', this.ageScore],
        ['Sex', this.sexType],
        ['RDW', this.RDWScore],
        ['Anaemia', this.anaemiaScore],
        ['ASA physical status', this.ASAScore],
        ['Ischaemic heart disease', this.IHDScore],
        ['Congestive heart failure', this.chfType],
      ]
    },

    subtotalScore: function () {
      return this.scoreComponents
      .map(s => s[1])
      .reduce(
        (x, y) => (x || 0) + (y || 0),
        0
      )
    },

    totalScore () {
      return this.scoreComponents
      .map(s => s[1])
      .reduce(
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
      return (this.procedure.selectedProcedureRisk === 'H') ? 5
        : (this.procedure.selectedProcedureRisk === 'M') ? 5
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
