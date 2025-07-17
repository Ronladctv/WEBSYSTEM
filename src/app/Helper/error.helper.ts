export function formatError(e: any): string {
    if (!e) return 'Error desconocido.';
    if (typeof e === 'string') return e;

    if (e.error?.message) return e.error.message;
    if (e.message) return e.message;
    if (e.status) return `Error ${e.status}: ${e.statusText || 'Error en la solicitud'}`;

    try {
        return JSON.stringify(e);
    } catch {
        return 'Error desconocido.';
    }
}
