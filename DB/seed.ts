import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import * as path from 'path';

const dbPath = path.resolve(__dirname, 'sqlite.db');
const client = createClient({ url: `file:${dbPath}` });
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding database...');

  // Insertar deportes
  await db.insert(schema.sportsTable).values([
    { name: 'Fútbol', order: 1, isActive: true },
    { name: 'Running', order: 2, isActive: true },
    { name: 'Basketball', order: 3, isActive: true },
    { name: 'Training', order: 4, isActive: true },
    { name: 'Tenis', order: 5, isActive: true },
    { name: 'Golf', order: 6, isActive: true },
  ]);
  console.log('✓ Sports inserted');

  // Insertar productos
  await db.insert(schema.productsTable).values([
    {
      name: 'Nike Air Zoom Pegasus',
      price: '$120.00',
      category: 'Running',
      sport: 'Running',
      image: '/images/product-running-1.jpg',
      isBestSeller: true,
      description: 'Tenis de running versátiles para todo tipo de corredores',
    },
    {
      name: 'Adidas Ultraboost Light',
      price: '$180.00',
      category: 'Running',
      sport: 'Running',
      image: '/images/product-running-2.jpg',
      isNew: true,
      description: 'Máxima energía en cada zancada',
    },
    {
      name: 'Puma Future Rider',
      price: '$90.00',
      category: 'Casual',
      sport: 'Lifestyle',
      image: '/images/product-casual-1.jpg',
      description: 'Estilo retro con comodidad moderna',
    },
    {
      name: 'Nike LeBron XX',
      price: '$200.00',
      category: 'Basketball',
      sport: 'Basketball',
      image: '/images/product-basketball-1.jpg',
      isBestSeller: true,
      description: 'Potencia y estilo en la cancha',
    },
    {
      name: 'Adidas Predator',
      price: '$220.00',
      category: 'Fútbol',
      sport: 'Fútbol',
      image: '/images/product-soccer-1.jpg',
      isBestSeller: true,
      description: 'Control total del balón',
    },
    {
      name: 'Nike Metcon 9',
      price: '$130.00',
      category: 'Training',
      sport: 'Training',
      image: '/images/product-training-1.jpg',
      isNew: true,
      description: 'Estabilidad para entrenamientos intensos',
    },
  ]);
  console.log('✓ Products inserted');

  // Insertar equipos
  await db.insert(schema.teamsTable).values([
    { name: 'Argentina', country: 'Argentina', type: 'Selecciones' },
    { name: 'Brasil', country: 'Brasil', type: 'Selecciones' },
    { name: 'España', country: 'España', type: 'Selecciones' },
    { name: 'Alemania', country: 'Alemania', type: 'Selecciones' },
    { name: 'Francia', country: 'Francia', type: 'Selecciones' },
    { name: 'Inglaterra', country: 'Inglaterra', type: 'Selecciones' },
    { name: 'América', country: 'México', type: 'Clubes Locales' },
    { name: 'Guadalajara', country: 'México', type: 'Clubes Locales' },
    { name: 'Cruz Azul', country: 'México', type: 'Clubes Locales' },
    { name: 'Pumas', country: 'México', type: 'Clubes Locales' },
    { name: 'Real Madrid', country: 'España', type: 'Clubes' },
    { name: 'Barcelona', country: 'España', type: 'Clubes' },
    { name: 'Manchester City', country: 'Inglaterra', type: 'Clubes' },
    { name: 'Bayern Munich', country: 'Alemania', type: 'Clubes' },
  ]);
  console.log('✓ Teams inserted');

  // Insertar banners
  await db.insert(schema.featureBannersTable).values([
    {
      title: 'Nueva Colección Running',
      subtitle: 'INNOVACIÓN',
      description: 'Tecnología de punta para mejorar tu rendimiento',
      image: '/images/sneaker-1.jpg',
      buttonText: 'EXPLORAR',
      bgColor: '#1a237e',
      order: 1,
    },
    {
      title: 'Edición Limitada Fútbol',
      subtitle: 'EXCLUSIVO',
      description: 'Los mejores boots usados por profesionales',
      image: '/images/sneaker-2.jpg',
      buttonText: 'DESCUBRIR',
      bgColor: '#000000',
      order: 2,
    },
  ]);
  console.log('✓ Banners inserted');

  // Insertar héroes
  await db.insert(schema.heroesTable).values([
    {
      campaignName: 'JUST DO IT',
      category: 'RUNNING',
      description: 'Supera tus límites. Cada paso cuenta.',
      imageUrl: '/images/hero-lifestyle-1.jpg',
      videoUrl: '/videos/hero-running.mp4',
      ctaText: 'COMPRAR AHORA',
      isActive: true,
      order: 1,
    },
  ]);
  console.log('✓ Heroes inserted');

  console.log('\n✅ Database seeded successfully!');
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
