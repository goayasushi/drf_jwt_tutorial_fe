"use client";

import { Box, Fieldset, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Controller, useForm } from "react-hook-form";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { SnippetFormData } from "@/types/snippetFormData";
import { LANGUAGES_HLJS } from "@/config/availabe_languages_hljs";

type SnippetFormProps = {
  initialData?: SnippetFormData;
  onSubmitFn: (data: SnippetFormData) => void;
  isSubmitting: boolean;
};

export const SnippetForm = (props: SnippetFormProps) => {
  const { initialData, onSubmitFn, isSubmitting } = props;

  // formの設定
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SnippetFormData>({
    defaultValues: initialData || {
      title: "",
      code: "",
      language: "",
      linenos: false,
    },
  });

  // form入力値のリアルタイム監視
  const { code, language, linenos } = watch();

  return (
    <Box p="6">
      <form onSubmit={handleSubmit(onSubmitFn)}>
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
                    items={LANGUAGES_HLJS}
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
            <Button loading={isSubmitting} type="submit" alignSelf="flex-start">
              投稿
            </Button>
          </Fieldset.Root>
        </Flex>
      </form>
    </Box>
  );
};
