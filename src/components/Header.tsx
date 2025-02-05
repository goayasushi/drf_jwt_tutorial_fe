"use client";

import { Button, Flex, Link, Spinner, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";

import { useUser } from "@/context/UserContext";
import { useLogout } from "@/hooks/useLogout";

export const Header = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const { logout } = useLogout();
  console.log(user);

  if (loading) {
    return (
      <Flex align="center" justify="center" height="60px">
        <Spinner size="sm" />
      </Flex>
    );
  }

  return (
    <Flex
      as="header"
      width="100%"
      height="60px"
      align="center"
      justify="space-between"
      px="6"
      boxShadow="sm"
      gap="4"
    >
      {/* title */}
      <Text fontSize="xl" fontWeight="bold" marginEnd="auto">
        Awesome App
      </Text>

      {/* avatar button */}
      <DrawerRoot>
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <Avatar variant="solid" name={user?.username} cursor="pointer" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{user?.username}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Text mb={4}>設定</Text>
            <Link onClick={logout} cursor="pointer">
              ログアウト
            </Link>
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
      <Button onClick={() => router.push("/snippets/new")}>投稿する</Button>
    </Flex>
  );
};
