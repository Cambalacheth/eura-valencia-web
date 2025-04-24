
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProjectCardProps {
  title: string;
  image: string;
  link: string;
}

const ProjectCard = ({ title, image, link }: ProjectCardProps) => {
  return (
    <Link to={link} className="block w-full h-full group">
      <div className="relative overflow-hidden rounded-xl h-full shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
        <AspectRatio ratio={4/3}>
          <div className="relative w-full h-full">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300 group-hover:bg-black/40">
              <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-light text-center px-8">{title}</h3>
            </div>
          </div>
        </AspectRatio>
      </div>
    </Link>
  );
};

export default ProjectCard;
