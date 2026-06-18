export default function AlmacenExternoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-slate-50 dark:bg-[#0e1117] text-slate-900 dark:text-[#e2e8f0] custom-scrollbar">
      <div className="w-full max-w-xl px-4 py-6 md:p-6 lg:p-8 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
