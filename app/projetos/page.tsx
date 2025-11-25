import DescricaoProjetos from '@/components/ProjetosPage/DescricaoProjetos'
import Projeto from '@/components/Projeto/Projeto'


export default function projetospage() {
    return (
        <>
            <h2 className='text-center'>Projetos</h2>
            <DescricaoProjetos />
            <Projeto nome="LOJA DEISI" url="https://diogolalves06.github.io/Lab7/index.html" />
        </>
    )
}