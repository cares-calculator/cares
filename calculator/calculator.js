

document.addEventListener('DOMContentLoaded', function () {

  Vue.component('inlineInfo', {
    template: '#inline-info-template',
    data: function () {
      return {
        shown: false,
      }
    }
  })


  new Vue({
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
          this.procedure.searchResults = window.SURGERY_TYPES.filter(function (t) {
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
          const min = this.risks[0]
          const max = this.risks[1]
          // const [min, max] = this.risks[i]
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
  }).$mount('#app')
})
