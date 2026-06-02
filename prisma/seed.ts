import "dotenv/config";

import { PrismaClient, Role } from "../generated/prisma/client";
import { createPrismaClient } from "../src/shared/lib/create-prisma-client";

const prisma: PrismaClient = createPrismaClient();

const STEPS_COUNT = 10;

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

  for (let i = 1; i <= STEPS_COUNT; i++) {
    const step = await prisma.step.upsert({
      where: { order: i },
      update: {},
      create: {
        order: i,
        title: `Шаг ${i} — тестовый`,
        subtitle: "Тестовый подзаголовок",
        isPublished: true,
      },
    });

    await prisma.block.deleteMany({ where: { stepId: step.id } });
    await prisma.block.createMany({
      data: [
        { stepId: step.id, order: 1, type: "HEADING", value: `Тема шага ${i}` },
        {
          stepId: step.id,
          order: 2,
          type: "TEXT",
          value:
            "Это учебный текст шага. Здесь будет размещено основное содержание урока.",
        },
        {
          stepId: step.id,
          order: 3,
          type: "ARABIC",
          value: "بِسْمِ اللَّهِ",
          translation: "Бисмиллях",
        },
        {
          stepId: step.id,
          order: 4,
          type: "HIGHLIGHT",
          value: "Важно запомнить: это ключевое правило данного шага.",
        },
      ],
    });
  }

  console.log("Seed завершён");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
