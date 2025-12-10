import { db } from "./database.js";
import { usersTable } from "./schema.js";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("Seeding database...");

    await db.delete(usersTable);
    const salt = await bcrypt.genSalt(12);
    const seedUsers = [
      {
        email: "cassandre.yontailleux@gmail.com",
        firstname: "Cassandre",
        lastname: "Yon-Tailleux",
        password: await bcrypt.hash("Password1234", salt),
        role: "ADMIN",
      },
      {
        email: "maelys.joret@gmail.com",
        firstname: "Maëlys",
        lastname: "Joret",
        password: await bcrypt.hash("Password1234", salt),
        role: "ADMIN",
      },
      {
        email: "maelysandre.joretailleux@gmail.com",
        firstname: "Casselys",
        lastname: "Yonjoret",
        password: await bcrypt.hash("Password1234", salt),
      },
    ];
    const insertedUsers = await db
      .insert(usersTable)
      .values(seedUsers)
      .returning();

    console.log("Database seeded successfully !");
  } catch (err) {
    console.log("Seeding database error : ", err);
  }
}

seed();
