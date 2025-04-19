
import Layout from '../components/Layout';
import { Helmet } from 'react-helmet';
import ContactForm from '@/components/ContactForm';

const Contacto = () => {
  return (
    <Layout>
      <Helmet>
        <title>Contacto - EURA</title>
        <meta name="description" content="Ponte en contacto con EURA para discutir tu próximo proyecto" />
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-light mb-8 text-center">MUÉSTRANOS TU PROYECTO</h1>
          <ContactForm />
        </div>
      </div>
    </Layout>
  );
};

export default Contacto;
