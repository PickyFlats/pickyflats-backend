import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ForbiddenExceptionFilter } from './common/filters/forbidden-exception.filter';
// import { ChatIoAdapter } from './modules/chat/chat.adapter'; //! chat socket auth wip

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'], //
  });
  app.enableCors();
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  // app.useWebSocketAdapter(new ChatIoAdapter(app));
  await app.listen(3000);
}
bootstrap();
