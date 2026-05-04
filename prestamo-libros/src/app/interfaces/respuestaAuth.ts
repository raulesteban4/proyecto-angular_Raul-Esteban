export interface RespuestaAuth {
  message: string;
  token?: string;
  usuario?: {
    codigo: string;
    nombre: string;
    email: string;
    perfil?: string;
  };
}
