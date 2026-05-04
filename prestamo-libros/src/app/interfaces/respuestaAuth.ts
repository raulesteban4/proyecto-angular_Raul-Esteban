export interface RespuestaAuth {
  message: string;
  // opcionalmente otros datos
  usuario?: {
    codigo: string;
    nombre: string;
    email: string;
  };
}
