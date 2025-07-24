
import {GoogleGenAI, LiveServerMessage, Modality, Session, Type} from '@google/genai';
import {createBlob, decode, decodeAudioData} from './utils.ts';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image: string | null;
  guidelines: string | null;
  features: any[];
  tags: any[];
  rating: number;
  in_stock: boolean;
  related_products: any[];
  interactions_count: number;
  created_at: string;
  updated_at: string;
  embedding?: number[]}; // Optional field for embedding
;
  

export class GdmLiveAudio {
  private client: GoogleGenAI;
  private session: Session;
  private inputAudioContext = new (window.AudioContext )({sampleRate: 16000});
  private outputAudioContext = new (window.AudioContext )({sampleRate: 24000});
  private inputNode = this.inputAudioContext.createGain();
  private outputNode = this.outputAudioContext.createGain();
  private nextStartTime = 0;
  private mediaStream: MediaStream;
  private sourceNode: MediaStreamAudioSourceNode | null;
  private scriptProcessorNode: ScriptProcessorNode;
  private sources = new Set<AudioBufferSourceNode>();
  private products: Product[] = [];
  private productsInfo; 

  constructor() {
    const apiKey = '' // ponga su api key
    this.client = new GoogleGenAI({ apiKey});
    this.outputNode.connect(this.outputAudioContext.destination);
  }

  async live() {
    if (this.products.length === 0){
      await this.fetchProducts();
    }
    await this.initSession();
    await this.startRecording();

  }

  private async initSession() {
    const model = 'gemini-2.0-flash-live-001';
    this.session = await this.client.live.connect({
      model,
      callbacks: {
        onopen: async() => {
          console.log('Conexion Establecida')
        },
        onmessage: async (message: LiveServerMessage) => {
          
          const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData;
          if (audio) {
            console.log('Reproduciendo audio ');
            this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(decode(audio.data), this.outputAudioContext, 24000, 1);
            const source = this.outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.outputNode);
            source.addEventListener('ended', () => this.sources.delete(source));
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            this.sources.add(source);
            console.log('Audio Finalizado');
          }

          const interrupted = message.serverContent?.interrupted;
          if (interrupted) {
            for (const source of this.sources.values()) {
              source.stop();
              this.sources.delete(source);
            }
            this.nextStartTime = 0;
          }
        },
        onerror: (e: ErrorEvent) => console.error('[Error]', e.message),
        onclose: (e: CloseEvent) => console.warn('[Sesion Cerrada]', e.reason),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: `Presentante como un asistente de compras para un marketplace llamado FutureMarket. Estos son los productos y su informacion disponible:\n${this.productsInfo}`,
        speechConfig: {
          languageCode: 'es-US',
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Orus' } }
        },
      },
    });
  }
  private async startRecording() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.sourceNode = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.inputNode);

      const bufferSize = 256;
      this.scriptProcessorNode = this.inputAudioContext.createScriptProcessor(bufferSize, 1, 1);

      this.scriptProcessorNode.onaudioprocess = (event) => {
        const pcmData = event.inputBuffer.getChannelData(0);
        this.session.sendRealtimeInput({ media: createBlob(pcmData) });
      };
    
      this.sourceNode.connect(this.scriptProcessorNode);
      this.scriptProcessorNode.connect(this.inputAudioContext.destination);

      console.log('[Grabacion] Comenzada');
    } catch (err) {
      console.error('[Error] Fallo al empezar a grabar', err);
      this.stopRecording();
    }
  }

  stopRecording() {
    if (this.scriptProcessorNode) this.scriptProcessorNode.disconnect();
    if (this.sourceNode) this.sourceNode.disconnect();
    if (this.mediaStream) this.mediaStream.getTracks().forEach(track => track.stop());
    this.session.close();
    this.scriptProcessorNode = null; 
    this.sourceNode = null;
    this.mediaStream = null;

    console.log('[Grabacion] Detenida');
  }

  async fetchProducts() {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name');
    
          if (error) throw error;
    
          this.products = data as Product[]|| [];
          console.log('Productos cargados:', this.products);
        }
        catch (err) {
        } 
        const textoProductos = this.products.map(p => {
        const descripcion = p.description ? p.description : 'Sin descripción';
        const stock = p.in_stock ? 'Disponible' : 'Agotado';
        const features = p.features.join(",")
        return `- ${p.name} (${p.category}) - $${p.price}. ${descripcion}. Estado: ${stock}. Guidelines: ${p.guidelines}. Features: ${features}. Rating: ${p.rating}`;
        }).join('\n');
        this.productsInfo = textoProductos;
      };
   
  reset() {
    this.session?.close();
    console.log('[Sesion] Reiniciada¬t');
  }
}
