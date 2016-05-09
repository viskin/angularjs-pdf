import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { PdfJsComponent } from './angular-pdf.component';

@Component({
    selector: 'my-ng-pdf',
    //styleUrls: ['app/angular-pdfjs-style.css'],
    templateUrl: 'app/my-angular-pdf.component.html',
    directives: [PdfJsComponent]
})
export class MyPdfJsComponent implements AfterViewInit {

    @ViewChild(PdfJsComponent) pdfComponent: PdfJsComponent;

    public pdfName = 'Relativity: The Special and General Theory by Albert Einstein'

    public pdfUrl = 'pdf/relativity.pdf'

    public scroll = 0

    public loading = 'loading'

    ngAfterViewInit() {
        this.pdfComponent.scroll = 0;
    }

    public getNavStyle(scroll: number) {
        let classes = {
            'pdf-controls': true,
            'fixed': scroll > 100
        };
        return classes;
    }

    public onError(error: any) {
        console.log(error);
    }

    public onLoad() {
        this.loading = '';
    }

    public onProgress(progressData: PDFProgressData) {
        console.log(progressData);
    }

    public onPageRender() {
    }

    public load(pdfUrl: string, pdfName: string) {
        this.pdfName = pdfName;
        if (this.pdfUrl !== pdfUrl) {
            this.loading = 'loading';
            this.pdfUrl = pdfUrl;
        }
    }

    //TODO: unbind

}