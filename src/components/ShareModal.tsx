import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createSharedLink,
  getExistingSharedToken,
} from "@/services/sharedList.service";

type ShareModalProps = {
  listId: string;
  open: boolean;
  onClose: () => void;
};

export default function ShareModal({ listId, open, onClose }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (open) {
      getExistingSharedToken(listId).then((token) => {
        if (token) {
          setShareUrl(`${window.location.origin}/share/${token}`);
        } else {
          createSharedLink(listId).then((newToken) => {
            if (newToken) {
              const url = `${window.location.origin}/share/${newToken}`;
              setShareUrl(url);
            }
          });
        }
      });
    }
  }, [open, listId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this list</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            value={shareUrl}
            readOnly
            onClick={(e) => e.currentTarget.select()}
          />
          <Button
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
            }}
          >
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
