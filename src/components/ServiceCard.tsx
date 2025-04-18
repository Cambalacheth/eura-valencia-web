
interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
}

const ServiceCard = ({ title, description, image }: ServiceCardProps) => {
  return (
    <div className="group relative overflow-hidden">
      <div className="relative h-96">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/50 transition-all duration-500">
          <div className="flex h-full flex-col justify-center p-6 text-center text-white">
            <h3 className="mb-4 text-xl font-light">{title}</h3>
            <p className="text-sm">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
