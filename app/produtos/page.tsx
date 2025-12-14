"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import ProdutoCard from "@/components/ProductCard/ProductCard";
import { Product } from "@/models/interfaces";
import { Skeleton } from "@/components/ui/skeleton";

// 🔹 Função para buscar produtos da API
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Erro HTTP:", res.status, res.statusText);
    throw new Error("Erro ao carregar produtos");
  }
  return res.json();
};

export default function ProdutosPage() {
  // 🔹 SWR para produtos
  const { data, error, isLoading } = useSWR<Product[]>(
    "https://deisishop.pythonanywhere.com/products/",
    fetcher
  );

  // 🔹 Estados
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "price-asc" | "price-desc">(
    "name-asc"
  );
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [isStudent, setIsStudent] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [purchaseMessage, setPurchaseMessage] = useState("");

  // 🔹 Ler carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // 🔹 Guardar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🔹 Filtrar e ordenar produtos
  useEffect(() => {
    if (data) {
      let filtered = data.filter((produto) =>
        produto.title.toLowerCase().includes(search.toLowerCase())
      );

      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name-asc":
            return a.title.localeCompare(b.title);
          case "name-desc":
            return b.title.localeCompare(a.title);
          case "price-asc":
            return Number(a.price) - Number(b.price);
          case "price-desc":
            return Number(b.price) - Number(a.price);
          default:
            return 0;
        }
      });

      setFilteredData(filtered);
    }
  }, [search, data, sortBy]);

  // 🔹 Adicionar/remover do carrinho
  const addToCart = (produto: Product) => {
    if (!cart.find((p) => p.id === produto.id)) {
      setCart([...cart, { ...produto, price: Number(produto.price) }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  // 🔹 Calcular total
  const total = cart.reduce((acc, p) => acc + Number(p.price), 0);

  // 🔹 Função de compra
  const handlePurchase = async () => {
  if (cart.length === 0) {
    setPurchaseMessage("O carrinho está vazio!");
    return;
  }

  // Monta o payload de forma segura
  const payload = {
    products: cart.map((p) => ({
      product: Number(p.id),      // garante número
      quantity: 1,
    })),
    is_student: isStudent ? 1 : 0,  // usa inteiro para verdadeiro/falso
    coupon: coupon.trim() || null,  // se vazio, envia null
  };

  console.log("Payload enviado:", payload);

  try {
    const res = await fetch(
      "https://deisishop.pythonanywhere.com/api/purchase/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // tenta ler JSON de erro
      let errorText = "Erro ao processar a compra.";
      try {
        const errorData = await res.json();
        errorText = errorData.detail || JSON.stringify(errorData);
      } catch {}
      throw new Error(errorText);
    }

    await res.json();
    setPurchaseMessage("Compra realizada com sucesso! ✅");
    setCart([]);
    localStorage.removeItem("cart");
  } catch (err: any) {
    setPurchaseMessage(`Erro: ${err.message}`);
  }
};


  // 🔹 Loading e erros
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-10">
        Ocorreu um erro ao carregar os produtos 😢
      </div>
    );

  if (!data) return <div className="text-center mt-10">Nenhum produto encontrado.</div>;

  // 🔹 Render
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">🛍️ DEISI Shop</h1>

      {/* Pesquisa e ordenação */}
      <div className="flex flex-col sm:flex-row justify-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-48 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="name-asc">Nome ↑</option>
          <option value="name-desc">Nome ↓</option>
          <option value="price-asc">Preço ↑</option>
          <option value="price-desc">Preço ↓</option>
        </select>
      </div>

      {/* Grelha de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} onAdd={() => addToCart(produto)} />
        ))}
      </div>

      {/* Carrinho */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">🛒 Carrinho</h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">O carrinho está vazio.</p>
        ) : (
          <div>
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
              Total: 💶 {total.toFixed(2)} €
            </p>

            {/* Inputs de compra */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <label className="flex items-center gap-2 mb-4">
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
                className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={handlePurchase}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
              >
                Comprar
              </button>

              {purchaseMessage && (
                <p className="mt-4 text-center text-blue-700 font-semibold">{purchaseMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
