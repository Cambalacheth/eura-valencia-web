
interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
}

const ServiceCard = ({ title, description, image }: ServiceCardProps) => {
  return (
    <div className="group relative mx-auto max-w-md">
      <div className="relative h-[300px]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 flex items-end p-6">
          <h3 className="text-2xl font-semibold text-white tracking-tight">{title}</h3>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-b-lg p-6">
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
