"use client";

import {
  Badge,
  Box,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { LuPencilLine } from "react-icons/lu";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { useUser } from "@/context/UserContext";
import { useFetchSnippetById } from "@/hooks/useFetchSnippetById";

export default function SnippetDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();

  const {
    data: snippet,
    isLoading,
    isError,
    error,
  } = useFetchSnippetById(String(id));

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
        <>
          {user?.username === snippet.owner && (
            <HStack px="6">
              <IconButton
                aria-label="edit button"
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/snippets/${id}/edit`)}
              >
                <LuPencilLine />
                <Text>編集する</Text>
              </IconButton>
            </HStack>
          )}
          <Box p="6">
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
            <Box py="6">
              <SyntaxHighlighter
                language={snippet.language}
                style={dracula}
                showLineNumbers={snippet.linenos}
                customStyle={{ padding: "20px", borderRadius: "8px" }}
              >
                {snippet.code}
              </SyntaxHighlighter>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
