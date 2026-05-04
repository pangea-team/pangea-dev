type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserFeedPage({ params }: Props) {
  const { userId } = await params;
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-xl font-medium text-zinc-900">User feed</h1>
      <p className="mt-2 text-sm text-zinc-500">userId: {userId} (스캐폴드)</p>
    </div>
  );
}
