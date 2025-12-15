"use client";
// Este ficheiro é um componente de cliente (Next.js App Router)

// ===================== IMPORTS =====================
import React from "react";
// Importa React para usar funcionalidades como React.use()

import useSWR from "swr";
// Biblioteca para fetch de dados com cache, loading e revalidação

import ProdutoDetalhe from "@/components/ProdutoDetalhe/ProdutoDetalhe";
// Componente responsável por mostrar o detalhe de um produto

import { Product } from "@/models/interfaces";
// Interface TypeScript que define a estrutura de um produto

import { Skeleton } from "@/components/ui/skeleton";
// Componente visual de loading (placeholder)

// ===================== FETCHER =====================
const fetcher = async (url: string) => {
  // Função genérica usada pelo SWR para ir buscar dados
  const res = await fetch(url);

  // Caso o HTTP status não seja OK (200-299)
  if (!res.ok) {
    console.log("Erro HTTP:", res.status, res.statusText);
    // Log para ajudar no debug
    throw new Error("Erro ao carregar o produto");
  }

  // Converte a resposta para JSON
  return res.json();
};

// ===================== COMPONENTE PRINCIPAL =====================
export default function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // params vem como Promise no App Router
  // React.use() resolve a Promise e permite aceder aos valores

  const { id } = React.use(params);
  // Extrai o ID do produto a partir da URL dinâmica

  // ===================== FETCH DO PRODUTO =====================
  const { data, error, isLoading } = useSWR<Product>(
    `https://deisishop.pythonanywhere.com/products/${id}`,
    fetcher
  );
  // data -> produto recebido da API
  // error -> erro no fetch
  // isLoading -> estado de carregamento

  // ===================== ESTADO: LOADING =====================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    );
  }

  // ===================== ESTADO: ERRO =====================
  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        Ocorreu um erro ao carregar o produto
      </div>
    );
  }

  // ===================== ESTADO: PRODUTO NÃO ENCONTRADO =====================
  if (!data) {
    return (
      <div className="text-center mt-10">
        Produto não encontrado.
      </div>
    );
  }

  // ===================== RENDER FINAL =====================
  return (
    // Envia o produto completo como prop para o componente de detalhe
    <ProdutoDetalhe produto={data} />
  );
}
