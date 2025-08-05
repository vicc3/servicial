export interface User {
    uid: string;
    nombreCompleto: string;
    email: string;
    telefono: string;
    ciudadRegion: string;
    role: 'user' | 'worker';
    createdAt: any;
}