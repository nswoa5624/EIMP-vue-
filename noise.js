window.EIMPTopic.initTopicPage({
  "caseLists": [
    {
      "containerId": "airCasesContainer",
      "columns": [
        {
          "key": "time"
        },
        {
          "key": "status"
        },
        {
          "key": "address",
          "address": true
        }
      ],
      "items": [
        {
          "id": "N-C001",
          "time": "12/02 15:22",
          "status": "案件接收",
          "address": "新北市板橋區OO路",
          "lat": 25.0132,
          "lng": 121.4637
        },
        {
          "id": "N-C002",
          "time": "12/02 12:48",
          "status": "稽查中",
          "address": "新北市新莊區XX路",
          "lat": 25.0362,
          "lng": 121.4549
        },
        {
          "id": "N-C003",
          "time": "12/01 22:10",
          "status": "改善追蹤",
          "address": "新北市永和區OO街",
          "lat": 25.0105,
          "lng": 121.514
        }
      ]
    },
    {
      "containerId": "fireCasesContainer",
      "columns": [
        {
          "key": "time"
        },
        {
          "key": "type"
        },
        {
          "key": "address",
          "address": true
        }
      ],
      "items": [
        {
          "id": "N-O001",
          "time": "12/02 13:20",
          "type": "異味",
          "address": "新北市中和區XX路",
          "lat": 24.9998,
          "lng": 121.4932
        },
        {
          "id": "N-O002",
          "time": "12/01 20:40",
          "type": "油煙",
          "address": "新北市三重區OO路",
          "lat": 25.0615,
          "lng": 121.4881
        }
      ]
    }
  ],
  "layers": [
    {
      "key": "airPollution",
      "label": "噪音陳情",
      "icon": "images/民眾陳情.png",
      "items": [
        {
          "id": "N-C001",
          "time": "12/02 15:22",
          "status": "案件接收",
          "address": "新北市板橋區OO路",
          "lat": 25.0132,
          "lng": 121.4637
        },
        {
          "id": "N-C002",
          "time": "12/02 12:48",
          "status": "稽查中",
          "address": "新北市新莊區XX路",
          "lat": 25.0362,
          "lng": 121.4549
        },
        {
          "id": "N-C003",
          "time": "12/01 22:10",
          "status": "改善追蹤",
          "address": "新北市永和區OO街",
          "lat": 25.0105,
          "lng": 121.514
        }
      ],
      "popupFields": [
        {
          "label": "時間",
          "key": "time"
        },
        {
          "label": "狀態",
          "key": "status"
        },
        {
          "label": "地址",
          "key": "address"
        }
      ]
    },
    {
      "key": "fireReport",
      "label": "異味案件",
      "icon": "images/marker.png",
      "items": [
        {
          "id": "N-O001",
          "time": "12/02 13:20",
          "type": "異味",
          "address": "新北市中和區XX路",
          "lat": 24.9998,
          "lng": 121.4932
        },
        {
          "id": "N-O002",
          "time": "12/01 20:40",
          "type": "油煙",
          "address": "新北市三重區OO路",
          "lat": 25.0615,
          "lng": 121.4881
        }
      ],
      "popupFields": [
        {
          "label": "時間",
          "key": "time"
        },
        {
          "label": "類型",
          "key": "type"
        },
        {
          "label": "地址",
          "key": "address"
        }
      ]
    },
    {
      "key": "nonRegBusiness",
      "label": "非列管事業",
      "icon": "images/工廠許可.png",
      "items": window.EIMPSharedBusinessData.nonRegBusinessCases,
      "popupFields": [
        { "label": "名稱", "key": "businessName" },
        { "label": "管制編號", "key": "controlNo" },
        { "label": "行業別", "key": "industryName" },
        { "label": "地址", "key": "address" }
      ]
    },
    {
      "key": "regBusiness",
      "label": "列管事業",
      "icon": "images/工廠許可(列管).png",
      "items": window.EIMPSharedBusinessData.regBusinessCases,
      "popupFields": [
        { "label": "名稱", "key": "businessName" },
        { "label": "管制編號", "key": "controlNo" },
        { "label": "事業類型", "key": "industryName" },
        { "label": "列管類別", "key": "regulatedType" },
        { "label": "地址", "key": "address" }
      ]
    }
  ],
  "metricCards": {
    "windDirection": {
      "key": "db"
    },
    "windSpeed": {
      "key": "max"
    }
  },
  "stationData": {
    "三重": {
      "db": "62",
      "max": "78"
    },
    "汐止": {
      "db": "58",
      "max": "72"
    },
    "新店": {
      "db": "55",
      "max": "69"
    },
    "土城": {
      "db": "61",
      "max": "74"
    },
    "板橋": {
      "db": "64",
      "max": "80"
    },
    "新莊": {
      "db": "60",
      "max": "75"
    }
  },
  "defaultStationData": {
    "db": "62",
    "max": "78"
  }
});
