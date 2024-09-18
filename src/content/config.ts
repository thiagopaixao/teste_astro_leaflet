import { z, defineCollection } from 'astro:content';

const sectionsCollection = defineCollection({
  schema: z.object({
    type: z.enum(["header", "text", "gallery", "map", "footer"]),
    content: z.string().optional(),
    images: z.array(z.string()).optional(),
    order: z.number(),
  }),
});

export const collections = {
  sections: sectionsCollection,
};
