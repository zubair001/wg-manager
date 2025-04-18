import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TEXT } from "@/lib/constants";
import NewListForm from "./NewListForm";

type Props = {
  onCreate?: () => void;
};

export default function NewListModal({ onCreate }: Props) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onCreate?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ New List</Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-100">
        <DialogHeader>
          <DialogTitle>{TEXT.newListModalTitle}</DialogTitle>
        </DialogHeader>
        <NewListForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
