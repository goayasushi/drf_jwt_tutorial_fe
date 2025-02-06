import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axiosClient";
import { Snippet } from "@/types/snippet";

export const useFetchSnippetById = (id: string) => {
  const fetchSnippetById = async (id: string): Promise<Snippet> => {
    const { data } = await axiosClient.get<Snippet>(`/snippets/${id}/`);
    return data;
  };

  return useQuery({
    queryKey: ["snippet", id],
    queryFn: () => fetchSnippetById(id),
    enabled: !!id,
  });
};
