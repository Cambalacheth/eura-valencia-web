
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProjectCardProps {
  title: string;
  image: string;
  link: string;
}

const ProjectCard = ({ title, image, link }: ProjectCardProps) => {
  return (
    <Link to={link} className="block w-full h-full hover:opacity-95 transition-opacity">
      <div className="relative overflow-hidden rounded-lg h-full shadow-lg">
        <AspectRatio ratio={16/9}>
          <div className="relative w-full h-full">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity hover:bg-black/50">
              <h3 className="text-white text-2xl md:text-3xl font-light text-center px-6">{title}</h3>
            </div>
          </div>
        </AspectRatio>
      </div>
    </Link>
  );
};

export default ProjectCard;
