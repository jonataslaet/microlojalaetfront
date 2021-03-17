import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CidadeDTO } from '../../models/cidade.dto';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeService } from '../../services/domain/cidade.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { EstadoService } from '../../services/domain/estado.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  cidades: CidadeDTO[];
  estados: EstadoDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuider: FormBuilder,
    public cidadeService : CidadeService,
    public estadoService: EstadoService,
    public clienteService: ClienteService,
    public alertCtrl: AlertController) {
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


  ionViewDidLoad(){
    this.estadoService.findAll().subscribe(response => {
      this.estados = response;
      this.formGroup.controls.estadoId.setValue(this.estados[0].id);
      this.updateCidades();
    },
    error => {}
    )
  }

  updateCidades(){
    let estado_id = this.formGroup.value.estadoId;
    this.cidadeService.findAll(estado_id).subscribe(response => {
      this.cidades = response;
      this.formGroup.controls.cidadeId.setValue(null);
    },
    error => {}
    );
  }

  signupUser(){
    this.clienteService.insert(this.formGroup.value).subscribe(response => {
      this.showInsertOk();
    },
    error => {}
    );
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso',
      message: 'Cadastro efetuado com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }
}
