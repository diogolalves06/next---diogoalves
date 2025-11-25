import { useParams } from "next/navigation";
import tecnologias from "@/app/data/tecnologias.json";

export default function Tecnologia() {
    const params = useParams();
    const id = Number(params.tecnologia)

    return (
        <>
            <h2>{tecnologias[id].title}</h2>
            <h2>{tecnologias[id].description}</h2>
        </>
    )
}