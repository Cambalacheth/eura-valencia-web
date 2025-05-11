
import Layout from '../components/Layout';
import { Helmet } from 'react-helmet';

const PoliticaPrivacidad = () => {
  return (
    <Layout>
      <Helmet>
        <title>Política de Privacidad - EURA</title>
        <meta name="description" content="Política de privacidad de EURA" />
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-light mb-8">Política de Privacidad</h1>
        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-light mb-4">1. Información que Recopilamos</h2>
            <p className="text-gray-600 leading-relaxed">
              EURA Proyectos, Obras y Servicios se compromete a proteger la privacidad de nuestros usuarios. Recopilamos información personal cuando utilizas nuestro formulario de contacto, que puede incluir:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Detalles sobre tu proyecto o consulta</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-light mb-4">2. Uso de la Información</h2>
            <p className="text-gray-600 leading-relaxed">
              La información que recopilamos se utiliza para:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600">
              <li>Responder a tus consultas y solicitudes</li>
              <li>Proporcionarte información sobre nuestros servicios</li>
              <li>Mejorar nuestro sitio web y la experiencia del usuario</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-2">
              No compartimos tu información personal con terceros sin tu consentimiento, excepto cuando sea necesario para proporcionar un servicio solicitado o cuando lo exija la ley.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4">3. Cookies y Tecnologías Similares</h2>
            <p className="text-gray-600 leading-relaxed">
              Utilizamos cookies y tecnologías similares para mejorar la funcionalidad de nuestro sitio web y entender cómo interactúas con él. Puedes configurar tu navegador para rechazar todas las cookies o para indicarte cuándo se envía una cookie. Sin embargo, si rechazas las cookies, es posible que algunas partes del sitio web no funcionen correctamente.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-light mb-4">4. Seguridad de Datos</h2>
            <p className="text-gray-600 leading-relaxed">
              Implementamos medidas de seguridad apropiadas para proteger tu información personal contra acceso, alteración, divulgación o destrucción no autorizados. Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar su seguridad absoluta.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-light mb-4">5. Tus Derechos</h2>
            <p className="text-gray-600 leading-relaxed">
              De acuerdo con la legislación de protección de datos aplicable, tienes derecho a:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600">
              <li>Acceder a tu información personal</li>
              <li>Rectificar información inexacta</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al procesamiento de tus datos</li>
              <li>Solicitar la limitación del procesamiento</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-light mb-4">6. Contacto</h2>
            <p className="text-gray-600 leading-relaxed">
              Si tienes preguntas o inquietudes sobre nuestra política de privacidad o el tratamiento de tus datos personales, puedes contactarnos a través de nuestro formulario de contacto o enviando un correo electrónico a mail@eura.es.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PoliticaPrivacidad;
