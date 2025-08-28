// server.mjs o server.ts
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context.mjs';

// Inicializa el motor Angular SSR
const angularAppEngine = new AngularAppEngine();

// Handler principal compatible con Netlify
export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext();

  // Ejemplo de endpoints API, descomenta y personaliza si los necesitas
  // const pathname = new URL(request.url).pathname;
  // if (pathname === '/api/menu') {
  //   return Response.json({ message: 'API funcionando' });
  // }

  // Manejo SSR Angular
  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

// Request handler que Netlify utiliza para SSR
export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
