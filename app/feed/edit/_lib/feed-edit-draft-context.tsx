'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type FeedEditDraftImage = {
  id: string;
  blob: Blob;
  previewUrl: string;
};

function revokeBlobUrl(url: string | null | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

type DraftContextValue = {
  images: FeedEditDraftImage[];
  setImages: (
    next: FeedEditDraftImage[] | ((prev: FeedEditDraftImage[]) => FeedEditDraftImage[]),
  ) => void;
  clearDraft: () => void;
};

const FeedEditDraftContext = createContext<DraftContextValue | null>(null);

export function FeedEditDraftProvider({ children }: { children: ReactNode }) {
  const [images, setImagesState] = useState<FeedEditDraftImage[]>([]);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const setImages = useCallback(
    (next: FeedEditDraftImage[] | ((prev: FeedEditDraftImage[]) => FeedEditDraftImage[])) => {
      setImagesState((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        const nextIds = new Set(resolved.map((i) => i.id));
        for (const img of prev) {
          if (!nextIds.has(img.id)) {
            revokeBlobUrl(img.previewUrl);
          }
        }
        return resolved;
      });
    },
    [],
  );

  const clearDraft = useCallback(() => {
    setImagesState((prev) => {
      for (const img of prev) {
        revokeBlobUrl(img.previewUrl);
      }
      return [];
    });
  }, []);

  useEffect(() => {
    return () => {
      for (const img of imagesRef.current) {
        revokeBlobUrl(img.previewUrl);
      }
    };
  }, []);

  const value = useMemo<DraftContextValue>(
    () => ({ images, setImages, clearDraft }),
    [images, setImages, clearDraft],
  );

  return <FeedEditDraftContext.Provider value={value}>{children}</FeedEditDraftContext.Provider>;
}

export function useFeedEditDraft(): DraftContextValue {
  const ctx = useContext(FeedEditDraftContext);
  if (!ctx) {
    throw new Error('useFeedEditDraft must be used within FeedEditDraftProvider');
  }
  return ctx;
}
