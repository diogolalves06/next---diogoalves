"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import ProdutoCard from "@/components/ProductCard/ProductCard";
import { Product } from "@/models/interfaces";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao carregar produtos");
  return res.json();
};

export default function ProdutosPage() {
  const { data, error, isLoading } = useSWR<Product[]>(
    "https://deisishop.pythonanywhere.com/products/",
    fetcher
  );

  const [cart, setCart] = useState<Product[]>([]);
  const [isStudent, setIsStudent] = useState(false);
  const [coupon, setCoupon] = useState("");

  // 👉 NOVO CAMPO OBRIGATÓRIO
  const [customerName, setCustomerName] = useState("");

  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [purchaseResponse, setPurchaseResponse] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (produto: Product) => {
    if (!cart.find((p) => p.id === produto.id)) {
      setCart([...cart, produto]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  const buy = () => {
    // 🚫 VALIDAÇÃO: nome não pode ser null/vazio
    if (!customerName.trim()) {
      setPurchaseMessage("⚠️ O nome é obrigatório para finalizar a compra.");
      return;
    }

    if (cart.length === 0) {
      setPurchaseMessage("O carrinho está vazio.");
      return;
    }

    fetch("https://deisishop.pythonanywhere.com/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        products: cart.map((product) => product.id),
        name: customerName.trim(), // 👈 agora vem do input
        student: isStudent,
        coupon: coupon.trim(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          throw new Error(data.detail);
        }

        setCart([]);
        localStorage.removeItem("cart");

        setPurchaseResponse({
          ...data,
          customerName: customerName.trim(),
        });
        setPurchaseMessage("");
        setCustomerName(""); // limpa após compra
      })
      .catch((error) => {
        setPurchaseMessage(`Erro: ${error.message}`);
        setPurchaseResponse(null);
      });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-10">
        Ocorreu um erro ao carregar os produtos
      </div>
    );

  if (!data)
    return <div className="text-center mt-10">Nenhum produto encontrado.</div>;

  const total = cart.reduce((acc, p) => acc + Number(p.price), 0);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">DEISI Shop</h1>

      {/* Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((produto) => (
          <ProdutoCard
            key={produto.id}
            produto={produto}
            onAdd={() => addToCart(produto)}
          />
        ))}
      </div>

      {/* Carrinho */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">Carrinho</h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600">O carrinho está vazio.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cart.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  onRemove={() => removeFromCart(produto.id)}
                />
              ))}
            </div>

            <p className="text-right text-xl font-semibold mt-6">
              Total: {total.toFixed(2)} €
            </p>

            <div className="mt-6 p-4 bg-gray-100 rounded-lg space-y-4">
              {/* 🔴 CAMPO OBRIGATÓRIO */}
              <input
                type="text"
                placeholder="Nome do cliente (obrigatório)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="w-4 h-4"
                />
                Estudante DEISI
              </label>

              <input
                type="text"
                placeholder="Cupão de desconto"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />

              <button
                onClick={buy}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                Comprar
              </button>
            </div>
          </>
        )}

        {purchaseResponse && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold mb-2">Compra realizada!</h3>
            <p>
              <strong>Referência:</strong> {purchaseResponse.reference}
            </p>
            <p>
              <strong>Total:</strong> {purchaseResponse.totalCost} €
            </p>
            <p>
              <strong>Cliente:</strong> {purchaseResponse.customerName}
            </p>
          </div>
        )}

        {purchaseMessage && (
          <p className="mt-4 text-center text-red-600 font-semibold">
            {purchaseMessage}
          </p>
        )}
      </div>
    </div>
  );
}
