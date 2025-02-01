"use client";

import { Box, Flex, IconButton, Spinner, Table, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuTextSearch, LuArchive, LuPencilLine } from "react-icons/lu";

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
        <Table.Root size="sm" showColumnBorder variant="outline">
          <Table.ColumnGroup>
            <Table.Column htmlWidth="10%" />
            <Table.Column htmlWidth="50%" />
            <Table.Column htmlWidth="20%" />
            <Table.Column />
          </Table.ColumnGroup>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>タイトル</Table.ColumnHeader>
              <Table.ColumnHeader>作成者</Table.ColumnHeader>
              <Table.ColumnHeader>アクション</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {snippets?.results.map((snippet) => (
              <Table.Row key={snippet.url}>
                <Table.Cell>{snippet.id}</Table.Cell>
                <Table.Cell>{snippet.title}</Table.Cell>
                <Table.Cell>{snippet.owner}</Table.Cell>
                <Table.Cell>
                  <IconButton
                    aria-label="detail button"
                    variant="ghost"
                    size="sm"
                    mr={2}
                  >
                    <LuTextSearch />
                  </IconButton>
                  <IconButton
                    aria-label="edit button"
                    variant="ghost"
                    size="sm"
                    mr={2}
                  >
                    <LuPencilLine />
                  </IconButton>
                  <IconButton
                    aria-label="detail button"
                    variant="ghost"
                    size="sm"
                  >
                    <LuArchive />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}
