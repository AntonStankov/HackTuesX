// PostStyle.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface PostStyleProps {
  imageUrl: string;
  imageAlt: string;
  accordionContent1: string;
  accordionContent2: string;
  accordionValue: string;
}

const PostStyle: React.FC<PostStyleProps> = ({ imageUrl, imageAlt, accordionContent1, accordionContent2, accordionValue }) => {
  const navigate = useNavigate();

  return (
    <div>
      <img src={imageUrl} alt={imageAlt} width="150" height="100" />
      <Button onClick={() => navigate('/map')}>Change Image</Button>
      <Accordion type="single" collapsible>
        <AccordionItem value={accordionValue}>
          <AccordionTrigger>
            Info about the map
          </AccordionTrigger>
          <AccordionContent>
            <strong>Score: </strong>{accordionContent1}
          </AccordionContent>
          <AccordionContent>
            <strong>Analysis: </strong>{accordionContent2}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PostStyle;