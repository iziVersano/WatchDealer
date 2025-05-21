import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../shared/schema';

// Create SQLite database and tables
async function main() {
  console.log('Creating SQLite database and tables...');
  
  const sqlite = new Database('dev.db');
  const db = drizzle(sqlite, { schema });
  
  console.log('Creating tables directly...');
  
  // Create users table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      google_id TEXT UNIQUE,
      role TEXT NOT NULL DEFAULT 'dealer',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create watches table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS watches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      reference TEXT NOT NULL,
      size REAL NOT NULL,
      material TEXT NOT NULL,
      price INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create favorites table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      watch_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (watch_id) REFERENCES watches(id) ON DELETE CASCADE
    )
  `);
  
  console.log('Database schema created successfully!');
  
  // Insert a default admin user
  try {
    console.log('Adding default admin user...');
    
    const existingUser = db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'admin@watchdealer.com')
    });
    
    if (!existingUser) {
      sqlite.exec(`
        INSERT INTO users (username, email, password, role)
        VALUES ('admin', 'admin@watchdealer.com', '$2b$10$zsPLJAHEpIxhGrNwGm7r7OyLEPQo4.6hPrIBzGc6qglWw2nJpTYmm', 'admin')
      `);
      console.log('Default admin user created: admin@watchdealer.com / password');
    } else {
      console.log('Default admin user already exists');
    }
    
    // Insert some sample watches
    console.log('Adding sample watches...');
    
    const watchCount = db.select().from(schema.watches).all().length;
    
    if (watchCount === 0) {
      const sampleWatches = [
        {
          brand: 'Rolex',
          model: 'Submariner',
          reference: '126610LN',
          size: 40,
          material: 'Steel',
          price: 10000,
          imageUrl: 'https://content.rolex.com/dam/2022-11/upright-bba-with-shadow/m126610ln-0001.png'
        },
        {
          brand: 'Omega',
          model: 'Speedmaster',
          reference: '310.30.42.50.01.001',
          size: 42,
          material: 'Steel',
          price: 6500,
          imageUrl: 'https://www.omegawatches.com/media/catalog/product/cache/a5c37fddc1a529a1a44fea55d527b9a116f3738da3a2cc38006fcc613c37c391/o/m/omega-speedmaster-moonwatch-professional-co-axial-master-chronometer-chronograph-42-mm-31030425001001-l.png'
        },
        {
          brand: 'Patek Philippe',
          model: 'Nautilus',
          reference: '5711/1A-010',
          size: 40,
          material: 'Steel',
          price: 35000,
          imageUrl: 'https://hodinkee.imgix.net/uploads/images/1609362994427-tqt1l0cnbok-3fd54b5885c99d8f731ccc7f7350d13e/5711.jpg'
        }
      ];
      
      for (const watch of sampleWatches) {
        db.insert(schema.watches).values(watch).run();
      }
      
      console.log(`Added ${sampleWatches.length} sample watches`);
    } else {
      console.log(`Sample watches already exist (${watchCount} found)`);
    }
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
  
  console.log('Migration and seeding completed!');
  sqlite.close();
}

main().catch(console.error);