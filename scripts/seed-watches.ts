import { db } from '../server/db';
import { watches } from '../shared/schema';

async function seedWatches() {
  console.log('Seeding watches...');
  
  const watchData = [
    {
      brand: 'Rolex',
      model: 'Submariner',
      reference: '126610LN',
      size: 41,
      material: 'Steel',
      price: 1500000, // $15,000.00
      imageUrl: 'https://images.unsplash.com/photo-1647962678911-0e53a3d0b5f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600'
    },
    {
      brand: 'Omega',
      model: 'Speedmaster Professional',
      reference: '310.30.42.50.01.001',
      size: 42,
      material: 'Steel',
      price: 650000, // $6,500.00
      imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600'
    },
    {
      brand: 'Patek Philippe',
      model: 'Nautilus',
      reference: '5711/1A-010',
      size: 40,
      material: 'Steel',
      price: 10000000, // $100,000.00
      imageUrl: 'https://images.unsplash.com/photo-1612380690891-0424043ef98a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600'
    },
    {
      brand: 'Audemars Piguet',
      model: 'Royal Oak',
      reference: '15500ST.OO.1220ST.01',
      size: 41,
      material: 'Steel',
      price: 4000000, // $40,000.00
      imageUrl: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600'
    },
    {
      brand: 'Cartier',
      model: 'Santos',
      reference: 'WSSA0018',
      size: 39,
      material: 'Steel',
      price: 720000, // $7,200.00
      imageUrl: 'https://images.unsplash.com/photo-1653403759472-88eba505a8fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600'
    },
    {
      brand: 'IWC',
      model: 'Portugieser Chronograph',
      reference: 'IW371605',
      size: 41,
      material: 'Rose Gold',
      price: 2650000, // $26,500.00
      imageUrl: 'https://images.unsplash.com/photo-1642391257337-fe241a4dc59a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600'
    },
    {
      brand: 'Jaeger-LeCoultre',
      model: 'Reverso Classic',
      reference: 'Q3858520',
      size: 45,
      material: 'Steel',
      price: 950000, // $9,500.00
      imageUrl: 'https://images.unsplash.com/photo-1629629852611-07ea7d5fec0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600'
    },
    {
      brand: 'Tudor',
      model: 'Black Bay Fifty-Eight',
      reference: 'M79030N-0001',
      size: 39,
      material: 'Steel',
      price: 370000, // $3,700.00
      imageUrl: 'https://images.unsplash.com/photo-1614521084980-811d04f6c6cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600'
    },
    {
      brand: 'Grand Seiko',
      model: 'Snowflake',
      reference: 'SBGA211',
      size: 41,
      material: 'Titanium',
      price: 580000, // $5,800.00
      imageUrl: 'https://images.unsplash.com/photo-1639332897094-bacbdbdcdaad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600'
    },
    {
      brand: 'Vacheron Constantin',
      model: 'Overseas',
      reference: '4500V/110A-B483',
      size: 41,
      material: 'Steel',
      price: 3100000, // $31,000.00
      imageUrl: 'https://images.unsplash.com/photo-1650270985701-f95a85081503?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600'
    }
  ];

  // Insert watches into the database
  try {
    const insertedWatches = await db.insert(watches).values(watchData).returning();
    console.log(`Successfully inserted ${insertedWatches.length} watches.`);
  } catch (error) {
    console.error('Error seeding watches:', error);
  }

  console.log('Done seeding watches.');
}

// Run the seed function
seedWatches()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error in seed script:', error);
    process.exit(1);
  });