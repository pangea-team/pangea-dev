import { redirect } from 'next/navigation';
import { PATH } from '@/constants/path';
import { getUser } from '@/lib/supabase/auth';
import SavedSentenceCard from './_components/SavedSentenceCard';
import { getSavedSentences } from './_lib/get-saved-sentences';

export default async function CartPage() {
  const claims = await getUser();
  if (!claims) redirect(PATH.LOGIN);

  const rows = await getSavedSentences(claims.sub);

  return (
    <div className="mx-auto w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl px-content-x py-content-y">
      <h1 className="mb-2 md:mb-3 lg:mb-4 text-noto-title-2 text-primary">담아둔 것들</h1>
      <h2 className="mb-section-sm text-noto-body-1">
        당신이 머문 문장과 그 곁의 생각들이 담겨 있습니다.
      </h2>

      {rows.length === 0 ? (
        <p className="text-pretendard-body-2 text-purple3">아직 담아둔 것이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-comp-sm">
          {rows.map((row) => (
            <li key={row.id}>
              <SavedSentenceCard row={row} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
