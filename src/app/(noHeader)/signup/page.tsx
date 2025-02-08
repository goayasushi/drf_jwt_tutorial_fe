"use client";

import { Fieldset, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import axiosClient from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

export default function Signup() {
  const router = useRouter();

  // form
  type SignupFormValues = {
    username: string;
    password: string;
    last_name: string;
    first_name: string;
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const fetchCreateUser = async (signupData: SignupFormValues) => {
    const { data } = await axiosClient.post(`/account/register/`, signupData);
    return data;
  };

  const createUser = useMutation({
    mutationFn: fetchCreateUser,
    onSuccess: () => {
      router.push("/login");
    },
  });

  const onSubmit = (signupData: SignupFormValues) => {
    createUser.mutate(signupData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex minH="100vh" align="center" justify="center" bg="gray.50">
        <Fieldset.Root
          size="lg"
          maxW="md"
          p={6}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="md"
          bg="white"
        >
          <Stack>
            <Fieldset.Legend>新規登録</Fieldset.Legend>
          </Stack>

          {createUser.isError && (
            <Text color="red.500" fontSize="sm">
              エラーが発生しました
            </Text>
          )}

          <Fieldset.Content>
            <Field
              label="ユーザー名"
              invalid={!!errors.username}
              errorText={errors.username?.message}
            >
              <Input
                {...register("username", {
                  required: "ユーザー名は必須です",
                })}
                placeholder="ユーザー名を入力"
              />
            </Field>

            <Field
              label="パスワード"
              invalid={!!errors.password}
              errorText={errors.password?.message}
            >
              <PasswordInput
                {...register("password", {
                  required: "パスワードは必須です",
                })}
                placeholder="パスワードを入力"
              />
            </Field>
          </Fieldset.Content>

          <Field
            label="姓"
            invalid={!!errors.last_name}
            errorText={errors.last_name?.message}
          >
            <Input
              {...register("last_name", {
                required: "姓は必須です",
              })}
              placeholder="姓を入力"
            />
          </Field>

          <Field
            label="名"
            invalid={!!errors.first_name}
            errorText={errors.first_name?.message}
          >
            <Input
              {...register("first_name", {
                required: "名は必須です",
              })}
              placeholder="名を入力"
            />
          </Field>

          <Field
            label="メールアドレス"
            invalid={!!errors.email}
            errorText={errors.email?.message}
          >
            <Input
              {...register("email", {
                required: "メールアドレスは必須です",
                pattern: {
                  value: /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/,
                  message: "正しいメールアドレスを入力してください",
                },
              })}
              placeholder="メールアドレスを入力"
            />
          </Field>

          <Button
            loading={createUser.isPending}
            type="submit"
            alignSelf="flex-start"
          >
            登録
          </Button>
        </Fieldset.Root>
      </Flex>
    </form>
  );
}
