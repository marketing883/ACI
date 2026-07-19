// Route-level loading state. Without this file, a navigation to any
// page that needs a fresh server render leaves the old page frozen on
// screen with zero feedback until the RSC payload arrives. With it,
// the click paints immediately: a thin indeterminate bar under the
// nav, on white, matching the v4 kit.
export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden">
        <div
          className="h-full w-2/5 bg-blue-700"
          style={{ animation: 'route-loading-slide 1s ease-in-out infinite' }}
        />
      </div>
      <style>{`
        @keyframes route-loading-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
