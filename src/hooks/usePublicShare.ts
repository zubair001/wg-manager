import { useCallback, useEffect, useState } from "react";
import {
  getExistingSharedToken,
  disablePublicShare,
  createSharedLink,
} from "@/services/sharedList.service";
import { toast } from "sonner";

export function usePublicShare(listId: string, onAfterToggle?: () => void) {
  const [isShared, setIsShared] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkShareStatus = async () => {
      const token = await getExistingSharedToken(listId);
      if (token) {
        setIsShared(true);
        setShareUrl(`${window.location.origin}/share/${token}`);
      } else {
        setIsShared(false);
        setShareUrl(null);
      }
    };

    if (listId) {
      checkShareStatus();
    }
  }, [listId]);

  const handleShare = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation?.();

      if (isShared) {
        const success = await disablePublicShare(listId);
        if (success) {
          setIsShared(false);
          setShareUrl(null);
          onAfterToggle?.();
        }
      } else {
        const token = await createSharedLink(listId);
        if (token) {
          const url = `${window.location.origin}/share/${token}`;
          navigator.clipboard.writeText(url);
          toast.success("Share link copied to clipboard!");
          setIsShared(true);
          setShareUrl(url);
          onAfterToggle?.();
        }
      }
    },
    [listId, isShared, onAfterToggle]
  );

  return { isShared, handleShare, shareUrl };
}
