import Link from 'next/link';

// Exemplo de produtos
const produtos = [
  { id: 1, nome: "Camisa", imagem: "", categoriaId: 1 },
  { id: 2, nome: "Caneca", imagem: "", categoriaId: 2 },
];

export default function ProdutosPage() {
  return (
    <div>
      <h1>Produtos DEISIshop</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        {produtos.map(produto => (
          <div key={produto.id}>
            <Link href={`/produtos/${produto.id}`}>
              <img src={produto.imagem} alt={produto.nome} width={150} />
              <h3>{produto.nome}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}