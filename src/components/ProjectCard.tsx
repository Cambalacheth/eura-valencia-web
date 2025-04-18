
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProjectCardProps {
  title: string;
  image: string;
  link: string;
}

const ProjectCard = ({ title, image, link }: ProjectCardProps) => {
  return (
    <Link to={link} className="block w-full hover:opacity-95 transition-opacity">
      <div className="relative overflow-hidden rounded-lg">
        <AspectRatio ratio={4/3}>
          <div className="relative w-full h-full">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-2xl font-light text-center px-4">{title}</h3>
            </div>
          </div>
        </AspectRatio>
      </div>
    </Link>
  );
};

export default ProjectCard;
