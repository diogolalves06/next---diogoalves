
interface TecnologiasProps {
    titulo: string
    

}  

export default function Tecnologias({titulo} : TecnologiasProps) {
    return (
        <div>
            <h2>{titulo}</h2>
        </div>
    )
}