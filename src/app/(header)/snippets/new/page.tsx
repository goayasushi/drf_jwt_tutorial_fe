"use client";

import {
  Box,
  Button,
  Fieldset,
  Flex,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Controller, useForm } from "react-hook-form";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { SnippetFormData } from "@/types/snippetFormData";
import axiosClient from "@/lib/axiosClient";

export default function SnippetNew() {
  // formの設定
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<SnippetFormData>({
    defaultValues: {
      code: "",
      language: "",
      linenos: false,
    },
  });

  // form入力値のリアルタイム監視
  const { code, language, linenos } = watch();

  const router = useRouter();
  const queryClient = useQueryClient();

  const fetchCreateSnippet = async (newSnippet: SnippetFormData) => {
    const { data } = await axiosClient.post(`/snippets/`, newSnippet);
    return data;
  };

  const mutation = useMutation({
    mutationFn: fetchCreateSnippet,
    onSuccess: () => {
      // スニペット一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["snippets"] });

      // formリセット
      reset();

      // 一覧画面に遷移
      router.push("/snippets");
    },
  });

  const createSnippet = async (newSnippet: SnippetFormData) => {
    mutation.mutate(newSnippet);
  };

  return (
    <Box p="6">
      <form onSubmit={handleSubmit(createSnippet)}>
        <Flex justify="center" h="100%">
          <Fieldset.Root
            size="lg"
            w="100%"
            p={6}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="md"
            bg="white"
          >
            <Stack>
              <Fieldset.Legend>新規投稿</Fieldset.Legend>
            </Stack>

            <Fieldset.Content>
              <Field invalid={!!errors.title} errorText={errors.title?.message}>
                <Input
                  {...register("title", {
                    required: "タイトルは必須です",
                  })}
                  placeholder="タイトルを入力してください"
                />
              </Field>
              <Field
                w="300px"
                label="言語"
                invalid={!!errors.language}
                errorText={errors.language?.message}
              >
                <NativeSelectRoot>
                  <NativeSelectField
                    {...register("language", {
                      required: "言語は必須です",
                    })}
                    placeholder="言語を選択してください"
                    items={["Python", "Java", "Javascript"]}
                  />
                </NativeSelectRoot>
              </Field>
              <Controller
                name="linenos"
                control={control}
                render={({ field }) => (
                  <Field>
                    <Switch
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={({ checked }) => field.onChange(checked)}
                      inputProps={{ onBlur: field.onBlur }}
                    >
                      行数の表示
                    </Switch>
                  </Field>
                )}
              />

              <Field
                label="本文"
                invalid={!!errors.code}
                errorText={errors.code?.message}
              >
                <Flex w="100%" h="calc(100vh - 500px)">
                  <Textarea
                    flex="1"
                    h="100%"
                    p="20px"
                    resize="none"
                    placeholder="スニペットを書いて投稿しよう"
                    {...register("code", {
                      required: "スペニットの記載は必須です",
                    })}
                  />
                  <Box flex="1" h="100%">
                    <SyntaxHighlighter
                      language={language}
                      style={dracula}
                      showLineNumbers={linenos}
                      customStyle={{
                        height: "100%",
                        padding: "20px",
                        borderRadius: "4px",
                      }}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </Box>
                </Flex>
              </Field>
            </Fieldset.Content>
            <Button type="submit" alignSelf="flex-start">
              投稿
            </Button>
            {mutation.isError ? (
              <Text>エラーが発生しました: {mutation.error.message}</Text>
            ) : null}
          </Fieldset.Root>
        </Flex>
      </form>
    </Box>
  );
}
