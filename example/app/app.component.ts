import {Component, OnInit, ViewChild, AfterViewInit} from 'angular2/core';
import {MyPdfJsComponent} from './my-angular-pdf.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [MyPdfJsComponent]
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild(MyPdfJsComponent) pdfComponent: MyPdfJsComponent;

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    public getPdf() {
        //this.pdfComponent.load("/api/pdf/relativity.pdf", "Relativity: The Special and General Theory by Albert Einstein")
    }

}