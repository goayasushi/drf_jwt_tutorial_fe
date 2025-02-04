"use client";

import { Badge, Box, Flex, HStack, Spinner, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Snippet } from "@/types/snippet";
import axiosClient from "@/lib/axiosClient";

const fetchSnippetById = async (id: string): Promise<Snippet> => {
  const { data } = await axiosClient.get<Snippet>(`/snippets/${id}/`);
  return data;
};

export default function SnippetDetail() {
  const { id } = useParams();

  const {
    data: snippet,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["snippet", id],
    queryFn: () => fetchSnippetById(id as string),
    enabled: !!id,
  });

  return (
    <Box p="6">
      <Text fontSize="md" mb="4" fontWeight="bold">
        snippet詳細画面
      </Text>
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
        <Box p="4">
          <HStack mb="2" gap="3">
            <Avatar name={snippet.owner} />
            <Text fontWeight="medium" textStyle="sm">
              {snippet.owner}
            </Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold">
            {snippet.title}
          </Text>
          <HStack mt="2">
            <Badge>{snippet.language}</Badge>
          </HStack>
          <Text mt="4" fontSize="md" whiteSpace="pre-wrap">
            {snippet.code}
          </Text>
        </Box>
      )}
    </Box>
  );
}
