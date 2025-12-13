"use client";

import Image from "next/image";
import { Product } from "@/models/interfaces";

interface ProdutoCardProps {
  produto: Product;
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
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
    </div>
  );
}
