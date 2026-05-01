# Simulador del Mundial 2026

## Resumen

Aplicación interactiva para construir un pronóstico completo del Mundial 2026: fase de grupos, mejores terceros, llaves eliminatorias y campeón final. El producto está alineado visualmente con el ecosistema de RPP y `El Var del Saber`, incluye capas de patrocinio, pantalla final compartible y un sistema de interstitials configurables entre fases.

## Qué hace hoy

- Permite elegir manualmente los 3 clasificados de cada grupo.
- Permite auto-simular la fase de grupos.
- Permite seleccionar los 8 mejores terceros.
- Construye automáticamente el cuadro eliminatorio.
- Permite definir ganadores ronda por ronda hasta la final.
- Muestra una pantalla final de campeón con ruta al título.
- Permite compartir el resultado, copiar enlace, descargar imagen y prioriza WhatsApp en el cierre.
- Muestra fichas de equipo con estadísticas de referencia.
- Incluye patrocinio fijo en zona superior.
- Incluye interstitials publicitarios configurables entre fases.
- Incluye footer de ecosistema con enlaces a productos relacionados y propiedades RPP.

## Flujo principal

1. `Fase de grupos`
   El usuario ordena los 3 clasificados por grupo.

2. `Mejores terceros`
   El usuario define los 8 mejores terceros una vez completados los grupos.

3. `Eliminatorias`
   La app arma las llaves y el usuario elige ganadores hasta la final.

4. `Campeón`
   La app muestra el cierre editorial con la selección campeona, la ruta al título y acciones de compartir.

## Simulación automática

La simulación usa `TEAM_STRENGTH` como base interna de fuerza por selección y le suma una variación aleatoria controlada.

Actualmente se aplica en:

- `autoFillGroups`
- `autoFillBestThirds`

El resultado mantiene una lógica balanceada: favorece a selecciones más fuertes, pero deja espacio para sorpresas.

## Patrocinio y pauta

La app tiene dos capas de patrocinio:

### 1. Patrocinio fijo en zona superior

Se muestra como franja institucional debajo del stepper.

Configuración:

- Archivo: [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:155)
- Objeto: `TOP_SPONSOR`

Estructura actual:

```js
const TOP_SPONSOR = {
  label: 'Gracias a',
  logo: 'Logo sponsor'
};
```

Qué puede editar el equipo:

- `label`
- `logo`

Si se reemplaza por una imagen real:

- puede cambiarse `logo` por un `src`
- o adaptar `TopSponsorRibbon` para renderizar un `<img>`

Componente:

- `TopSponsorRibbon`
- referencia: [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:432)

Estilos:

- [src/styles.css](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/styles.css:450)

### 2. Interstitial publicitario entre fases

Se usa para inyectar una pausa publicitaria entre hitos del flujo, sin ensuciar la interfaz principal.

Componente:

- `InterstitialScreen`
- referencia: [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:443)

Configuración central:

- [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:159)
- objeto: `INTERSTITIAL_FLOWS`

Ejemplo:

```js
const INTERSTITIAL_FLOWS = {
  bestThird: {
    enabled: true,
    eyebrow: 'Espacio publicitario',
    body: 'Después de esta pauta sigues con la definición de los mejores terceros.',
    sponsor: 'Banner de patrocinante',
    format: 'video',
    duration: 10,
    cta: 'Continuar a mejores terceros'
  }
}
```

### Cómo mantener el interstitial

Toda la lógica está centralizada para que el equipo no tenga que tocar varias partes del flujo.

#### Activar o desactivar una transición

Modificar `enabled` dentro de `INTERSTITIAL_FLOWS`.

Ejemplo:

```js
champion: {
  enabled: false
}
```

Esto hace que la transición vaya directa, sin interstitial.

#### Cambiar en qué punto del flujo aparece

Las transiciones actualmente pasan por:

- `goBestThird` → `openInterstitial('bestThird')`
- `goKnockout` → `openInterstitial('knockout')`
- final de `pickWinner` → `openInterstitial('champion')`

Referencias:

- [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:252)
- [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:287)
- [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:333)

Si se quiere mover la pauta a otro punto del flujo:

1. crear una nueva clave en `INTERSTITIAL_FLOWS`
2. llamar `openInterstitial('<clave>')` en el momento deseado

#### Cambiar duración del countdown

