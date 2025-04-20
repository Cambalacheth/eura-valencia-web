
interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
}

const ServiceCard = ({ title, description, image }: ServiceCardProps) => {
  return (
    <div className="group relative overflow-hidden mx-auto max-w-md">
      <div className="relative h-[400px] md:h-[300px]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/70 transition-all duration-500 flex items-center p-6">
          <div className="text-white">
            <h3 className="mb-4 text-xl font-semibold leading-tight">{title}</h3>
            <p className="text-sm leading-relaxed opacity-100">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
