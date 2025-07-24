# Project info

El proyecto está desarrollado principalmente en node.js. Para clonar el proyecto y correrlo en su máquina local siga los siguientes pasos:


sh
# Paso 1: Clona el repositorio usando la URL del proyecto en Git.
git clone https://github.com/Granjis/marketplace-voice-agent.git

# Paso 2: Navega al directorio del proyecto.
cd marketplace-voice-agent

# Paso 3: Instala las dependencias necesarias.
npm i

#Paso 4: En el archivo useVoiceAgent.ts, asegurese de poner su API key de Google en el constructor 

# Paso 5: Inicia el servidor de desarrollo.
npm run dev




# Qué tecnologías se usaron para este proyecto:

## Programado usando los siguientes lenguajes y frameworks:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Integraciones:

### *Lovable*
La base del proyecto fue hecha con Lovable. Con esta plataforma se desarrolló la arquitectura de la aplicación y los detalles generales en especial de la parte visual que se le        despliega al usuario. La lógica básica de los componentes en pantalla también se realizó rápidamente usando lovable.

Debido a la falta de tiempo hay algunos elementos que no funcionan perfectamente. Algunos botones y la lógica detrás de esta presentan algunos errores pero nada critico que impida el correcto funcionamiento de la aplicación.

#### Hook VoiceAgent y Clase GdmLiveAudio(Se encuentra en el archivo useVoiceAgent.ts.)
El agente esta disponible en todas las vistas de la aplicación. Voice Agent se encarga de renderizar el boton que esta conectado a la lógica de la clase GdmLiveAudio. Está clase se encarga de todos los procesos del agente, conecta con el API Live, establece el envió de información bidireccional por medio del  webSocket, comienza o para la grabación de audio por parte del usuario, y reproduce las respuestas del modelo. También, aunque no muy eficientemente, carga la información de los productos para incorporarlos como contexto al modelo.

<img width="320" height="151" alt="Screenshot 2025-07-20 at 2 01 07 AM" src="https://github.com/user-attachments/assets/864f73f5-4c84-4c3a-9675-f08190668da7" />


### *SupaBase*
SupaBase ofrece el servicio de base de datos relacional. Existen 4 tablas: 
 
<img width="1006" height="247" alt="Screenshot 2025-07-20 at 1 16 17 AM" src="https://github.com/user-attachments/assets/121c1384-7adc-4a11-85f6-d4a02335b263" />

- La tabla cart corresponde al carrito de compras, cada usuario tiene asociado un carro, y su carro puede tener ninguno o multiples productos.
- El usuario puede ser de rol Admin y rol User. Admin tiene acceso al dashboard que presenta las estadisticas de los productos del MarketPlace. 
- La tabla producto cuenta con todos los campos del producto, la cantidad de interacciones y un campo para vectores donde van las representaciones vectoriales de los campos del producto. Son de tamaño 768. Generados por la misma Gemini API.
#### Autentificación
Supabase ofrece servicios para autentificación, dandonos la posiblidad de roles. Estas funcionalidades se  integraron con lo ya construido en *Lovable*, gracias a eso el Admin puede mirar el dashboard a diferencia del usuario corriente.

### *Gemini SDK Live*
La API de Live nos permite conectarnos y tener conversaciones en tiempo real con Gemini. No todos los modelos de Gemini soportan retorno de audio, por eso, para este proyecto se usó *gemini-2.0-flash-live-001*, que permite salida de audio nativo. Para tener la comunicación en tiempo real es necesario utilizar un WebSocket. El API de Live se encarga de esto, por lo que puede recibir información del micrófono de la máquina del usuario constantemente y responder a las peticiones. El agente de voz cuenta con el idioma español como predeterminado, aunque puede tanto hablar como entender cualquier idioma de los soportados por Live.

El agente tiene cierto contexto del marketplace y sus productos. Al inicializar un objeto de la clase GdmLiveAudio, carga los productos de la base de datos y los pasa como contexto por medio del System instructions. Esta aproximación presenta un problema fundamental: no es escalable cuando se maneja un gran número de datos, ya que los datos se están presentando en formato string.

Finalmente, la vectorización fue implementada, pero su código fue borrado para la versión entregada. La SDK de Gemini ofrece una función built-in para generar los vectores, así que no es necesario usar LangChain. Lamentablemente, no fue posible usar esta opción para generar los embeddings de la información de los productos por un límite en la cantidad de peticiones para el modelo que los generaba: *gemini-embedding-001*.

### *RAG*
Debido a la problemática de la generación de vectores, no se pudo implementar correctamente un RAG. El agente sí tiene un contexto, y cuenta con información propia del sitio, pero no puede acceder a ella en tiempo real. Solo recibe contexto cuando se establece la conexión con el Live API, y no es tan efectivo como podría ser porque recibe el contexto en texto plano en vez de los vectores.

## Consideraciones adicionales
La API Live está en desarrollo y presenta algunas fallas. A veces la conexión era un poco demorada, y el modelo podría llegar a tener respuestas inesperadas. Por ejemplo, en el video de demostración, el modelo pregunta qué quieren comprar tu esposa y tú, cuando no había ninguna razón para hacerlo. Sin embargo, la integración funciona y cumple con los objetivos del MVP.

Si presiona el botón y el agente no empieza a hablar, puede forzar el useEffect para que vuelva a establecer la conexión con el LiveAPI modificando en cualquier parte el archivo UseVoiceAgent.ts. Es un pequeño bug que viene de la implementación de Lovable.

[Video de demostración del funcionamiento de la aplicación](https://www.youtube.com/watch?v=dPx67QS0pM0)
