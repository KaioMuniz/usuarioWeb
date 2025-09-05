import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-criar-usuario',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './criar-usuario.html',
  styleUrl: './criar-usuario.css'
})
export class CriarUsuario {

  //Atributos
  mensagemSucesso = signal('');
  mensagemErro = signal('');

  //injeção de dependência
  http = inject(HttpClient);

  //estrutura do formulário
  form = new FormGroup({
    nome : new FormControl('', [Validators.required, Validators.minLength(8)]),
    email : new FormControl('', [Validators.required, Validators.email]),
    senha : new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),
    senhaConfirmacao : new FormControl('', [Validators.required]) //campo confirmação de senha
  });

  //função para executar o evento 'submit' do formulário
  onSubmit() {

    //limpar as mensagens exibidas
    this.mensagemSucesso.set('');
    this.mensagemErro.set('');

    //Verificar se as senhas estão diferentes
    if(this.form.value.senha != this.form.value.senhaConfirmacao) {
      this.mensagemErro.set('Senhas não conferem, por favor verifique.');
      return; //encerrar o método (função)
    }

    //enviando uma requisição para cadastrar um usuário na API
    this.http.post('http://localhost:8082/api/v1/usuario/criar', this.form.value)
      .subscribe({
        next: (response: any) => { //capturar resposta de sucesso da API
          this.mensagemSucesso.set(`Parabéns, ${response.nome}. Sua conta foi criada com sucesso.`);
          this.form.reset(); //limpar o formulário          
        },
        error: (e) => { //capturar a resposta de erro
          this.mensagemErro.set(e.error.erro);
        }
      });
  }
}
