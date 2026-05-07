import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('🎬 Movie Marketplace API')
    .setDescription(
      `
## 🎬 Movie Marketplace — API Qo'llanma

Bu **Moviea** loyihasining backend API dokumentatsiyasi.

---

### 🗺️ API bo'limlari:

| Bo'lim | Maqsad |
|--------|--------|
| 🔓 **Auth** | Kirish va Ro'yxatdan o'tish |
| 🎬 **Movies** | Kinolar ro'yxati va CRUD |
| 🛡️ **Admin** | Foydalanuvchilarni boshqarish |
| 📊 **Dashboard** | Statistika va Kabinet |
| 👤 **Profile** | Shaxsiy sozlamalar |

---

### 👥 Rollar:

- 🛡️ **ADMIN** — To'liq nazorat
- 🏪 **SELLER** — Kino egalari / Distribyutorlar
- 👤 **USER** — Tomoshabinlar
      `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: '🎬 Movie API Docs',
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors();
  await app.listen(3002); // Portni 3002 qilamiz chunki 3000 va 3001 band
  console.log('🚀 Movie Marketplace: http://localhost:3002');
}
bootstrap();
