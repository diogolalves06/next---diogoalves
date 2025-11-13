import Componente1 from '@/components/Componente1/Componente1'


export default function page() {

const magia = <p>OLA</p>
const frase = "O cristino ronaldo é o melhor"

  return(
    <div>
      <h2>VIVA O NEXT</h2>
      <p>VÂO TODOS PARA O CA....</p>
      {magia}
      <p><strong>{frase}</strong></p>
      <Componente1 />
      <Componente1 />
      <Componente1 />
      
    </div>

  )
}