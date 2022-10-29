import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CurrencyModule } from './currency/currency.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './middleware/auth.milddleaware';
import { UserModule } from './user/user.module';
require('dotenv').config()

@Module({
  imports: [CurrencyModule, AuthModule,UserModule,TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +5432,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRESS_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: false,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  })],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
