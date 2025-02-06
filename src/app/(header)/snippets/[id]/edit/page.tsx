"use client";

import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { SnippetFormData } from "@/types/snippetFormData";
import axiosClient from "@/lib/axiosClient";
import { SnippetForm } from "@/components/SnippetForm";
import { useFetchSnippetById } from "@/hooks/useFetchSnippetById";

export default function SnippetEdit() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: snippet,
    isLoading,
    isError,
    error,
  } = useFetchSnippetById(String(id));

  // snippet編集のフェッチ処理
  const fetchEditSnippet = async (editedSnippet: SnippetFormData) => {
    const { data } = await axiosClient.put(`/snippets/${id}/`, editedSnippet);
    return data;
  };

  const editSnippet = useMutation({
    mutationFn: fetchEditSnippet,
    onSuccess: () => {
      // スニペット一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["snippets"] });

      router.push("/snippets");
    },
  });

  return (
    <Box p="6">
      {isLoading && (
        <Flex align="center" justify="center" height="60px">
          <Spinner size="sm" />
        </Flex>
      )}

      {isError && (
        <Text color="red.500">エラーが発生しました: {error.message}</Text>
      )}

      {!isLoading && !snippet && (
        <Text color="red.500">スニペットが見つかりませんでした</Text>
      )}

      {!isLoading && !isError && snippet && (
        <SnippetForm
          initialData={snippet}
          onSubmitFn={(editedSnippet) => editSnippet.mutate(editedSnippet)}
          isSubmitting={editSnippet.isPending}
        />
      )}
    </Box>
  );
}
