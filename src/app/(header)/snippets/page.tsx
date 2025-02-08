"use client";

import {
  Badge,
  Box,
  Card,
  Flex,
  HStack,
  Spinner,
  Text,
  Link,
} from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

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
  const router = useRouter();

  const {
    data: snippets,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["snippets"], queryFn: fetchSnippets });

  const handleNavigate = (id: string) => {
    router.push(`/snippets/${id}`);
  };

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

      {!isLoading && !isError && (
        <Box p="4">
          {snippets?.results.map((snippet) => (
            <Card.Root
              key={snippet.url}
              m="4"
              cursor="pointer"
              onClick={() => handleNavigate(snippet.id)}
            >
              <Card.Body>
                <HStack mb="2" gap="3">
                  <Avatar name={snippet.owner} />
                  <Text fontWeight="medium" textStyle="sm">
                    {snippet.owner}
                  </Text>
                </HStack>
                <Card.Title mt="2" onClick={() => handleNavigate(snippet.id)}>
                  <Link as={NextLink} href={`/snippets/${snippet.id}`}>
                    {snippet.title}
                  </Link>
                </Card.Title>
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
