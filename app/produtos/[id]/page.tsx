"use client";

import useSWR from "swr";
import ProdutoDetalhe from "@/components/ProdutoDetalhe/ProdutoDetalhe";
import { Product } from "@/models/interfaces";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Erro HTTP:", res.status, res.statusText);
    throw new Error("Erro ao carregar o produto");
  }
  return res.json();
};

export default function ProdutoPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data, error, isLoading } = useSWR<Product>(
    `https://deisishop.pythonanywhere.com/products/${id}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        Ocorreu um erro ao carregar o produto.
      </div>
    );
  }

  if (!data) {
    return <div className="text-center mt-10">Produto não encontrado.</div>;
  }

  return <ProdutoDetalhe produto={data} />;
}
