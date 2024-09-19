import { z, defineCollection } from 'astro:content';

const pageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    sections: z.array(
      z.union([
        z.object({
          type: z.literal('header'),
          backgroundImage: z.string(),
          title: z.string(),
        }),
        z.object({
          type: z.literal('text'),
          content: z.string(),
        }),
        z.object({
          type: z.literal('gallery'),
          images: z.array(z.string()),
        }),
        z.object({
          type: z.literal('map'),
          latitude: z.number(),
          longitude: z.number(),
          zoom: z.number(),
          typelayer: z.enum(['map', 'topology', 'satellite']).default('map'),
          geojsons: z.array(
            z.object({
              geojson: z.string()
            })
          ).optional(),
        }),
        z.object({
          type: z.literal('footer'),
          content: z.string(),
        }),
      ])
    ),
  }),
});

export const collections = {
  'page': pageCollection,
};
