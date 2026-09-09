import { Injectable } from '@nestjs/common';

import * as argon2 from 'argon2';
import type { Response } from 'express';

@Injectable()
export class AuthService {
  insertCookie(name: string, cookie: string, response: Response): void {
    response.cookie(name, cookie, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/auth', //envoi du cookie seulement sur les routes spécifiée par le path
      sameSite: 'strict', //controle quand le nav peut envoyer le cookie/ si clic depuis google par exemple on aura pas le cookie dans le cas de "strict"
      secure: false, // on envoi que du https si true/ prévoir variable .env pour production ou dev(pour dev doit etre false)
      httpOnly: true, // si false cookie lisible dans le front (navigateur); si true pas récupérable via js
      // signed: true, // verif si cookie altéré via signature
      // domain: 'monSite.com', //si différente app, spécifier si sous domaines; si pas de sous domaines pas besoin de spécifier
    });
  }

  async hash(data: string): Promise<string> {
    return argon2.hash(data);
  }

  async compare(hashed: string, notHashed: string): Promise<boolean> {
    const verif = await argon2.verify(hashed, notHashed);
    return verif;
  }

  extractTokenFromCookie(cookieHeader: string | null): string | undefined {
    if (!cookieHeader) throw new Error('No cookie');
    // Split the cookie header into individual cookies and find the one that starts with 'refreshToken='
    return cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('refreshToken='))
      ?.split('=')[1];
  }
}
