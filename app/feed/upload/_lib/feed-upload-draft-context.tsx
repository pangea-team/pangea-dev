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

export type FeedUploadDraftImage = {
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
  images: FeedUploadDraftImage[];
  setImages: (
    next: FeedUploadDraftImage[] | ((prev: FeedUploadDraftImage[]) => FeedUploadDraftImage[]),
  ) => void;
  clearDraft: () => void;
};

const FeedUploadDraftContext = createContext<DraftContextValue | null>(null);

export function FeedUploadDraftProvider({ children }: { children: ReactNode }) {
  const [images, setImagesState] = useState<FeedUploadDraftImage[]>([]);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const setImages = useCallback(
    (next: FeedUploadDraftImage[] | ((prev: FeedUploadDraftImage[]) => FeedUploadDraftImage[])) => {
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

  return (
    <FeedUploadDraftContext.Provider value={value}>{children}</FeedUploadDraftContext.Provider>
  );
}

export function useFeedUploadDraft(): DraftContextValue {
  const ctx = useContext(FeedUploadDraftContext);
  if (!ctx) {
    throw new Error('useFeedUploadDraft must be used within FeedUploadDraftProvider');
  }
  return ctx;
}
