"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Fieldset, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";

import axiosClient from "@/lib/axiosClient";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        // decode jwt token
        const decoded: { exp: number } = jwtDecode(token);
        // verify jwt token expiration
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          router.push("/users");
        } else {
          localStorage.removeItem("access_token");
        }
      } catch (err) {
        // fraudulent tokens by jwtDecode()
        localStorage.removeItem("access_token");
      }
    }
  }, [router]);

  // form
  type FormValues = {
    username: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleLogin = async (data: FormValues) => {
    try {
      const res = await axiosClient.post("/account/auth/jwt", {
        username: data.username,
        password: data.password,
      });
      const token = res.data.access;
      if (token) {
        localStorage.setItem("access_token", token);
      }

      router.push("/users");
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("ログインに失敗しました。");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
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
            <Fieldset.Legend>ログイン</Fieldset.Legend>
          </Stack>

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
          {errorMessage && (
            <Text color="red.500" fontSize="sm">
              {errorMessage}
            </Text>
          )}

          <Button type="submit" alignSelf="flex-start">
            ログイン
          </Button>
        </Fieldset.Root>
      </Flex>
    </form>
  );
}
