"use client";

import Image from "next/image";
import { Product } from "@/models/interfaces";
import { useRouter } from "next/navigation";

interface ProdutoDetalheProps {
  produto: Product;
}

export default function ProdutoDetalhe({ produto }: ProdutoDetalheProps) {
  const router = useRouter();

  // Evita duplicar o domínio se o link já for absoluto
  const imageUrl = produto.image.startsWith("http")
    ? produto.image
    : `https://deisishop.pythonanywhere.com${produto.image}`;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-md text-center">
      {/* 🔹 Título centrado */}
      <h1 className="text-3xl font-bold mb-6">{produto.title}</h1>

      {/* 🔹 Imagem centrada */}
      <div className="flex justify-center mb-6">
        <Image
          src={imageUrl}
          alt={produto.title}
          width={300}
          height={300}
          className="rounded-lg shadow-md"
        />
      </div>

      {/* 🔹 Texto e detalhes */}
      <p className="mb-2 text-gray-700">{produto.description}</p>
      <p className="mb-2 font-semibold">{produto.price} €</p>
      <p className="mb-6 text-gray-500">
        {produto.rating?.rate ?? "-"} ({produto.rating?.count ?? 0} avaliações)
      </p>

      {/* 🔹 Botão voltar */}
      <button
        onClick={() => router.push("/produtos")}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Voltar à lista
      </button>
    </div>
  );
}