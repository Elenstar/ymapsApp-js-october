export default class InteractiveMap {
    constructor(mapId, onClick) {
      this.mapId = mapId
      this.onClick = onClick
    }  
    async init() {
      await this.injectYMapsScript()
      await this.loadYMaps()
      this.initMap()
    }
  
    injectYMapsScript() {
      return new Promise((resolve) => {
        const ymapsScript = document.createElement('script')
        ymapsScript.src =
          'https://api-maps.yandex.ru/2.1/?apikey=db4affc6-0a59-4dd2-9d19-201b7f7d0b34&lang=ru_RU'
        document.body.append(ymapsScript)
        ymapsScript.addEventListener('load', resolve)
      })
    }
  
    loadYMaps() {
      return new Promise((resolve) => ymaps.ready(resolve))
    }
  
    initMap() {
      this.clusterer = new ymaps.Clusterer({
        groupByCoordinates: true,
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: false,
      })

      this.clusterer.events.add('click', (e) => {
        const coords = e.get('target').geometry.getCoordinates()
        this.onClick(coords)
      })

      this.map = new ymaps.Map(this.mapId, {
        center: [52.723, 41.457],
        zoom: 15,
        controls: ['zoomControl']
      })

      this.map.events.add('click', (e) => this.onClick(e.get('coords')))
      this.map.geoObjects.add(this.clusterer)
    }

    openBalloon(coords, content) {
        this.map.balloon.open(coords, content)
    }
    
    setBalloonContent(content) {
        this.map.balloon.setData(content)
    }
    
    closeBalloon() {
        this.map.balloon.close()
    }

    createPlacemark(coords) {
        const placemark = new ymaps.Placemark(coords)
        placemark.events.add('click', (e) => {
          const coords = e.get('target').geometry.getCoordinates()
          this.onClick(coords)
        })
        this.clusterer.add(placemark)
      }
  }