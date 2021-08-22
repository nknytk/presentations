const maps = {}
const objectsOnMap = {}
let cities = null
let cityGeoJson = null
let cityModal = null

const attrItems = {
  population: {
    index: 0,
    jpName: '人口',
    unit: '人',
    formatter: e => e,
    colorRange: [0, 500000]
  },
  num_of_households: {
    index: 1,
    jpName: '世帯数',
    unit: '世帯',
    formatter: e => e,
    colorRange: [0, 300000]
  },
  area: {
    index: 2,
    jpName: '面積',
    unit: 'k㎡',
    formatter: e => e.toFixed(1),
    colorRange: [0, 1500]
  },
  population_growth_rate: {
    index: 3,
    jpName: '人口増加率',
    unit: '%',
    formatter: e => e.toFixed(1),
    colorRange: [-20, 20]
  },
  household_growth_rate: {
    index: 4,
    jpName: '世帯増加率',
    unit: '%',
    formatter: e => e.toFixed(1),
    colorRange: [-20, 20]
  },
  density: {
    index: 5,
    jpName: '人口密度',
    unit: '人/k㎡',
    formatter: e => Math.round(e),
    colorRange: [0, 20000]
  } ,
  people_in_household: {
    index: 6,
    jpName: '世帯人数',
    unit: '人/世帯',
    formatter: e => e.toFixed(2),
    colorRange: [1.5, 3.5]
  },
  avg_age: {
    index: 7,
    jpName: '平均年齢',
    unit: '歳',
    formatter: e => e.toFixed(1),
    colorRange: [40, 60]
  },
  a65_ratio: {
    index: 8,
    jpName: '高齢者率',
    unit: '%',
    formatter: e => e.toFixed(1),
    colorRange: [20, 40]
  },
  unemployment_rate: {
    index: 9,
    jpName: '完全失業率',
    unit: '%',
    formatter: e => e.toFixed(1),
    colorRange: [2.0, 7.0]
  },
  day_night_population_ratio: {
    index: 10,
    jpName: '昼夜間人口比率',
    unit: '%',
    formatter: e => e.toFixed(1),
    colorRange: [70, 170]
  }
}

function toggleSideBar() {
  console.log('toggle')
}

function initMap(mapDivId, center=[37.3809591, 137.2673068], zoomLevel=6) {
  const map = L.map(mapDivId, {center: center, zoom: zoomLevel, minZoom: 6, maxZoom: 15})
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
  return map
}

function fetchGeojsonAndDraw(geojsonURL, mapKey) {
  fetch(geojsonURL).then(data => {
    data.json().then(geojson => {
      cityGeoJson = geojson
      const map = maps[mapKey]
      drawFeaturesOnMap(geojson, map, 'population')
      cityRanking('population', 'desc')
      // ページの書き込みが終わったらloading表示を止める
      cityModal.hide()
    })
  })
}

function drawFeaturesOnMap(parsedGeoJson, mapObj, colorBy) {
  if (cities) cities.remove()
  const valueIndex = attrItems[colorBy].index
  const colorRange = attrItems[colorBy].colorRange
  cities = L.geoJSON(parsedGeoJson, {
    style: function(feature) {
      const featureColor = getColor(feature.properties.values[valueIndex], ...colorRange)
      return {
        color: 'rgb(255,255,255)',
        weight: 1,
        fill: true,
        fillColor: featureColor,
        fillOpacity: 0.6
      }
    },
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function(e) {
          new L.Popup({ offset: new L.Point(0, -1), closeButton: false, autoPan: false })
            .setContent(featureSummary(feature, colorBy))
            .setLatLng(e.target.getCenter())
            .openOn(mapObj)
          layer.setStyle({weight: 3, fillOpacity: 1.0})
        },
        mouseout: function(e) {
          mapObj.closePopup()
          cities.resetStyle(e.target)
        },
        click: function(e) {
          cityDetailModal(e.target.feature.properties.area_code)
          //mapObj.fitBounds(e.target.getBounds())
        }
      })
    }
  })
  cities.addTo(mapObj)
  replaceLeafletLegend(colorBy, 'city-legend')
}

