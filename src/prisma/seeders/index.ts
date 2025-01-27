import prisma from "../clients/indexPrisma.js";
import bcrypt from "bcrypt";

async function main(): Promise<void> {
  console.time("time: ");
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: "test1@test.com" },
    });

    if (existingUser) {
      console.log("Email already exists:", existingUser.email);
    } else {
      await prisma.user.create({
        data: {
          username: "kei1",
          email: "test1@test.com",
          password: bcrypt.hashSync("kei", 10),
        },
      });
    }
  } catch (e) {
    console.error("Error during seeding:", e);
    if (e instanceof Error) {
      console.error(e.message);
    }
  } finally {
    console.timeEnd("time: ");
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("Seeding completed.");
  })
  .catch((e: Error) => {
    console.error("Error during seeding:", e);
    console.error(e.message);
  });
