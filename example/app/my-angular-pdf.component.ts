import {Component} from 'angular2/core';
import {PdfJsComponent} from './angular-pdf.component';

export class MyPdfJsComponent extends PdfJsComponent {

    public pdfName = 'Relativity: The Special and General Theory by Albert Einstein'

    public pdfUrl = 'pdf/relativity.pdf'

    public scroll = 0

    public loading = 'loading'

    public getNavStyle(scroll: number) {
        if (scroll > 100) return 'pdf-controls fixed';
        else return 'pdf-controls';
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

    public load(pdfUrl: string, pdfName: string) {
        this.pdfName = pdfName;
        if (this.pdfUrl !== pdfUrl) {
            this.loading = 'loading';
            this.pdfUrl = pdfUrl;
        }
    }

    //TODO: unbind

}