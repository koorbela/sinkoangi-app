# Az Egészség Konyhanyelven - Mobile App

Ez az alkalmazás megjeleníti a WordPress blog bejegyzéseit iOS-en és Androidon, a saját márkaszíneiddel.

## Expo SDK 54

- **Expo SDK**: 54.0.0
- **React**: 19.1.0
- **React Native**: 0.81.0

## Márkaszínek

- Fő kék (Phthalo blue): `#020887`
- Másodlagos zöld (Caribbean Current): `#00635D`
- Akcentszín piros: `#E3170A`
- Háttér világoskék (Alice Blue): `#DBE4EE`
- Sárga akcentszín: `#FFDD4A`

## Telepítés és futtatás

### 1. Töltsd le a mobile mappát a számítógépedre

### 2. Helyezd el a saját logódat
Cseréld le az `assets/logokerek.png` fájlt a saját logódra (kb. 200x200px ajánlott).

### 3. Telepítsd a függőségeket
```bash
cd mobile
npm install
```

### 4. Indítsd el az alkalmazást
```bash
npx expo start
```

### 5. iOS-en történő teszteléshez:
1. Töltsd le az **Expo Go** alkalmazást az App Store-ból
2. Olvasd be a terminálban megjelenő QR-kódot az iPhone kamerájával
3. Az alkalmazás automatikusan megnyílik az Expo Go-ban

## Képernyők

### Nyitóképernyő (Dashboard)
- Logó és üdvözlő szöveg
- 6 csempe 2x3 rácsban:
  - Főoldal, Szolgáltatások, Tanfolyamok (háttér: világoskék)
  - Blog (háttér: világoskék) - **működik, a blog listára visz**
  - Ajándék (háttér: sárga)
  - Belépés (háttér: zöld, fehér szöveg)
- A többi csempe "Hamarosan" üzenetet jelenít meg

### Blog lista
- Kártyás megjelenítés dátummal és kivonattal
- Pull to refresh
- Vissza gomb a főképernyőre

### Cikk részletek
- Teljes HTML tartalom megjelenítése
- Képek, címsorok, bekezdések, linkek
- Vissza gomb a listára

## Technológiák

- **Expo SDK 54** - React Native fejlesztői környezet
- **react-native-render-html** - HTML tartalom megjelenítése
- **TypeScript** - Típusbiztos fejlesztés

## API
Az alkalmazás közvetlenül a https://sinkoangi.hu/wp-json/wp/v2/posts végpontot használja.