function getColor(featureVal, minVal, maxVal) {
  if (featureVal == null) {
    return 'rgb(127,127,127)'
  }

  featureVal = Math.min(featureVal, maxVal)
  featureVal = Math.max(featureVal, minVal)
  if (featureVal > 0) {
    if (minVal > 0) { 
      const rt = (featureVal - minVal) / (maxVal - minVal)
      const g = 255 - Math.round(125 * rt)
      const b = 255 - Math.round(255 * rt)
      return `rgb(255,${g},${b})`
    } else {
      const g = 255 - Math.round(125 * featureVal / maxVal)
      const b = 255 - Math.round(255 * featureVal / maxVal)
      return `rgb(255,${g},${b})`
    }
  } else if (featureVal < 0) {
    const r = 255 - Math.round(190 * featureVal / minVal)
    const g = 255 - Math.round(150 * featureVal / minVal)
    const b = 255 - Math.round(30 * featureVal / minVal)
    return `rgb(${r},${g},${b})`
  } else {
    return 'rgb(255,255,255)'
  }
}

/* 地域にマウスオーバーした際に表示されるポップアップの内容を作成する */
function featureSummary(feature, attrKey) {
  const cityName = feature.properties.area_name
  const attrName = attrItems[attrKey].jpName
  const attrVal = feature.properties.values[attrItems[attrKey].index]
  if ((attrVal == null) || (isNaN(attrVal))) {
    return `${cityName}<br/>${attrName}: データなし`
  } else {
    const formattedVal = attrItems[attrKey].formatter(attrVal)
    const unit = attrItems[attrKey].unit
    return `${cityName}<br/>${attrName}: ${formattedVal} ${unit}`
  }
}

/*
geojsonのfeaturesを並べ替える。
sortKey: 並べ替えに使う項目を "population", "num_of_households", "area", "density", "people_in_household", "population_growth_rate", "household_growth_rate" から選んで指定する。
direction: 並べ替えの方法を "asc", "desc" から選んで指定する。どちらを選んでもnullとNaNは常に最後尾となる。
*/
function sortGeojsonFeatures(geojson, sortKey, direction) {
  let rightIsGreater = -1
  let leftIsGreater = 1
  if (direction == 'desc') {
    rightIsGreater = 1
    leftIsGreater = -1
  }
  const valueIndex = attrItems[sortKey].index

  geojson.features.sort(function(i, j) {
    const ii = i.properties.values[valueIndex]
    const jj = j.properties.values[valueIndex]
    // nullは常に末尾
    if (ii == null) {
        return 1
    } else if (jj == null) {
        return -1
    }
    // 数値の大小で並び替え
    if (ii > jj) {
      return leftIsGreater
    } else if (ii < jj) {
      return rightIsGreater
    } else {
      return 0
    }
  })
}

