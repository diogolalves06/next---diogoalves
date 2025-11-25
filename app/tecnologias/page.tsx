import data from '@/app/data/tecnologias.json'
import Tecnologias from '@/components/Tecnologias/Tecnologias'
import Link from 'next/link'

export default function tecnologiaspage() {
    return (
        <div className="items-center">
            {data.map((element, index) => (
                <Link href={'/tecnologias/${index}'}>
                    <Tecnologias key={index} titulo={element.title} />
                </Link>
            ))}
        </div>
    )
}