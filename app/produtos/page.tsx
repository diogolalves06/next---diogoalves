"use client"; 
// Indica que este componente é executado no cliente (Next.js App Router)

// ===================== IMPORTS =====================
import useSWR from "swr"; 
// Biblioteca para fetch de dados com cache, revalidação e estados automáticos

import { useState, useEffect } from "react";
// Hooks do React para estado e efeitos laterais

import ProdutoCard from "@/components/ProductCard/ProductCard";
// Componente responsável por mostrar um produto

import { Product } from "@/models/interfaces";
// Interface TypeScript que define a estrutura de um produto

import { Skeleton } from "@/components/ui/skeleton";
// Componente visual de loading (placeholder)

// ===================== FETCHER =====================
const fetcher = async (url: string) => {
  // Função genérica usada pelo SWR para ir buscar dados
  const res = await fetch(url);

  // Se a resposta não for válida, lança erro
  if (!res.ok) throw new Error("Erro ao carregar produtos");

  // Converte a resposta em JSON
  return res.json();
};

// ===================== COMPONENTE PRINCIPAL =====================
export default function ProdutosPage() {

  // ===================== FETCH DE PRODUTOS =====================
  const { data, error, isLoading } = useSWR<Product[]>(
    "https://deisishop.pythonanywhere.com/products/",
    fetcher
  );
  // data -> lista de produtos
  // error -> erro no fetch
  // isLoading -> estado de carregamento

  // ===================== ESTADOS =====================
  const [cart, setCart] = useState<Product[]>([]);
  // Carrinho de compras (lista de produtos)

  const [isStudent, setIsStudent] = useState(false);
  // Indica se o cliente é estudante DEISI

  const [coupon, setCoupon] = useState("");
  // Cupão de desconto

  // 👉 Nome do cliente (campo obrigatório)
  const [customerName, setCustomerName] = useState("");

  const [purchaseMessage, setPurchaseMessage] = useState("");
  // Mensagem de erro ou aviso da compra

  const [purchaseResponse, setPurchaseResponse] = useState<any>(null);
  // Resposta recebida da API após compra

  // ===================== LOCALSTORAGE: CARREGAR =====================
  useEffect(() => {
    // Vai buscar o carrinho guardado no localStorage
    const saved = localStorage.getItem("cart");

    if (saved) setCart(JSON.parse(saved));
  }, []);
  // Executa apenas uma vez quando a página carrega

  // ===================== LOCALSTORAGE: GUARDAR =====================
  useEffect(() => {
    // Guarda o carrinho sempre que ele muda
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ===================== ADICIONAR AO CARRINHO =====================
  const addToCart = (produto: Product) => {
    // Evita produtos duplicados no carrinho
    if (!cart.find((p) => p.id === produto.id)) {
      setCart([...cart, produto]);
    }
  };

  // ===================== REMOVER DO CARRINHO =====================
  const removeFromCart = (id: number) => {
    // Remove o produto com o ID correspondente
    setCart(cart.filter((p) => p.id !== id));
  };

  // ===================== COMPRAR =====================
  const buy = () => {

    // 🚫 Validação: nome obrigatório
    if (!customerName.trim()) {
      setPurchaseMessage("⚠️ O nome é obrigatório para finalizar a compra.");
      return;
    }

    // 🚫 Validação: carrinho vazio
    if (cart.length === 0) {
      setPurchaseMessage("O carrinho está vazio.");
      return;
    }

    // Pedido POST para a API de compra
    fetch("https://deisishop.pythonanywhere.com/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        products: cart.map((product) => product.id),
        // Envia apenas os IDs dos produtos

        name: customerName.trim(),
        // Nome do cliente

        student: isStudent,
        // Indica se é estudante

        coupon: coupon.trim(),
        // Cupão (se existir)
      }),
    })
      .then((response) => response.json())
      .then((data) => {

        // Se a API devolver erro
        if (data.detail) {
          throw new Error(data.detail);
        }

        // Limpa carrinho
        setCart([]);
        localStorage.removeItem("cart");

        // Guarda resposta da compra
        setPurchaseResponse({
          ...data,
          customerName: customerName.trim(),
        });

        // Limpa mensagens e campos
        setPurchaseMessage("");
        setCustomerName("");
      })
      .catch((error) => {
        // Em caso de erro
        setPurchaseMessage(`Erro: ${error.message}`);
        setPurchaseResponse(null);
      });
  };

  // ===================== ESTADOS VISUAIS =====================
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

  // ===================== TOTAL =====================
  const total = cart.reduce((acc, p) => acc + Number(p.price), 0);

  // ===================== JSX =====================
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">DEISI Shop</h1>

      {/* ===================== LISTA DE PRODUTOS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((produto) => (
          <ProdutoCard
            key={produto.id}
            produto={produto}
            onAdd={() => addToCart(produto)}
          />
        ))}
      </div>

      {/* ===================== CARRINHO ===================== */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">Carrinho</h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600">O carrinho está vazio.</p>
        ) : (
          <>
            {/* Produtos no carrinho */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cart.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  onRemove={() => removeFromCart(produto.id)}
                />
              ))}
            </div>

            {/* Total */}
            <p className="text-right text-xl font-semibold mt-6">
              Total: {total.toFixed(2)} €
            </p>

            {/* Formulário de compra */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg space-y-4">

              {/* Nome do cliente */}
              <input
                type="text"
                placeholder="Nome do cliente (obrigatório)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />

              {/* Checkbox estudante */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="w-4 h-4"
                />
                Estudante DEISI
              </label>

              {/* Cupão */}
              <input
                type="text"
                placeholder="Cupão de desconto"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />

              {/* Botão comprar */}
              <button
                onClick={buy}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                Comprar
              </button>
            </div>
          </>
        )}

        {/* ===================== RESPOSTA DA COMPRA ===================== */}
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

        {/* ===================== MENSAGEM DE ERRO ===================== */}
        {purchaseMessage && (
          <p className="mt-4 text-center text-red-600 font-semibold">
            {purchaseMessage}
          </p>
        )}
      </div>
    </div>
  );
}