Base global:

- `INTERSTITIAL_DEFAULT_DURATION`
- referencia: [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:147)

Duración por transición:

- `duration` dentro de cada clave de `INTERSTITIAL_FLOWS`

#### Cambiar formato de pauta

Propiedad:

- `format`

Valores usados hoy:

- `video`
- `box`

Impacta el tamaño del placeholder publicitario:

- `video` usa proporción tipo `16:9`
- `box` usa proporción `300x250`

#### Cambiar copy del interstitial

Propiedades editables por flujo:

- `eyebrow`
- `body`
- `cta`
- `sponsor`

#### Reemplazar el placeholder por pauta real

Hoy el placeholder muestra:

- `Banner de patrocinante`

Está renderizado dentro de:

- `interstitial-ad-surface`

Referencia:

- [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:462)

El equipo puede reemplazarlo por:

- un `<img>`
- un `iframe`
- un reproductor de video
- un componente de ad server

#### Comportamiento automático

El interstitial:

- inicia countdown al renderizarse
- reinicia el countdown al cambiar de flujo
- avanza automáticamente al llegar a `0`
- también permite continuar manualmente con botón

Lógica:

- [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:444)

Estilos:

- [src/styles.css](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/styles.css:358)

## Compartir y distribución

### End screen

La pantalla final prioriza el compartir.

Acciones actuales:

- `Compartir por WhatsApp`
- `Compartir` con Web Share API
- `Copiar enlace`
- `Descargar imagen`

Referencias:

- `shareWhatsApp`: [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:998)
- `shareNative`: [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:1003)
- `downloadImg`: [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:1031)

### Imagen compartible

La imagen descargable:

- está optimizada a formato vertical `9:16`
- usa composición editorial clara
- incluye campeón, ruta al título y branding RPP

Contenedor técnico:

- `#share-card`
- estilos: [src/styles.css](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/styles.css:1994)

Generación:

- `html2canvas`

## Footer de ecosistema

La app incluye footer con:

- `El Var del Saber`
- `Calculadora RPP Deportes`
- enlace a `RPP.pe`
- enlace a landing del especial
- copyright `© 2026 GRPP`

Configuración central de URLs:

- `ECOSYSTEM_LINKS`
- referencia: [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:149)

Componente:

- `SiteFooter`
- referencia: [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx:481)

Estilos:

- [src/styles.css](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/styles.css:500)

## Fichas de equipo

Cada equipo en grupos puede abrir una ficha `Datos`.

Muestra:

- nombre del equipo
- grupo
- perfil competitivo
- índice del simulador
- estadísticas disponibles

Incluye métricas como:

- goles por partido
- goles recibidos
- porterías a cero
- posesión
- corners
- penaltis
- disciplina

## Diseño y experiencia

La experiencia actual responde a estos principios:

- sistema visual claro alineado con RPP y `El Var del Saber`
- sin dark mode en el simulador
- patrocinio desacoplado de la tarea principal
- claridad funcional por encima de decoración
- cierre editorial fuerte en la pantalla de campeón
- responsive real en mobile y desktop

## Estructura técnica

Archivos principales:

- [src/app.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/app.jsx)
- [src/styles.css](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/styles.css)
- [src/main.jsx](/Users/diego/Documents/GitHub/simulador%20del%20mundial%202/src/main.jsx)
- `public/flags`
- `public/img/logo_rpp_original.svg`

## Dependencias

- React
- Vite
- Tailwind CSS
- html2canvas
- @fontsource-variable/plus-jakarta-sans

## Comandos

Instalar dependencias:

```bash
npm install
```

Levantar entorno local:

```bash
npm run dev
```

Build de producción:

```bash
npm run build
```

Preview de build:

```bash
npm run preview
```

## Notas de mantenimiento

- Si cambias una predicción que ya alimentaba rondas posteriores, la app limpia resultados dependientes automáticamente para evitar inconsistencias.
- Si vas a integrar pauta real, prioriza reemplazar solo el contenido interno del `interstitial-ad-surface`, no la lógica del interstitial.
- Para apagar temporalmente toda la pauta entre fases, basta con poner `enabled: false` en cada entrada de `INTERSTITIAL_FLOWS`.
- Para apagar la franja fija superior, basta con dejar de renderizar `TopSponsorRibbon` o vaciar `TOP_SPONSOR`.
