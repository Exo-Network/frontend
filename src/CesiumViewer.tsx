import { useEffect, useRef, useState } from 'react'
import { Viewer, Ion, createWorldTerrainAsync, IonResource } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { Cartesian3, JulianDate, SampledPositionProperty, Entity, Color , Math as CesiumMath } from 'cesium'
import * as Cesium from 'cesium'

export const CesiumViewer = () => {
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const viewerRefCesium = useRef<Viewer | null>(null)
  const satelliteRef = useRef<Entity | null>(null)
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<string | null>(null)

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

      Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZmJhZTE5OS1iODAzLTQ3MDUtODVjMS0wYzg2Nzc2Y2E3YTciLCJpZCI6MjkyOTY0LCJpYXQiOjE3NDQzMjAzMzR9.aZAsm9cFT87q_P1rPAo3yGSdyhNes671WT4qwOF-60U'

      const viewer = new Viewer(viewerRef.current, {
        terrainProvider: await createWorldTerrainAsync(),
      })

      viewerRefCesium.current = viewer

      const start = JulianDate.now()
      const position = new SampledPositionProperty()

      const totalOrbits = 10
      const degreesPerOrbit = 360
      const step = 1
      
      for (let orbit = 0; orbit < totalOrbits; orbit++) {
        for (let i = 0; i <= degreesPerOrbit; i += step) {
          const time = JulianDate.addSeconds(start, i + orbit * degreesPerOrbit, new JulianDate())
          const radians = CesiumMath.toRadians(i)
          const x = 7000000 * Math.cos(radians)
          const y = 7000000 * Math.sin(radians)
          const z = 0
      
          const pos = Cartesian3.fromElements(x, y, z)
          position.addSample(time, pos)
        }
      }

      viewer.clock.shouldAnimate = true
      const resource = await IonResource.fromAssetId(3294289);

      const satellite = viewer.entities.add({
        id: 'orbiting-satellite',
        position,
        path: {
          resolution: 1,
          material: Color.YELLOW,
          width: 2,
          leadTime: 0,
          trailTime: 359,
        },
        model: {
            uri: resource,
            scale: 1000,
          }
      })

      satelliteRef.current = satellite
      viewer.trackedEntity = satellite

      const position2 = new SampledPositionProperty()
      for (let orbit = 0; orbit < totalOrbits; orbit++) {
        for (let i = 0; i <= degreesPerOrbit; i += step) {
          const time = JulianDate.addSeconds(start, i + orbit * degreesPerOrbit, new JulianDate())
          const radians = CesiumMath.toRadians(i + 180) // phase shift
          const x = 7000000 * Math.cos(radians)
          const y = 7000000 * Math.sin(radians)
          const z = 0

          const pos = Cartesian3.fromElements(x, y, z)
          position2.addSample(time, pos)
        }
      }

      const resource2 = await IonResource.fromAssetId(3294289)

      const satellite2 = viewer.entities.add({
        id: 'orbiting-satellite-2',
        position: position2,
        path: {
          resolution: 1,
          material: Color.RED,
          width: 2,
          leadTime: 0,
          trailTime: 359,
        },
        model: {
          uri: resource2,
          scale: 1000,
        },
      })

      return () => viewer.destroy()
    }

    initViewer()
  }, [])

  return (
    <>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2, background: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 5 }}>
        <strong style={{ color: 'white' }}>Satellites</strong>
        <button onClick={() => handleCenterSatellite('orbiting-satellite')} style={{
          display: 'block',
          marginTop: 5,
          padding: '5px 10px',
          cursor: 'pointer',
          background: selectedSatelliteId === 'orbiting-satellite' ? '#444' : '#666',
          color: 'white',
          border: '1px solid #ccc',
          borderRadius: '3px'
        }}>
          Track Satellite 1
        </button>
        <button onClick={() => handleCenterSatellite('orbiting-satellite-2')} style={{
          display: 'block',
          marginTop: 5,
          padding: '5px 10px',
          cursor: 'pointer',
          background: selectedSatelliteId === 'orbiting-satellite-2' ? '#444' : '#666',
          color: 'white',
          border: '1px solid #ccc',
          borderRadius: '3px'
        }}>
          Track Satellite 2
        </button>
      </div>
      <div ref={viewerRef} style={{ height: '100vh', width: '100%' }} />
    </>
  )
}