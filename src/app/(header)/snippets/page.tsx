"use client";

import {
  Badge,
  Box,
  Card,
  Flex,
  HStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/lib/axiosClient";
import { Snippet } from "@/types/snippet";
import { PaginatedResponse } from "@/types/paginatedResponse";

const fetchSnippets = async (): Promise<PaginatedResponse<Snippet>> => {
  const { data } = await axiosClient.get<PaginatedResponse<Snippet>>(
    "/snippets/"
  );
  return data;
};

export default function Snippets() {
  const {
    data: snippets,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["snippets"], queryFn: fetchSnippets });

  return (
    <Box p="6">
      <Text fontSize="md" mb="4" fontWeight="bold">
        snippet一覧
      </Text>

      {isLoading && (
        <Flex align="center" justify="center" height="60px">
          <Spinner size="sm" />
        </Flex>
      )}

      {isError && (
        <Text color="red.500">エラーが発生しました: {error.message}</Text>
      )}

      {!isLoading && !isError && (
        <Box p="4">
          {snippets?.results.map((snippet) => (
            <Card.Root m="4" key={snippet.url}>
              <Card.Body>
                <HStack mb="2" gap="3">
                  <Avatar name={snippet.owner} />
                  <Text fontWeight="medium" textStyle="sm">
                    {snippet.owner}
                  </Text>
                </HStack>
                <Card.Title mt="2">{snippet.title}</Card.Title>
                <HStack mt="2">
                  <Badge>{snippet.language}</Badge>
                </HStack>
              </Card.Body>
            </Card.Root>
          ))}
        </Box>
      )}
    </Box>
  );
}
