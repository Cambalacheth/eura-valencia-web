
import Layout from '../components/Layout';
import { Helmet } from 'react-helmet';

const TerminosCondiciones = () => {
  return (
    <Layout>
      <Helmet>
        <title>Términos y Condiciones - EURA</title>
        <meta name="description" content="Términos y condiciones de uso de EURA" />
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-light mb-8">Términos y Condiciones</h1>
        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-light mb-4">1. Introducción</h2>
            <p className="text-gray-600 leading-relaxed">
              Estos términos y condiciones rigen el uso de este sitio web de EURA Proyectos, Obras y Servicios. Al acceder a este sitio web, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con estos términos y condiciones, no debes utilizar este sitio web.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-light mb-4">2. Propiedad Intelectual</h2>
            <p className="text-gray-600 leading-relaxed">
              Todo el contenido incluido en este sitio web, incluyendo textos, gráficos, logotipos, imágenes y software, es propiedad de EURA Proyectos, Obras y Servicios o sus proveedores de contenido y está protegido por las leyes de propiedad intelectual españolas e internacionales. La reproducción, distribución, modificación o cualquier otro uso del material de este sitio web está prohibido sin el consentimiento previo por escrito de EURA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4">3. Uso del Sitio</h2>
            <p className="text-gray-600 leading-relaxed">
              Este sitio web se proporciona "tal cual", y EURA se reserva el derecho de modificar o retirar cualquier parte del sitio web en cualquier momento y sin previo aviso. No garantizamos que nuestro sitio web o cualquier contenido en él estén siempre disponibles o sean ininterrumpidos.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-light mb-4">4. Limitación de Responsabilidad</h2>
            <p className="text-gray-600 leading-relaxed">
              En la medida permitida por la ley, EURA excluye todas las representaciones y garantías relacionadas con este sitio web y su contenido. No seremos responsables por ningún daño directo, indirecto o consecuente que pueda surgir del uso de nuestro sitio web.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-light mb-4">5. Modificaciones</h2>
            <p className="text-gray-600 leading-relaxed">
              Podemos revisar estos términos y condiciones en cualquier momento modificando esta página. Te recomendamos que consultes esta página con regularidad para estar al tanto de cualquier cambio, ya que son legalmente vinculantes para ti.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-light mb-4">6. Ley Aplicable</h2>
            <p className="text-gray-600 leading-relaxed">
              Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes españolas, y cualquier disputa relacionada con ellos estará sujeta a la jurisdicción exclusiva de los tribunales españoles.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TerminosCondiciones;
