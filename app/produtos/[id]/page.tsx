import { useRouter } from 'next/router';

const produtos = [
  { id: 1, nome: "Camiseta", descricao: "Camiseta de algodão", imagem: "/images/camiseta.jpg" },
  { id: 2, nome: "Caneca", descricao: "Caneca personalizada", imagem: "/images/caneca.jpg" },
];

export default function ProdutoPage({ params }) {
  const produto = produtos.find(p => p.id === parseInt(params.id));

  if (!produto) return <p>Produto não encontrado.</p>;

  return (
    <div>
      <h1>{produto.nome}</h1>
      <img src={produto.imagem} alt={produto.nome} width={200} />
      <p>{produto.descricao}</p>
      <button>Remover Produto</button> {/* Pode adicionar função depois */}
    </div>
  );
}
