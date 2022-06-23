import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  qualityList=["Brand New", "Second Hand", "refurbished"]
  productsForm !: FormGroup;
  actionBtn: string="Save";
  constructor(private formBuilder :FormBuilder,
    private api : ApiService,
      @Inject(MAT_DIALOG_DATA) public editData : any,
        private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
     this.productsForm=this.formBuilder.group({
       productName :['',Validators.required],
       category :['',Validators.required],
       quality :['',Validators.required],
       price :['',Validators.required],
       date :['',Validators.required],
       comment :['',Validators.required],
     });
    
     if(this.editData){
       this.actionBtn="Update";
      this.productsForm.controls['productName'].setValue(this.editData.productName);
      this.productsForm.controls['category'].setValue(this.editData.category);
      this.productsForm.controls['quality'].setValue(this.editData.quality);
      this.productsForm.controls['price'].setValue(this.editData.price);
      this.productsForm.controls['date'].setValue(this.editData.date);
      this.productsForm.controls['comment'].setValue(this.editData.comment);
     }
  }

  addProduct(){
    if(!this.editData){
      if(this.productsForm.valid){
        this.api.postProduct(this.productsForm.value)
        .subscribe({
          next:(res)=>{
            alert("Product added successfully");
            this.productsForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Error while adding this product")
          }
        })
      }
    }
    else{
      this.updateProduct()
    }
  }

  updateProduct(){
    this.api.putProduct(this.productsForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Product updated successfully");
        this.productsForm.reset();
        this.dialogRef.close("update");
      },
      error:()=>{
        alert("Unable to update information");
      }
    });
  }
}
