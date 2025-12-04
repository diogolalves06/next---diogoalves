import Link from 'next/link';

const categorias = [
  { id: 1, nome: "Roupas", logo: "/images/roupas.png" },
  { id: 2, nome: "Acessórios", logo: "/images/acessorios.png" },
];

export default function CategoriasPage() {
  return (
    <div>
      <h1>Categorias DEISIshop</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        {categorias.map(categoria => (
          <div key={categoria.id}>
            <Link href={`/categorias/${categoria.id}`}>
              <img src={categoria.logo} alt={categoria.nome} width={100} />
              <h3>{categoria.nome}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
