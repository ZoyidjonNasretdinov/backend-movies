# 🚀 NestJS Backend: Login, Register, Rollar va Sozlamalar

Ushbu qo'llanma o'quvchilar uchun login-register tizimi, rollar (RBAC), CORS va Swagger qanday ishlashini tushuntirib beradi.

---

## 1. Login va Register 🔐

### Register (Ro'yxatdan o'tish)
Foydalanuvchi ma'lumotlarini (ism, email, parol) bazaga saqlaymiz. Parollarni `bcrypt` bilan shifrlaymiz.
```typescript
// auth.service.ts da parol hash qilish:
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(body.password, salt);
```

### Login (Kirish)
Email va parolni tekshirib, foydalanuvchiga **JWT Token** beramiz. Token — bu foydalanuvchining backend bilan muloqot qilishi uchun "kalit".

---

## 2. Rollar (Admin, Seller, User) 🎭

Loyihada rollarni cheklash uchun **Guards** (Qo'riqchi) ishlatiladi.
*   **ADMIN**: Hamma narsaga ruxsat.
*   **SELLER**: Mahsulot/Kino qo'shish ruxsati.
*   **USER**: Ko'rish va sotib olish ruxsati.

**Ishlatish namunasi:**
```typescript
@Post()
@Roles(Role.SELLER, Role.ADMIN) // Faqat Seller va Admin kira oladi
@UseGuards(JwtAuthGuard, RolesGuard)
create(@Body() data: any) { ... }
```

---

## 3. CORS va Swagger 🌐

### CORS (Cross-Origin Resource Sharing)
Bu backendga qaysi saytlardan so'rov yuborish mumkinligini belgilaydi. Bizda:
*   `localhost` (programistlar uchun)
*   `*.vercel.app` (frontend deploy uchun)
*   `*.railway.app` (backend deploy uchun)
ruxsat etilgan.

### Swagger (API Dokumentatsiya)
Frontendchilar backendda qanday yo'llar (routes) borligini ko'rishlari uchun kerak. 
*   Manzil: `http://localhost:3000/docs`

---

## 4. Qanday ishga tushiriladi? 🛠️

1.  Zarur kutubxonalarni o'rnating: `npm install`
2.  Loyihani ishga tushiring: `npm run dev`
3.  Swaggerga kiring: `/docs`
4.  Register bo'ling va Login qilib token oling.
5.  Tokenni **Authorize** tugmasi orqali joylang.

---

> [!IMPORTANT]
> **Admin roli** bilan kirganingizda, siz foydalanuvchilarni boshqarish (delete/update) huquqiga ega bo'lasiz. Ehtiyot bo'ling!
