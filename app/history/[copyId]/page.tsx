type Props = {
  params: Promise<{ copyId: string }>;
};

export default async function HistoryPage({ params }: Props) {
  const { copyId } = await params;
  return (
    <div className="mx-auto max-w-layout-form px-page-x py-section-sm">
      <h1 className="text-xl font-medium text-zinc-900">Our history</h1>
      <p className="mt-2 text-sm text-zinc-500">copyId: {copyId} (스캐폴드)</p>
    </div>
  );
}
