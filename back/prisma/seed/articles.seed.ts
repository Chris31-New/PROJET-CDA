import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

export async function seedArticles() {
  ///////////////////
  // ARTICLES
  ///////////////////
  console.log('Seeding Articles...');
  const categories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  // Définir tous les articles par catégorie
  const articlesByCategory: Record<string, string[]> = {
    'Electrical Supplies': [
      'Electrical Outlet',
      'Light Switch',
      'Electrical Cable 3G2.5',
      'Circuit Breaker',
      'Electrical Junction Box',
      'LED Light Bulb',
    ],
    'Plumbing Supplies': [
      'PVC Pipe',
      'Copper Pipe',
      'Faucet',
      'Sink Trap',
      'Ball Valve',
      'Pipe Elbow Connector',
    ],
    'Painting Supplies': [
      'White Paint 10L',
      'Exterior Paint',
      'Paint Roller',
      'Paint Tray',
      'Paint Brush Set',
      'Painter Tape',
    ],
    'Masonry Materials': [
      'Cement Bag 25kg',
      'Concrete Block',
      'Sand Bag',
      'Gravel Bag',
      'Mortar Mix',
    ],
    'Carpentry Materials': [
      'Interior Door',
      'Wood Beam',
      'Plywood Panel',
      'Door Hinge',
      'Wood Screws Pack',
    ],
    'Tiling Materials': [
      'Ceramic Tile',
      'Tile Adhesive',
      'Tile Spacer',
      'Tile Grout',
    ],
    'Insulation Materials': [
      'Glass Wool Roll',
      'Rock Wool Panel',
      'Insulation Foam Board',
    ],
    'Roofing Materials': [
      'Roof Tile',
      'Bitumen Roofing Sheet',
      'Roof Underlayment',
    ],
    'Drywall Materials': ['Drywall Panel', 'Drywall Screw', 'Joint Compound'],
    'Flooring Materials': [
      'Laminate Flooring Panel',
      'Floor Underlayment',
      'Vinyl Flooring Roll',
    ],
    'HVAC Materials': [
      'Air Vent Grille',
      'Flexible Air Duct',
      'Ventilation Fan',
    ],
    Hardware: [
      'Steel Nails Pack',
      'Wall Anchor',
      'Metal Bracket',
      'Adjustable Wrench',
      'Hammer',
    ],
  };

  // Transformer en tableau final avec category_id
  const articlesToInsert = Object.entries(articlesByCategory).flatMap(
    ([categoryName, articleNames]) => {
      const categoryId = categoryMap[categoryName];
      if (!categoryId) {
        console.warn(`Category not found: ${categoryName}`);
        return [];
      }
      return articleNames.map((name) => ({ name, category_id: categoryId }));
    },
  );

  // Insert all articles at once
  await prisma.article.createMany({
    data: articlesToInsert,
    skipDuplicates: true,
  });
  console.log('Articles seeded successfully!');
}
