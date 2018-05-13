<template>
  <div class="surgery-type-selector">
    <div v-if="value !== null">
      {{ text(value) }}
      <strong>({{
        risk === 'H' ? 'High-risk'
        : risk === 'M' ? 'Medium-risk'
        : risk === 'L' ? 'Low-risk'
        : 'N.A.'}})
      </strong>

      <a href="#" v-on:click.prevent="clearValue" style="font-size: 80%">Change...</a>

      <div v-if="risk === null" class="inline-info-style">
        The selected surgical procedure is not covered by this risk calculator.
      </div>
    </div>
    <div v-else>
      <em>None selected</em>
    </div>

    <div v-if="!value">
      <div class="search-query-box">
        <input type="text" v-model="searchQuery"
          ref="txt" />
        <button @click="clearQuery">×</button>
      </div>

      <div class="search-results">
        <div v-for="(category, index) in limitedQueryResults" :key="index"
            @click="$emit('input', category)"
            :class="{
              selected: value === category
            }"
            class="search-results-entry">
          {{ text(category) }}
        </div>
        <div v-if="queryResults.length > limitedQueryResults.length">
          <i>({{queryResults.length - limitedQueryResults.length}} more results hidden.
            Refine your search terms to see them)</i>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .search-query-box {
    width: 100%;
    display: flex;
    border: solid 1px #888;
  }
  .search-query-box input {
    flex: 1 1 auto;
    border: none;
  }
  .search-query-box button {
    flex: 0 0 auto;
    border: none;
    background: transparent;
  }
  .search-results {
    max-height: 70vh;
    height: 240px;
    overflow: auto;
    border: solid 1px #888;
  }
  .search-results-entry {
    cursor: pointer;
  }
  .search-results-entry:hover {
    background-color: #DEF;
  }
  .search-results-entry.selected {
    background-color: #009;
    color: #FFF;
  }
</style>

<script>
import _ from 'lodash'
import * as JsSearch from 'js-search'
import SURGERY_TYPES from './surgeryTypes.js'
import surgeryTypes from './surgeryTypes.js'

const surgeryTypesIndex = new JsSearch.Search('index')
surgeryTypesIndex.addIndex('organ')
surgeryTypesIndex.addIndex('surgery')
surgeryTypesIndex.addDocuments(SURGERY_TYPES
  .map(([organ, surgery, risk], index) => ({
    organ, surgery, risk, index
  })))

export default {
  props: ['value'],

  data () {
    return {
      selectedCategory: null,
      selectedValue: null,
      searchQuery: '',
      searchQueryThrottled: '',
    }
  },

  watch: {
    searchQuery: _.throttle(function (s) {
      this.searchQueryThrottled = s
    }, 500)
  },

  computed: {
    queryResults () {
      if (this.searchQueryThrottled) {
        return surgeryTypesIndex.search(this.searchQueryThrottled)
          .map(s => SURGERY_TYPES[s.index])
      } else {
        return SURGERY_TYPES
      }
    },

    limitedQueryResults () {
      return this.queryResults.slice(0, 100)
    },

    risk () {
      return (this.value && this.value[2])
        ? this.value[2].charAt(0).toUpperCase()
        : null
    }
  },

  methods: {
    text (v) {
      return `${v[0]} - ${v[1]}`
    },

    clearValue () {
      this.searchQuery = this.value[1]
      this.$emit('input', null)
      this.$nextTick(() => this.$refs.txt.select())
    },

    clearQuery () {
      this.searchQuery = ''
      this.$nextTick(() => this.$refs.txt.select())
    }
  }
}
</script>
