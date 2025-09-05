import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    router = inject(Router);

    canActivate() {

        //Lendo a sessão do navegador
        const auth = sessionStorage.getItem('auth');

        //Verificando se não existe um usuário na sessão
        if (!auth) {
            //Redireciona para a página de login
            return this.router.parseUrl('/autenticar-usuario');
        }

        try {

            //Descriptografar os dados
            const bytes = CryptoJS.AES.decrypt(auth, 'auth');
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            const usuario = JSON.parse(decryptedData);

            //Calculando as datas
            const agora = new Date();
            const expiracao = new Date(usuario.dataHoraExpiracao);

            //Verificando se o token expirou
            if (expiracao < agora) {
                //Apagar os dados do usuário da sessão
                sessionStorage.removeItem('auth');
                //Redireciona para a página de login
                return this.router.parseUrl('/autenticar-usuario');
            }

            return true; // acesso liberado

        } catch (e) {
            sessionStorage.removeItem('auth');
            return this.router.parseUrl('/autenticar-usuario');
        }
    }
}