/* 市区町村ランキングのテーブルを作る */
function cityRanking(sortKey, direction, topN=50) {
  sortGeojsonFeatures(cityGeoJson, sortKey, direction)
  const table = createElem('table', '', {class: 'table table-hover'})
  const tHead = createElem('thead', '', {id: 'ranking-table-head'})
  const headerRow = createElem('tr', '', {class: 'scrollableTBody'})

  // ヘッダ行の作成
  headerRow.appendChild(createElem('th', '順位', {scope: 'col', style: 'width: 150px;'}))

  const nameHeader = createElem('th', '市区町村 ', {scope: 'col'})
  const nameInput = document.getElementById('name-input')
  const searchName = nameInput == null ? '' : nameInput.value
  const newNameInput = createElem('input', '', {id: 'name-input', style: 'width: 200px;', placeholder: '絞り込み'})
  newNameInput.value = searchName
  newNameInput.addEventListener('keypress', event => { if (event.keyCode === 13) cityRanking(sortKey, direction, topN) })
  nameHeader.appendChild(newNameInput)
  nameHeader.appendChild(createElem('button', 'Q', {
    class: 'btn btn-primary',
    style: "margin-top: -2px",
    onclick: `cityRanking('${sortKey}', '${direction}', ${topN})`
  }))
  headerRow.appendChild(nameHeader)

  const cell = createElem('th', `${attrItems[sortKey].jpName} (${attrItems[sortKey].unit}) `, {scope: 'col'})
  if (direction == 'asc') {
    cell.appendChild(createElem('button', '昇順', {
      'class': 'btn btn-primary',
      'title': '現在のソート順は昇順です。クリックすると降順に変更します',
      'onclick': `cityRanking('${sortKey}', 'desc', ${topN})`
    }))
  } else {
    cell.appendChild(createElem('button', '降順', {
      'class': 'btn btn-primary btn-sm',
      'title': '現在のソート順は降順です。クリックすると昇順に変更します',
      'onclick': `cityRanking('${sortKey}', 'asc', ${topN})`
    }))
  }
  headerRow.appendChild(cell)
  tHead.appendChild(headerRow)
  table.appendChild(tHead)

  // データ行の作成
  const valueIndex = attrItems[sortKey].index
  const tbodyHeight = getVizAreaHeight() - tHead.offsetHeight
  const tBody = createElem('tbody', '', {id: 'ranking-table-body', class: 'scrollableTBody', style: `height: ${tbodyHeight}px;`})
  let rowCount = 0
  for (let rank = 1; (rowCount <= topN) && (rank <= cityGeoJson.features.length); rank++) {
    const props = cityGeoJson.features[rank - 1].properties
    if ((searchName != '') && (props.area_name.indexOf(searchName) == -1)) continue
    const row = createElem('tr', '', {class: 'scrollableTBody', 'data-area-id': props.area_code})
    row.addEventListener('click', event => cityDetailModal(event.target.parentNode.getAttribute('data-area-id')))
    row.appendChild(createElem('td', rank, {style: 'width: 150px;'}))
    row.appendChild(createElem('td', props.area_name))
    if (props.values[valueIndex] == null) {
      row.appendChild(createElem('td', 'データなし'))
    } else {
      row.appendChild(createElem('td', attrItems[sortKey].formatter(props.values[valueIndex])))
    }
    tBody.appendChild(row)
    rowCount++
  }
  table.appendChild(tBody)

  const tableContainer = document.getElementById('ranking')
  const prevTable = document.getElementById('cityRanking')
  if (prevTable != null) {
    tableContainer.removeChild(prevTable)
  }
  table.setAttribute('id', 'cityRanking')
  tableContainer.appendChild(table)
}

/* HTML Element を作るヘルパー関数 */
function createElem(tag, text='', attributes={}) {
  const elem = document.createElement(tag)
  if (text !== '') {
    elem.textContent = text
  }
  for (const [attrKey, attrVal] of Object.entries(attributes)) {
    elem.setAttribute(attrKey, attrVal)
  }
  return elem
}

/* modalを初期化する */
function initCityModal() {
  const modalDialog = document.getElementById('city-detail-modal-dialog')
  modalDialog.innerHTML = ''
  // cssで90%指定だとスマホのブラウザで幅が正しく表示されないため、具体的な数値を指定する
  modalDialog.setAttribute('style', `width: ${Math.round(window.innerWidth * 0.9)}px; max-width: inherit;`)
  cityModal = new bootstrap.Modal(document.getElementById('city-detail-modal'))
}

/* 読み込み中を表すSpinnerを作る */
function createSpinner() {
  const loadingSpinner = createElem('div', '', {id: 'loading-spinner', class: 'd-flex justify-content-center'})
  const spinner = createElem('div', '', {class: 'spinner-border', role: 'status', style: 'color: white; width: 5rem; height: 5rem;'})
  loadingSpinner.appendChild(spinner)
  return loadingSpinner
}

