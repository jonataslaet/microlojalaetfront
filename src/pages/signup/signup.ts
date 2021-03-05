import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuider: FormBuilder) {
      this.formGroup = this.formBuider.group({
        nome: ['Teste',[Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: ['teste@gmail.com',[Validators.required, Validators.email]],
        tipo: ['1',[Validators.required]],
        cpfOuCnpj : ['05510256389', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        senha: ['123',[Validators.required]],
        logradouro: ['Rua Teste',[Validators.required]],
        numero: ['273',[Validators.required]],
        complemento: ['Casa',[]],
        bairro: ['Neighbourhood',[]],
        cep: ['64017310',[Validators.required]],
        telefone1: ['32323973',[Validators.required]],
        telefone2: ['',[]],
        telefone3: ['',[]],
        estadoId:[null, [Validators.required]],
        cidadeId:[null, [Validators.required]]
      });
  }

  signupUser(){
    console.log('signupUser chamado');
  }
}
