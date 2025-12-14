"use client";

import Image from "next/image";
import { Product } from "@/models/interfaces";
import { useRouter } from "next/navigation";

interface ProdutoDetalheProps {
  produto: Product;
}

export default function ProdutoDetalhe({ produto }: ProdutoDetalheProps) {
  const router = useRouter();

  const imageUrl = produto.image.startsWith("http")
  ? produto.image
  : `https://deisishop.pythonanywhere.com${produto.image}`;


  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">{produto.title}</h1>
      <Image
        src={imageUrl}
        alt={produto.title}
        width={300}
        height={300}
        className="rounded-lg mb-4"
      />
      <p className="mb-2 text-gray-700">{produto.description}</p>
      <p className="mb-2 font-semibold">Preço: {produto.price} €</p>
      <p className="mb-4 text-gray-500">
        Rating: {produto.rating.rate} ({produto.rating.count} avaliações)
      </p>
      <button
        onClick={() => router.push("/produtos")}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Voltar à lista
      </button>
    </div>
  );
}
