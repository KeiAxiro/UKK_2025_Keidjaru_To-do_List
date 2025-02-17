import prisma from "../clients/indexPrisma.js";
import bcrypt from "bcryptjs";

// async function main(): Promise<void> {
//   console.time("time: ");
//   try {
//     const existingUser = await prisma.user.findUnique({
//       where: { email: "kei@kei.com" },
//     });

//     if (existingUser) {
//       console.log("Email already exists:", existingUser.email);
//     } else {
//       await prisma.user.create({
//         data: {
//           username: "kei",
//           email: "kei@kei.com",
//           password: bcrypt.hashSync("kei", 10),
//         },
//       });
//     }
//   } catch (e) {
//     console.error("Error during seeding:", e);
//     if (e instanceof Error) {
//       console.error(e.message);
//     }
//   } finally {
//     console.timeEnd("time: ");
//     await prisma.$disconnect();
//   }
// }

// main()
//   .then(() => {
//     console.log("Seeding completed.");
//   })
//   .catch((e: Error) => {
//     console.error("Error during seeding:", e);
//     console.error(e.message);
//   });

async function seed() {
  const userId = "2d84d2d2-6cfa-4773-bee8-b313f191df68";

  const lists = await prisma.list.createMany({
    data: [
      {
        id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
        userId,
        name: "Belajar Backend",
        description: "Mengerjakan latihan Express.js dan Prisma",
        createdAt: new Date("2024-02-09T10:00:00.000Z"),
        updatedAt: new Date("2024-02-09T10:00:00.000Z"),
      },
      {
        id: "b2c3d4e5-f678-9012-3456-789abcdef012",
        userId,
        name: "Tugas Kuliah",
        description: "Menyelesaikan laporan PKL",
        createdAt: new Date("2024-02-08T08:30:00.000Z"),
        updatedAt: new Date("2024-02-08T08:30:00.000Z"),
      },
    ],
  });

  const tasks = await prisma.task.createMany({
    data: [
      {
        id: "t1b2c3d4-e5f6-7890-1234-56789abcdef1",
        listId: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
        title: "Setup Prisma",
        isCompleted: false,
        dueDate: new Date("2024-02-10T12:00:00.000Z"),
        createdAt: new Date("2024-02-09T10:10:00.000Z"),
        updatedAt: new Date("2024-02-09T10:10:00.000Z"),
      },
      {
        id: "t2c3d4e5-f678-9012-3456-789abcdef012",
        listId: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
        title: "Membuat API CRUD",
        isCompleted: true,
        dueDate: new Date("2024-02-09T18:00:00.000Z"),
        createdAt: new Date("2024-02-09T10:20:00.000Z"),
        updatedAt: new Date("2024-02-09T10:20:00.000Z"),
      },
      {
        id: "t3d4e5f6-7890-1234-5678-9abcdef01234",
        listId: "b2c3d4e5-f678-9012-3456-789abcdef012",
        title: "Revisi Laporan PKL",
        isCompleted: false,
        dueDate: new Date("2024-02-12T15:00:00.000Z"),
        createdAt: new Date("2024-02-08T08:45:00.000Z"),
        updatedAt: new Date("2024-02-08T08:45:00.000Z"),
      },
    ],
  });

  console.log("✅ Data dummy berhasil ditambahkan!");
}

seed()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
