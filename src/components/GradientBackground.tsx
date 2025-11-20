interface GradientBackgroundProps {
  darkMode?: boolean;
}

export default function GradientBackground({ darkMode = false }: GradientBackgroundProps) {
  const gradientColor = darkMode ? 'hsla(239, 50%, 28%, 0.8)' : '#9E89FF';
  const gradientColor2 = darkMode ? 'hsla(239, 50%, 28%, 0.8)' : '#68A1F2';

  return (
    <>
      <div
        className="fixed top-[5%] left-[10%] w-[700px] h-[700px] rounded-full opacity-[0.45] blur-[100px] pointer-events-none z-0"
        style={{ 
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 70%)`,
          animation: 'float1 20s ease-in-out infinite'
        }}
      />
      <div 
        className="fixed top-[50%] right-[5%] w-[800px] h-[800px] rounded-full opacity-[0.45] blur-[100px] pointer-events-none z-0"
        style={{ 
          background: `radial-gradient(circle, ${gradientColor2} 0%, transparent 70%)`,
          animation: 'float2 25s ease-in-out infinite'
        }}
      />
      <div 
        className="fixed bottom-[10%] left-[15%] w-[650px] h-[650px] rounded-full opacity-[0.45] blur-[100px] pointer-events-none z-0"
        style={{ 
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 70%)`,
          animation: 'float3 22s ease-in-out infinite'
        }}
      />
      <div 
        className="fixed top-[25%] right-[20%] w-[750px] h-[750px] rounded-full opacity-[0.45] blur-[100px] pointer-events-none z-0"
        style={{ 
          background: `radial-gradient(circle, ${gradientColor2} 0%, transparent 70%)`,
          animation: 'float4 28s ease-in-out infinite'
        }}
      />
      
      {/* 가장자리 작은 원들 */}
      <div 
        className="fixed top-[40%] -left-[100px] w-[400px] h-[400px] rounded-full opacity-[0.35] blur-[80px] pointer-events-none will-change-transform z-0"
        style={{ 
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 70%)`,
          animation: 'float1 18s ease-in-out infinite'
        }}
      />
      <div 
        className="fixed top-[35%] -right-[120px] w-[450px] h-[450px] rounded-full opacity-[0.35] blur-[80px] pointer-events-none will-change-transform z-0"
        style={{ 
          background: `radial-gradient(circle, ${gradientColor2} 0%, transparent 70%)`,
          animation: 'float2 23s ease-in-out infinite'
        }}
      />
    </>
  );
}