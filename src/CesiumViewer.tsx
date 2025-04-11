import { useEffect, useRef } from 'react'
import { Viewer, Ion, createWorldTerrainAsync, IonResource } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { Cartesian3, JulianDate, SampledPositionProperty, Entity, Color , Math as CesiumMath } from 'cesium'

export const CesiumViewer = () => {
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const satelliteRef = useRef<Entity | null>(null)

  const handleCenterSatellite = () => {
    if (viewerRef.current && satelliteRef.current) {
      const viewer = (Cesium as any).Viewer?.instances?.[0]
      if (viewer) {
        viewer.trackedEntity = satelliteRef.current
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

      const start = JulianDate.now()
      const position = new SampledPositionProperty()

      const totalOrbits = 10
      const degreesPerOrbit = 360
      const step = 10
      
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
          resolution: 60,
          material: Color.YELLOW,
          width: 2,
          leadTime: 0,
          trailTime: 360,
        },
        model: {
            uri: resource,
            scale: 500,
          }
      })

      satelliteRef.current = satellite
      viewer.trackedEntity = satellite

      return () => viewer.destroy()
    }

    initViewer()
  }, [])

  return (
    <>
      <button onClick={handleCenterSatellite} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
        Center on Satellite
      </button>
      <div ref={viewerRef} style={{ height: '100vh', width: '100%' }} />
    </>
  )
}