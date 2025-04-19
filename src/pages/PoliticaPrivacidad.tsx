
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
              EURA se compromete a proteger la privacidad de nuestros usuarios. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos tu información personal.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-light mb-4">2. Uso de la Información</h2>
            <p className="text-gray-600 leading-relaxed">
              La información que recopilamos se utiliza únicamente para mejorar nuestros servicios y proporcionar una mejor experiencia a nuestros usuarios. No compartimos tu información personal con terceros sin tu consentimiento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4">3. Cookies y Tecnologías Similares</h2>
            <p className="text-gray-600 leading-relaxed">
              Utilizamos cookies y tecnologías similares para mejorar la funcionalidad de nuestro sitio web y entender cómo interactúas con él.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PoliticaPrivacidad;
