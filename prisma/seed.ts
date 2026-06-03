import "dotenv/config";

import { PrismaClient, Role } from "../generated/prisma/client";
import { createPrismaClient } from "../src/shared/lib/create-prisma-client";
import { lessonForStepOrder } from "./seed-lessons";

const prisma: PrismaClient = createPrismaClient();

const STEPS_COUNT = 555;
const SEED_BATCH_SIZE = 25;

async function main() {
  await prisma.user.upsert({
    where: { accessCode: "000000" },
    update: {},
    create: {
      name: "Супер-админ",
      accessCode: "000000",
      role: Role.SUPER_ADMIN,
    },
  });

  const teacher1 = await prisma.user.upsert({
    where: { accessCode: "111111" },
    update: {},
    create: { name: "Устаз Магомед", accessCode: "111111", role: Role.TEACHER },
  });

  await prisma.user.upsert({
    where: { accessCode: "222222" },
    update: {},
    create: {
      name: "Устаза Патимат",
      accessCode: "222222",
      role: Role.TEACHER,
    },
  });

  const studentCodes = ["100001", "100002", "100003", "100004"];
  const studentNames = [
    "Абдулла Магомедов",
    "Айша Алиева",
    "Умар Исмаилов",
    "Зайнаб Хасанова",
  ];

  for (let i = 0; i < 4; i++) {
    await prisma.user.upsert({
      where: { accessCode: studentCodes[i] },
      update: {},
      create: {
        name: studentNames[i],
        age: 14 + i,
        accessCode: studentCodes[i],
        role: Role.STUDENT,
        teacherId: teacher1.id,
      },
    });
  }

  console.log(`Создание ${STEPS_COUNT} уроков (10 шаблонов по кругу)...`);

  for (let start = 1; start <= STEPS_COUNT; start += SEED_BATCH_SIZE) {
    const end = Math.min(start + SEED_BATCH_SIZE - 1, STEPS_COUNT);

    for (let order = start; order <= end; order++) {
      const lesson = lessonForStepOrder(order);

      const step = await prisma.step.upsert({
        where: { order },
        update: {
          title: lesson.title,
          subtitle: lesson.subtitle,
          isPublished: true,
        },
        create: {
          order,
          title: lesson.title,
          subtitle: lesson.subtitle,
          isPublished: true,
        },
      });

      await prisma.block.deleteMany({ where: { stepId: step.id } });
      await prisma.block.createMany({
        data: lesson.blocks.map((block, index) => ({
          stepId: step.id,
          order: index + 1,
          type: block.type,
          value: block.value ?? null,
          imageUrl: block.imageUrl ?? null,
          caption: block.caption ?? null,
          translation: block.translation ?? null,
        })),
      });
    }

    console.log(`  шаги ${start}–${end} готовы`);
  }

  console.log("Seed завершён");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
