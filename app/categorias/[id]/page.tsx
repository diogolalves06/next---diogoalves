import Link from 'next/link';

const categorias = [
  { id: 1, nome: "Roupas" },
  { id: 2, nome: "Acessórios" },
];

const produtos = [
  { id: 1, nome: "Camisa", imagem: "", categoriaId: 1 },
  { id: 2, nome: "Caneca", imagem: "/images/caneca.jpg", categoriaId: 2 },
];

export default function CategoriaPage({ params }) {
  const categoria = categorias.find(c => c.id === parseInt(params.id));
  if (!categoria) return <p>Categoria não encontrada.</p>;

  const produtosFiltrados = produtos.filter(p => p.categoriaId === categoria.id);

  return (
    <div>
      <h1>Categoria: {categoria.nome}</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        {produtosFiltrados.map(produto => (
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
