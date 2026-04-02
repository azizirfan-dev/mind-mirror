export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#F7F5F2]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#D6C7B2] border-t-[#7D8F82] rounded-full animate-spin" />
        <p className="text-xs text-[#2C2723]/40 font-mono tracking-widest uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}
