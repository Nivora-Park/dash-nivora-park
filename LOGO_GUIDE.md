# 🎨 Panduan Mengubah Logo & Branding

## **📁 File yang Perlu Diubah:**
`src/config/branding.ts` - **SATU FILE SAJA!** 🎯

## **🚀 Cara Ganti Logo:**

### **1. Ganti ke Image Logo:**
```typescript
// Di src/config/branding.ts
logo: {
  type: 'image', // 👈 Ganti dari 'icon' ke 'image'
  
  image: {
    src: '/images/logo-anda.png', // 👈 Ganti path ke logo Anda
    alt: 'Logo Perusahaan Anda',
    width: 48,   // 👈 Sesuaikan ukuran
    height: 48,  // 👈 Sesuaikan ukuran
  },
}
```

### **2. Ganti ke Icon:**
```typescript
// Di src/config/branding.ts
logo: {
  type: 'icon', // 👈 Ganti dari 'image' ke 'icon'
  icon: 'building', // 👈 Pilih: 'car', 'building', 'parking', 'custom'
}
```

### **3. Ganti ke Text Only:**
```typescript
// Di src/config/branding.ts
logo: {
  type: 'text-only', // 👈 Hanya teks, tanpa logo
}
```

## **✏️ Cara Ganti Teks:**

### **1. Ganti Nama Perusahaan:**
```typescript
// Di src/config/branding.ts
company: {
  name: 'Nama Perusahaan Anda', // 👈 GANTI DISINI
  tagline: 'Tagline Perusahaan Anda', // 👈 GANTI DISINI
}
```

### **2. Ganti Warna:**
```typescript
// Di src/config/branding.ts
colors: {
  primary: '#10B981', // 👈 Ganti dari blue ke green
  secondary: '#059669',
}
```

## **📋 Contoh Lengkap:**

```typescript
export const BRANDING_CONFIG = {
  logo: {
    type: 'image', // 👈 Pakai image logo
    
    image: {
      src: '/images/logo-perusahaan.png', // 👈 Logo Anda
      alt: 'Logo Perusahaan',
      width: 64,
      height: 64,
    },
  },
  
  company: {
    name: 'Parking System Pro', // 👈 Nama baru
    tagline: 'Smart Parking Solution', // 👈 Tagline baru
  },
  
  theme: {
    primary: '#EF4444', // 👈 Warna merah
    secondary: '#DC2626',
  },
};
```

## **🖼️ Format Logo yang Didukung:**
- PNG (Recommended)
- JPG/JPEG
- SVG
- WebP

## **📏 Ukuran Logo yang Direkomendasikan:**
- **Small**: 32x32px
- **Medium**: 48x48px  
- **Large**: 64x64px

## **✅ Setelah Ganti:**
1. **Simpan file** `src/config/branding.ts`
2. **Restart server** (`npm run dev`)
3. **Refresh browser**

## **🎯 Tips:**
- Logo akan otomatis muncul di **Login Page** dan **Header Dashboard**
- Semua perubahan di **satu file** saja
- Tidak perlu edit file lain
- Mudah diubah kapan saja! 🚀

---
**💡 Contoh Cepat:**
Untuk ganti nama dari "Nivora Park" ke "Smart Parking":
```typescript
company: {
  name: 'Smart Parking', // 👈 Ganti ini saja!
}
```
