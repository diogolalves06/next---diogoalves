import Link from "next/link"

interface ProjectProps {
    nome: string
    url: string
}

export default function Projeto({nome, url}: ProjectProps) {
    
    return(
        <>
            <article className="bg-yellow-500 p-2 m-3">
                <h2>Nome</h2>
                <p>Explorem o projeto {nome} no seguinte </p> 
                    <Link href= {url} className="underline" target="blank">
                        Link
                    </Link>
            
            </article>
        </>
    )
}