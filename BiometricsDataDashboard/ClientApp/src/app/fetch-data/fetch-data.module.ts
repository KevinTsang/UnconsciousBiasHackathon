import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MedicalDataComponent } from './medical-data/medical-data.component';
import { FetchDataComponent } from './fetch-data.component';


@NgModule({
    declarations: [
        MedicalDataComponent,
    ],
    imports: [
        MedicalDataComponent
    ],
})
export class FetchDataModule { }
