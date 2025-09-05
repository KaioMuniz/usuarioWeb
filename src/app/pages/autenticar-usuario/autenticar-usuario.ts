import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-autenticar-usuario',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './autenticar-usuario.html',
  styleUrl: './autenticar-usuario.css'
})
export class AutenticarUsuario {

  //Atributos
  mensagemErro = signal('');

  //injeção de dependência
  http = inject(HttpClient);

  //estrutura do formulário
  form = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.email]),
    senha : new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  //função para executar o evento 'submit' do formulário
  onSubmit() {

    //limpar as mensagens
    this.mensagemErro.set('');

    //fazendo uma requisição para a API de usuários
    this.http.post('http://localhost:8082/api/v1/usuario/autenticar', this.form.value)
      .subscribe({
        next: (response: any) => { //capturar resposta de sucesso

          //criptografar os dados obtidos
          const dados = CryptoJS.AES.encrypt(JSON.stringify(response), 'auth').toString();

          //salvar os dados do usuário autenticado em uma sessão no navegador
          sessionStorage.setItem('auth', dados);
          
          //redirecionar para a página
          location.href = '#';
        },
        error: (e) => { //capturar resposta de erro
          this.mensagemErro.set(e.error.erro);
        }
      })
  }
}
