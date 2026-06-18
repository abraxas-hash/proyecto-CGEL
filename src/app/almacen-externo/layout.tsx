export default function AlmacenExternoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#0e1117] text-[#e2e8f0]">
      <div className="w-full max-w-xl p-4 md:p-6 lg:p-8 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
