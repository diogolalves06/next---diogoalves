"use client";

import useSWR from "swr";
import ProdutoCard from "@/components/ProductCard/ProductCard";
import { Product } from "@/models/interfaces";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Erro HTTP:", res.status, res.statusText);
    throw new Error("Erro ao carregar produtos");
  }
  return res.json();
};

export default function ProdutosPage() {
  const { data, error, isLoading } = useSWR<Product[]>(
    "https://deisishop.pythonanywhere.com/products",
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
        Ocorreu um erro ao carregar os produtos 😢
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-10">
        Nenhum produto encontrado.
      </div>
    );
  }

  console.log("Dados recebidos:", data);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">DEISI Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}
