This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
````markdown
# AlfredIA (Expo / React Native)

Aplicación móvil construida con [Expo](https://expo.dev) y React Native que replica el tablero inteligente AlfredIA con navegación por pestañas, agenda, alarmas, recomendaciones y centro de notificaciones.

## Requisitos

- Node.js 18+ y npm
- [Expo Go](https://expo.dev/client) en tu dispositivo móvil o un emulador Android/iOS configurado

## Instalación

```powershell
npm install
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo Expo (presiona `a` para Android, `i` para iOS, `w` para web). |
| `npm run android` | Compila y ejecuta la app en un dispositivo/emulador Android. |
| `npm run ios` | Compila y ejecuta la app en un simulador iOS (macOS). |
| `npm run web` | Ejecuta la versión web usando Expo. |
| `npm run lint` | Analiza el código con ESLint (configuración oficial de Expo). |

## Estructura

```
.
├── App.tsx                 # Punto de entrada Expo
├── app.json                # Configuración del proyecto Expo
├── src/
│   ├── navigation/         # Stack y bottom tabs (RootNavigator)
│   ├── screens/            # Pantallas Inicio, Agenda, Alarmas, Alfred, Mapa, Notificaciones, Configuración
│   └── theme/              # Tokens de color y espaciado
└── README.md
```

## Notas

- El diseño utiliza componentes nativos (ScrollView, Pressable, Switch, etc.) y una capa de tema simple (`COLORS`, `SPACING`).
- Las pantallas de Agenda, Alarmas, Alfred y Mapa se acceden desde el tab "Principal" mediante un stack interno.
- Puedes personalizar iconos y activos agregando recursos dentro de `assets/` y actualizando `app.json`.

## Próximos pasos sugeridos

- Sustituir los datos mock por servicios reales (calendario, alarmas, GPS, etc.).
- Conectar un backend o storage local para persistir configuraciones y estado de notificaciones.
````
