"use client";

import Image from "next/image";
import { Product } from "@/models/interfaces";
import { useRouter } from "next/navigation";

interface ProdutoCardProps {
  produto: Product;
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
  const router = useRouter();
  const imageUrl = `https://deisishop.pythonanywhere.com${produto.image}`;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:scale-105 transition-all">
      <Image
        src={imageUrl}
        alt={produto.title}
        width={200}
        height={200}
        className="rounded-xl mb-2"
      />
      <h2 className="text-lg font-semibold text-center">{produto.title}</h2>
      <p className="text-gray-600 mt-1">💶 {produto.price} €</p>

      <button
        onClick={() => router.push(`/produtos/${produto.id}`)}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        + Info
      </button>
    </div>
  );
}
