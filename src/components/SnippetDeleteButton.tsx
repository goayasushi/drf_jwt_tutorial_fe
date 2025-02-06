import { IconButton, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuArchive } from "react-icons/lu";
import axiosClient from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const SnippetDeleteButton = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const fetchDeleteSnippet = async () => {
    await axiosClient.delete(`/snippets/${id}/`);
  };

  const deleteSnippet = useMutation({
    mutationFn: fetchDeleteSnippet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      router.push("/snippets");
    },
  });

  return (
    <DialogRoot role="alertdialog">
      <DialogTrigger asChild>
        <IconButton aria-label="delete button" variant="ghost" size="sm">
          <LuArchive />
          <Text>削除する</Text>
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>スニペットを削除する</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>本当に削除してもよろしいですか？この操作は元に戻せません。</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogActionTrigger>
          <Button
            colorPalette="red"
            onClick={() => deleteSnippet.mutate()}
            loading={deleteSnippet.isPending}
          >
            削除
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