/* 市区町村詳細モーダルを作る */
function cityDetailModal(area_code) {
  initCityModal()
  cityModal.show()
  // loading表示にしてからデータを取りに行く
  const modalDialog = document.getElementById('city-detail-modal-dialog')
  modalDialog.appendChild(createSpinner())

  fetch(`./detailed_areas/${area_code}.json`).then(data => {
    data.json().then(geojson => {
      const props = geojson.features[0].properties

      const modalContent = createElem('div', '', {class: 'modal-content'})
      const modalHeader = createElem('div', '', {class: 'modal-header'})
      modalHeader.appendChild(createElem('h3', props.pref_name + props.city_name,  {class: 'modal-title'}))
      modalHeader.appendChild(createElem('button', '',  {type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close'}))
      modalContent.appendChild(modalHeader)

      const modalBody = createElem('div', '', {class: 'modal-body container-fluid'})
      modalBody.appendChild(createElem('div', '', {id: 'base-info', class: 'row'}))
      modalBody.appendChild(createElem('div', '', {id: 'population-history'}))
      modalBody.appendChild(createElem('div', '', {id: 'population-pyramid'}))
      modalBody.appendChild(createElem('div', '', {id: 'housing-type'}))
      modalBody.appendChild(createElem('div', '', {id: 'industry-type'}))
      modalDialog.innerHTML = ''
      modalContent.appendChild(modalBody)
      modalDialog.appendChild(modalContent)

      // 基本情報
      const leftCol = createElem('div', '', {class: 'col-sm-5'})
      const tbl = createElem('table', '', {class: 'table'})
      const tblBody = createElem('tbody')
      function appendRow(key, value) {
        let row = createElem('tr')
        row.appendChild(createElem('th', key, {scope: 'col'}))
        row.appendChild(createElem('td', value))
        tblBody.appendChild(row)
      }
      appendRow('都道府県', props.pref_name)
      appendRow('市区町村', props.city_name)
      appendRow('人口', props.population[0])
      appendRow('昼間人口', props.daytime_population)
      appendRow('世帯数', props.num_of_households[0])
      appendRow('人口密度(人/k㎡)', (props.population[0] / props.area[0] * 1000000).toFixed(1))
      appendRow('世帯あたり人数(人/世帯)', props.num_of_households[0] > 0 ? (props.population[0] / props.num_of_households[0]).toFixed(2) : '-')
      appendRow('平均年齢(歳)', props.avg_age.toFixed(2))
      appendRow('高齢者率(%)', props.a65_ratio.toFixed(2))
      appendRow('年少人口率(%)', props.u15_ratio.toFixed(2))
      appendRow('完全失業率(%)', props.unemployment_rate == null ? '-' : props.unemployment_rate.toFixed(2))
      appendRow('面積(k㎡)', (props.area[0] / 1000000).toFixed(1))
      tbl.appendChild(tblBody)
      leftCol.appendChild(tbl)
      document.getElementById('base-info').appendChild(leftCol)

      const rightCol = createElem('div', '', {class: 'col-sm-7'})
      rightCol.appendChild(createElem('div', '', {id: 'city-map', style: `height: ${leftCol.offsetHeight}px`}))
      document.getElementById('base-info').appendChild(rightCol)
      const map = L.map('city-map')
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)
      const obj = L.geoJSON(geojson, {})
      obj.addTo(map)
      map.fitBounds(obj.getBounds())

      // 人口推移の折れ線グラフ
      let data = [
        {x: props.year, y: props.population, name: '人口', hovertemplate: '<span style="font-size:20px">%{x}年: %{y:,}人</span>'},
        {x: props.year, y: props.num_of_households, name: '世帯数', hovertemplate: '<span style="font-size:20px">%{x}年: %{y:,}世帯</span>'}
      ]
      let chartLayout = {title: '人口と世帯数の推移', height: 600,
	                 xaxis: {fixedrange: true}, yaxis: {rangemode: 'tozero', fixedrange: true}, font: {size: 20}}
      Plotly.newPlot('population-history', data, chartLayout, {displayModeBar: false})

      if (props.population[0] == 0) return

      // 年齢別人口のピラミッド棒グラフ
      const ageRanges = ['0-9', '10-19', '20~29', '30~39', '40~49', '50~59', '60~69', '70~79', '80~89', '90~99', '100~']
      const femaleTexts = []
      const maleTexts = []
      for (let i = 0; i < ageRanges.length; i++) {
        femaleTexts.push(`${ageRanges[i]}歳: ${props.female_ages[i]}人`)
        maleTexts.push(`${ageRanges[i]}歳: ${props.male_ages[i]}人`)
      }
      data = [
        {type: 'bar', orientation: 'h', text: maleTexts, textposition: 'none',
         x: props.male_ages.map(v => -v), y: ageRanges, name: '男性人口', hovertemplate: '<span style="font-size:20px">%{text}</span>'},
        {type: 'bar', orientation: 'h', text: femaleTexts, textposition: 'none',
         x: props.female_ages, y: ageRanges, name: '女性人口', hovertemplate: '<span style="font-size:20px">%{text}</span>'}
      ]
      chartLayout =  {title: '年齢性別ごとの人口', height: 600, bargap: 0.1,
	              xaxis: {fixedrange: true}, yaxis: {fixedrange: true}, barmode: 'relative', font: {size: 20}}
      Plotly.newPlot('population-pyramid', data, chartLayout, {displayModeBar: false})

      // 住居種別の円グラフ
      if (Object.keys(props.housing).reduce((sum, key) => sum += props.housing[key], 0) > 0) {
        data = [{
          name: '住居種別',
          type: 'pie',
          values: [props.housing.owned_house, props.housing.public_rented_house, props.housing.private_rented_house,
	   props.housing.salary_housing, props.housing.room_renting, props.housing.facilities + props.housing.other],
          labels: ['持ち家', '公営の借家', '私営の借家', '給与住宅(社宅など)', '間借り', '施設等'],
          automargin: true,
          direction: 'clockwise',
          sort: false,
          hovertemplate: '<span style="font-size: 20px">%{label}: %{value:,}世帯(%{percent})</span>'
        }]
        chartLayout = {title: '住居の種類', height: 600, showlegend: true, font: {size: 20}}
        Plotly.newPlot('housing-type', data, chartLayout, {displayModeBar: false})
      }

      // 産業分類の円グラフ
      if (props.primary_industry + props.secondary_industry + props.tertiary_industry) {
        data = [{
          name: '産業分類',
          type: 'pie',
          values: [props.primary_industry, props.secondary_industry, props.tertiary_industry],
          labels: ['第一次産業', '第二次産業', '第三次産業'],
          automargin: true,
          direction: 'clockwise',
          sort: false,
          hovertemplate: '<span style="font-size: 20px">%{label}: %{value:,}人(%{percent})</span>'
        }]
        chartLayout = {title: '労働者が従事する産業の分類', height: 600, showlegend: true, font: {size: 20}}
        Plotly.newPlot('industry-type', data, chartLayout, {displayModeBar: false})
      }
    })
  })
}

/* 説明モーダルを表示する */
function showExplanationModal(modalId) {
  new bootstrap.Modal(document.getElementById(modalId)).show()
}

/* 地図の右下に表示する凡例を作る */
function createLeafletLegend(elemId) {
  const legend = L.control({position: 'bottomright'})
  legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'legend')
    div.setAttribute('id', elemId)
    return div
  }
  return legend
}

