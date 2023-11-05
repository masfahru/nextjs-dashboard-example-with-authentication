const postgres = require("postgres");
const {
  invoices,
  customers,
  revenue,
  users,
} = require("../app/lib/placeholder-data.js");
const argon2 = require("argon2");

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  max: 1,
});

const argon2idConfig = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

async function seedUsers() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`DROP TABLE IF EXISTS users`;

    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    // eslint-disable-next-line no-undef
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await argon2.hash(user.password, argon2idConfig);
        return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedInvoices() {
  try {
    await sql`DROP TABLE IF EXISTS invoices`;

    const createTable = await sql`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    // eslint-disable-next-line no-undef
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error("Error seeding invoices:", error);
    throw error;
  }
}

async function seedCustomers() {
  try {
    await sql`DROP TABLE IF EXISTS customers`;

    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    // eslint-disable-next-line no-undef
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error("Error seeding customers:", error);
    throw error;
  }
}

async function seedRevenue() {
  try {
    await sql`DROP TABLE IF EXISTS revenue`;

    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    // eslint-disable-next-line no-undef
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error("Error seeding revenue:", error);
    throw error;
  }
}

async function seedSession() {
  try {
    await sql`DROP TABLE IF EXISTS sessions`;

    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS sessions
      (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        last_used_at TIMESTAMPTZ NOT NULL,
        browser_name VARCHAR(255),
        browser_version VARCHAR(255),
        os_name VARCHAR(255),
        os_version VARCHAR(255),
        device_vendor VARCHAR(255),
        device_model VARCHAR(255),
        device_type VARCHAR(255),
        user_ip VARCHAR(255)
      );
    `;

    console.log(`Created "sessions" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding "sessions":', error);
    throw error;
  }
}

(async () => {
  await seedUsers();
  await seedCustomers();
  await seedInvoices();
  await seedRevenue();
  await seedSession();
  await sql.end();
})();
