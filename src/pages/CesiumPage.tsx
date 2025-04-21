import { CesiumViewer } from '../cesium/CesiumViewer'

export const CesiumPage = () => {

  
  return (
    <div style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
      <CesiumViewer />
    </div>
  );
}