function replaceLeafletLegend(colorBy, elemId) {
  const attrConf = attrItems[colorBy]
  const nSplit = 5
  const step = (attrConf.colorRange[1] - attrConf.colorRange[0]) / nSplit
  let legendContent = `${attrConf.jpName}(${attrConf.unit})<br/>`
  for (let i = nSplit; i >= 0; i--) {
    const val = step * i + attrConf.colorRange[0]
    legendContent += `<div class="clearfix"><i style="background:${getColor(val, ...attrConf.colorRange)}"></i>${val}</div>`
  }
  document.getElementById(elemId).innerHTML = legendContent
}

/* ヘッダ領域を常時表示にした場合にコンテンツ描画領域に使える高さを求める */
function getVizAreaHeight() {
  let vizHeight = window.innerHeight - 10
  const headerElems = document.getElementsByClassName('header-area')
  for (let i = 0; i < headerElems.length; i++) {
    vizHeight -= headerElems[i].offsetHeight
  }
  return vizHeight
}

function switchMetricsKey(metricsKey) {
  document.getElementById('key-metrics-selector').innerText = `着目する項目:${attrItems[metricsKey].jpName}`
  drawFeaturesOnMap(cityGeoJson, maps['citySelectorMap'], metricsKey)
  cityRanking(metricsKey, 'desc')
}

window.onload = function() {
  document.getElementById('citySelectorMap').setAttribute('style', `height: ${getVizAreaHeight()}px`)

  initCityModal()
  cityModal.show()
  // loading表示にしてからデータを取りに行く
  const modalDialog = document.getElementById('city-detail-modal-dialog')
  modalDialog.appendChild(createSpinner())

  maps['citySelectorMap'] = initMap('citySelectorMap')
  createLeafletLegend('city-legend').addTo(maps['citySelectorMap'])
  fetchGeojsonAndDraw('./japan_cities.json', 'citySelectorMap')

  // Plotlyはサイズが大きいので読み込みを後回しにする
  document.body.appendChild(createElem('script', '', {src: 'https://cdn.plot.ly/plotly-2.3.1.min.js'}))
}
