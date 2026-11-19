# Chamada Escolar

App de chamada da E.E. Profª Sueli da Silveira Marin Batista (Expo / React Native).
Backend em produção: **https://apiescola.monex.net.br**

## Gerar o APK (na nuvem, via EAS)

```bash
npm install
npm install -g eas-cli
eas login
eas init            # só na primeira vez (vincula o projeto à sua conta Expo)
npm run build:apk   # gera o .apk (perfil "preview")
```

Ao terminar, o EAS mostra um link/QR code para baixar o `.apk` e instalar no celular.

- Para publicar na Play Store: `npm run build:aab` (gera `.aab`).
- Build local (requer Android SDK + JDK 17): `npm run build:apk:local`.

## Desenvolvimento

```bash
npm start
```

Por padrão o app usa a API de produção. Para usar uma API local:

```bash
EXPO_PUBLIC_API_URL=http://SEU_IP:3333 npm start
```
