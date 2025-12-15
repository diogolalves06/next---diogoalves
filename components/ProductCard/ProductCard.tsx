"use client";
// Componente do lado cliente (Next.js App Router)

// ===================== IMPORTS =====================
import Image from "next/image";
// Componente otimizado de imagem do Next.js

import { Product } from "@/models/interfaces";
// Interface TypeScript que define a estrutura de um produto

import { useRouter } from "next/navigation";
// Hook para navegação programática no Next.js

// ===================== INTERFACE DE PROPS =====================
interface ProdutoCardProps {
  produto: Product;      // Produto a ser exibido
  onAdd?: () => void;    // Função opcional para adicionar ao carrinho
  onRemove?: () => void; // Função opcional para remover do carrinho
}

// ===================== COMPONENTE PRINCIPAL =====================
export default function ProdutoCard({
  produto,
  onAdd,
  onRemove,
}: ProdutoCardProps) {

  // ===================== NAVEGAÇÃO =====================
  const router = useRouter();
  // Permite redirecionar para a página de detalhe do produto

  // ===================== URL DA IMAGEM =====================
  const imageUrl = produto.image.startsWith("http")
    ? produto.image
    : `https://deisishop.pythonanywhere.com${produto.image}`;
  // Se a imagem já for URL completa, usa-a
  // Caso contrário, adiciona o domínio do backend

  // ===================== JSX =====================
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:scale-105 transition-all">
      {/* Card do produto com hover animado */}

      {/* IMAGEM */}
      <Image
        src={imageUrl}
        alt={produto.title}
        width={200}
        height={200}
        className="rounded-xl mb-2"
      />

      {/* TÍTULO */}
      <h2 className="text-lg font-semibold text-center">{produto.title}</h2>

      {/* PREÇO */}
      <p className="text-gray-600 mt-1">{produto.price} €</p>

      {/* BOTÃO DE INFORMAÇÃO */}
      <button
        onClick={() => router.push(`/produtos/${produto.id}`)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        + Info
      </button>

      {/* BOTÃO ADICIONAR AO CARRINHO */}
      {onAdd && (
        <button
          onClick={onAdd}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Adicionar ao carrinho
        </button>
      )}

      {/* BOTÃO REMOVER DO CARRINHO */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Remover
        </button>
      )}
    </div>
  );
}
