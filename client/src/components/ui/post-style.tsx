// ImageAccordion.tsx
import React from 'react';
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
  return (
    <div>
      <img src={imageUrl} alt={imageAlt} width="150" height="100" />
      <Accordion type="single" collapsible>
        <AccordionItem value={accordionValue}>
          <AccordionTrigger>
            Info about the map
          </AccordionTrigger>
          <AccordionContent>
            {"Score: " + accordionContent1}
          </AccordionContent>
          <AccordionContent>
            {"Analysis: " + accordionContent2}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PostStyle;