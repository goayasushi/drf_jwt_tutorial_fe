"use client";

import { Box } from "@chakra-ui/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { SnippetFormData } from "@/types/snippetFormData";
import axiosClient from "@/lib/axiosClient";
import { SnippetForm } from "@/components/SnippetForm";

export default function SnippetNew() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const fetchCreateSnippet = async (newSnippet: SnippetFormData) => {
    const { data } = await axiosClient.post(`/snippets/`, newSnippet);
    return data;
  };

  const createSnippet = useMutation({
    mutationFn: fetchCreateSnippet,
    onSuccess: () => {
      // スニペット一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["snippets"] });

      router.push("/snippets");
    },
  });

  return (
    <Box p="6">
      <SnippetForm
        onSubmitFn={(newSnippet) => createSnippet.mutate(newSnippet)}
        isSubmitting={createSnippet.isPending}
      />
    </Box>
  );
}
