require("dotenv").config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : "",
});

import { AppModule } from "@/modules/app.module";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { initializeFirebase } from "./firebase-initialize";

function checkEnvs() {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
}

async function bootstrap() {
  checkEnvs();
  const app = await NestFactory.create(AppModule);
  initializeFirebase();
  const config = new DocumentBuilder()
    .setTitle("ICML Ensino")
    .setDescription("APIs para gerenciamento do ministério de ensino da IMCL")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  await app.listen(3000);
}
bootstrap();
