# Simulador del Mundial 2026

## Resumen

Herramienta interactiva para crear un pronóstico completo del Mundial 2026. Permite ordenar clasificados por grupo, elegir los mejores terceros, avanzar por la fase eliminatoria, definir un campeón y compartir o descargar una tarjeta final del resultado. Incluye autocompletado de grupos mediante un modelo balanceado y fichas de equipo con estadísticas de rendimiento tomadas como referencia de 365Scores.

## Funcionalidades Principales

- Selección manual de los 3 clasificados por cada grupo.
- Simulación automática de fase de grupos.
- Selección de los 8 mejores terceros.
- Construcción automática del cuadro eliminatorio.
- Selección manual de ganadores en cada ronda.
- Pantalla final de campeón con camino al título.
- Opciones para compartir, copiar URL y descargar una imagen del campeón.
- Fichas de equipo con estadísticas de ataque, defensa, posesión, balón parado y disciplina.
- Diseño responsive para desktop y mobile.

## Flujo De Uso

1. **Fase de grupos**
   El usuario selecciona los 3 equipos que avanzan en cada grupo, en orden de posición.

2. **Simular grupos**
   El botón `Simular grupos` autocompleta la fase de grupos con una proyección balanceada. El usuario puede editar cualquier selección después.

3. **Mejores terceros**
   Luego se eligen los 8 mejores terceros entre los 12 equipos que quedaron en tercera posición.

4. **Fase eliminatoria**
   El sistema arma las llaves y el usuario selecciona el ganador de cada partido hasta llegar a la final.

5. **Campeón**
   Al elegir el ganador de la final, se muestra una pantalla de celebración con el campeón y su camino al título.

## Simulación Automática

La simulación usa un índice interno de fuerza por selección (`TEAM_STRENGTH`) y le aplica una variación aleatoria controlada. Esto genera un resultado balanceado: favorece a los equipos más fuertes, pero permite cierto margen de sorpresa.

La simulación:

- Ordena los equipos de cada grupo por puntaje estimado.
- Selecciona automáticamente los 3 primeros.
- No bloquea la edición manual posterior.

## Fichas De Equipo

Cada equipo en la fase de grupos tiene un botón `Datos`, identificado con un ícono de información.

La ficha muestra:

- Nombre del equipo y grupo.
- Perfil competitivo según el índice del simulador.
- Índice del simulador.
- Estadísticas disponibles del equipo:
  - Goles por partido.
  - Goles recibidos por partido.
  - Porterías a cero.
  - Posesión del balón.
  - Corners por partido.
  - Penaltis convertidos.
  - Penaltis cometidos.
  - Tarjetas rojas.
  - Tarjetas amarillas.

Si no hay estadísticas disponibles para una selección, la herramienta muestra:

> No hay estadísticas de equipo disponibles para esta selección por el momento.

## Fuente Estadística

Las estadísticas de equipo están basadas en la información proporcionada desde:

https://www.365scores.com/es/football/league/fifa-world-cup-5930/stats *

*NOTA: La herramienta no muestra cuotas ni probabilidades de apuestas en las fichas de equipo.

## Compartir Resultado

En la pantalla final de campeón, el usuario puede:

- Compartir usando la API nativa del navegador, si está disponible.
- Copiar la URL.
- Descargar una imagen tipo tarjeta social con el campeón y su camino al título.

La imagen descargable se genera con `html2canvas`.

## Diseño Y Experiencia

La interfaz usa una estética editorial deportiva:

- Fondo oscuro con textura visual.
- Acentos lime, dorado y colores secundarios controlados.
- Tipografía Plus Jakarta Sans.
- Header con logo RPP.
- Transiciones suaves.
- Celebración final con burst dorado y destellos.

## Estructura Técnica

Archivos principales:

- `src/app.jsx`: lógica principal, datos del torneo, componentes y flujo.
- `src/styles.css`: estilos globales, UI, responsive y animaciones.
- `src/main.jsx`: entrada de React e importación de fuente local.
- `public/flags`: banderas de selecciones.
- `public/img/logo_rpp.svg`: logo usado en el header.

## Dependencias Relevantes

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

Levantar servidor local:

```bash
npm run dev
```

Generar build de producción:

```bash
npm run build
```

Previsualizar build:

```bash
npm run preview
```

## Notas Funcionales

- El usuario puede modificar manualmente cualquier predicción simulada.
- La fase eliminatoria avanza automáticamente cuando todos los partidos de una ronda tienen ganador.
- Si se cambia un ganador que alimentaba rondas posteriores, la herramienta limpia resultados dependientes para evitar inconsistencias.
- La pantalla final se activa después de elegir el ganador de la final.
