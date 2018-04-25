import { Component, OnInit, ViewChild } from '@angular/core';
import { MheadermenuServices } from './mheadermenu.services';
import { ParseLinks, PesanService, HandleErrorService } from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap';

import { Mheadermenu } from './';

@Component({
  selector: 'app-mheadermenu',
  templateUrl: './mheadermenu.component.html',
  styleUrls: ['./mheadermenu.component.css']
})
export class MheadermenuComponent implements OnInit {

  mheadermenus:Mheadermenu[];
  totalItems:number;
  queryCount:number;
  links:any;
  itemsPerPage:number;
  pilihPages: number[];
  predicate:string;
  reverse:string;
  nomor:number;
  page:number;
  option:any;
  listOptions:any;
  paramCari:string;
  param:string;
  idModal:string;
  previousPage:number;

  @ViewChild('childModal') childModal: ModalDirective;

  constructor(
    private mheadermenuServices:MheadermenuServices,
    private parseLinks:ParseLinks,
    private pesanService:PesanService,
    private handleErrorService:HandleErrorService
  
  ) { }

  ngOnInit() {
    this.init();
  }

  init(){
    this.itemsPerPage = 5;
    this.pilihPages = [5, 10, 20];
    this.predicate = 'kode';
    this.reverse = 'asc';
    this.nomor = 1;
    this.page = 1;
    this.previousPage = this.page;
    this.option = {id : 0};
    this.paramCari = ""; 
    this.listOptions = [{ id: 0, name: "Semua Kategori" },
                        { id: 1, name: "Kode" },
                        { id: 2, name: "Uraian" }
                      ];      
  }

  reset(){
    this.nomor = 1;
    this.page = 1;
    this.predicate = 'kode';
    this.reverse = 'asc';
    this.mheadermenus = undefined;
    this.previousPage = this.page;
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    return result;
  }

  onSuccess(data, headers){
    this.links = this.parseLinks.parse(headers.get("link"));
    this.totalItems = headers.get('X-Total-Count');
    this.queryCount = this.totalItems;
    this.mheadermenus = data;
  }

  onError(error){
    this.handleErrorService.handleError(error, "Pesan: Pencarian, Data Tidak Ada !");
  }

  pilihPencarian(){
     switch(this.option.id){
       case 0 :{
          this.cariSemua();
          break;
       }
       case 1 :{
          this.cariLikeKode();
          break;
       }
       case 2 :{
          this.cariLikeUraian();
          break;
       }
       default:{
          break;
       }
     }
  }

  cari(){
    this.reset();
    this.pilihPencarian();
  }

  cariSemua(){
    this.mheadermenuServices.query({
      page : this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort()
    }).subscribe(
      res=>this.onSuccess(res.body, res.headers),
      error=>this.onError(error));
  }

  cariLikeKode(){

    if(!this.paramCari){ return; };

    this.mheadermenuServices.queryLikeKode({
      page : this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort()},
      this.paramCari
    ).subscribe(
      res=>this.onSuccess(res.body, res.headers),
      error=>this.onError(error));
  }
  
  cariLikeUraian(){
    if(!this.paramCari){ return; };

    this.mheadermenuServices.queryLikeUraian({
      page : this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort()},
      this.paramCari
    ).subscribe(
      res=>this.onSuccess(res.body, res.headers),
      error=>this.onError(error));
  }

  openDeleteConfirm(id:string, kode:string): void {
    this.param = kode;
    this.idModal = id;
    this.childModal.show();
  }
 
  decline(): void {
    this.childModal.hide();
  }

  delete(){
    this.mheadermenuServices.delete(this.idModal)
    .subscribe(
      x=>{
      this.cari();
      this.pesanService.addByTipe("info",  "Pesan!!, Data Berhasil Dihapus")
    },
      e=>{
        this.handleErrorService.handleError(e, "Pesan!! : hapus, Data Gagal Dihapus");
    });

    this.childModal.hide();
  }

  pageChanged(event: any): void {
    if (event.page != this.previousPage){
      this.previousPage = event.page;
      this.page = event.page;
      this.nomor = (this.page - 1) *  this.itemsPerPage + 1;
      this.pilihPencarian();
    }
  }

}