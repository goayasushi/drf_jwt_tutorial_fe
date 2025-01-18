"use client";
import { useState, useEffect } from "react";

import axiosClient from "@/lib/axiosClient";
import { User } from "@/types/user";
import { Box, Flex, Spinner, Table, Text } from "@chakra-ui/react";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosClient
      .get<User[]>("/api/users/")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Flex align="center" justify="center" height="60px">
        <Spinner size="sm" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex align="center" justify="center" height="60px">
        エラーが発生しました。
      </Flex>
    );
  }

  return (
    <Box p="6">
      <Text fontSize="md" mb="4" fontWeight="bold">
        ユーザー一覧
      </Text>

      <Table.Root size="sm" showColumnBorder variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ユーザー名</Table.ColumnHeader>
            <Table.ColumnHeader>メールアドレス</Table.ColumnHeader>
            <Table.ColumnHeader>グループ</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user.url}>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.groups}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
