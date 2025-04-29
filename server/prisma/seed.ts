import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join, dirname, basename, extname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
    const modelNames = orderedFileNames.map((fileName) => {
        const modelName = basename(fileName, extname(fileName));
        return modelName.charAt(0).toUpperCase() + modelName.slice(1);
    });

    for (const modelName of modelNames) {
        const model: any = prisma[modelName as keyof typeof prisma];
        if (model) {
            await model.deleteMany({});
            console.log(`Cleared data from ${modelName}`);
        } else {
            console.error(
                `Model ${modelName} not found. Please ensure the model name is correctly specified.`
            );
        }
    }
}

async function main() {
    const dataDirectory = join(__dirname, "seedData");

    const orderedFileNames = [
        "products.json",
        "expenseSummary.json",
        "sales.json",
        "salesSummary.json",
        "purchases.json",
        "purchaseSummary.json",
        "users.json",
        "expenses.json",
        "expenseByCategory.json",
    ];

    await deleteAllData(orderedFileNames);

    for (const fileName of orderedFileNames) {
        const filePath = join(dataDirectory, fileName);
        const jsonData = JSON.parse(readFileSync(filePath, "utf-8"));
        const modelName = basename(fileName, extname(fileName));
        const model: any = prisma[modelName as keyof typeof prisma];

        if (!model) {
            console.error(`No Prisma model matches the file name: ${fileName}`);
            continue;
        }

        for (const data of jsonData) {
            await model.create({
                data,
            });
        }

        console.log(`Seeded ${modelName} with data from ${fileName}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
