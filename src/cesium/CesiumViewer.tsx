import { useEffect, useRef, useState } from 'react'
import { Viewer, Ion, createWorldTerrainAsync, ClockRange, JulianDate } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { Color, Entity } from 'cesium'
import { SatelliteLoader } from './utils/SatelliteLoader'

export const CesiumViewer = () => {
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const viewerRefCesium = useRef<Viewer | null>(null)
  const satelliteRef = useRef<Entity | null>(null)
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<string | null>(null)

  const simulationDurationSeconds = 86400 // 1 hour of orbit simulation

  const handleCenterSatellite = (id: string) => {
    const viewer = viewerRefCesium.current
    if (viewer) {
      const entity = viewer.entities.getById(id)
      if (entity) {
        viewer.trackedEntity = entity
        setSelectedSatelliteId(id)
      }
    }
  }

  useEffect(() => {
    const initViewer = async () => {
      if (!viewerRef.current) return

      Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN

      const viewer = new Viewer(viewerRef.current, {
        terrainProvider: await createWorldTerrainAsync(),
      })

      viewerRefCesium.current = viewer

      const start = JulianDate.now()
      const stop = JulianDate.addSeconds(start, simulationDurationSeconds, new JulianDate())

      // Set clock parameters
      viewer.clock.startTime = start.clone()
      viewer.clock.stopTime = stop.clone()
      viewer.clock.currentTime = start.clone()
      viewer.clock.clockRange = ClockRange.LOOP_STOP
      viewer.clock.multiplier = 50 // control orbit speed

      viewer.timeline.zoomTo(start, stop)
      viewer.clock.shouldAnimate = true

      const loader = new SatelliteLoader(viewer, start, simulationDurationSeconds)
      const satellites = await loader.loadAllSatellites()

      if (satellites.length > 0) {
        viewer.trackedEntity = satellites[0]
        satelliteRef.current = satellites[0]
      }

      return () => viewer.destroy()
    }

    initViewer()
  }, [])

  return (
    <>
      {/* UI for selecting satellites can go here if needed later */}
      <div ref={viewerRef} style={{ height: '100vh', width: '100%' }} />
    </>
  )
}