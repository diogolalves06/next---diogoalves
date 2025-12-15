"use client";
// Este componente é renderizado no cliente (Next.js App Router)

// ===================== IMPORTS =====================
import Image from "next/image";
// Componente otimizado de imagem do Next.js

import { Product } from "@/models/interfaces";
// Interface TypeScript que define a estrutura de um produto

import { useRouter } from "next/navigation";
// Hook para navegação programática

// ===================== INTERFACE DE PROPS =====================
interface ProdutoDetalheProps {
  produto: Product; // Produto que será mostrado no detalhe
}

// ===================== COMPONENTE PRINCIPAL =====================
export default function ProdutoDetalhe({ produto }: ProdutoDetalheProps) {
  const router = useRouter();
  // Permite navegar para outras páginas, ex.: voltar para a lista

  // ===================== URL DA IMAGEM =====================
  const imageUrl = produto.image.startsWith("http")
    ? produto.image
    : `https://deisishop.pythonanywhere.com${produto.image}`;
  // Se a imagem já for URL absoluta, usa-a
  // Caso contrário, adiciona o domínio do backend

  // ===================== JSX =====================
  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-md text-center">
      {/* Container centralizado, com padding e sombra */}

      {/* 🔹 Título do produto */}
      <h1 className="text-3xl font-bold mb-6">{produto.title}</h1>

      {/* 🔹 Imagem do produto */}
      <div className="flex justify-center mb-6">
        <Image
          src={imageUrl}
          alt={produto.title}
          width={300}
          height={300}
          className="rounded-lg shadow-md"
        />
      </div>

      {/* 🔹 Descrição e detalhes */}
      <p className="mb-2 text-gray-700">{produto.description}</p>
      <p className="mb-2 font-semibold">{produto.price} €</p>
      <p className="mb-6 text-gray-500">
        {produto.rating?.rate ?? "-"} ({produto.rating?.count ?? 0} avaliações)
      </p>

      {/* 🔹 Botão voltar para lista de produtos */}
      <button
        onClick={() => router.push("/produtos")}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Voltar à lista
      </button>
    </div>
  );
}
