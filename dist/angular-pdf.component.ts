/*! Angular-PDF Version: 1.3.0 | Released under an MIT license */
/* Converted to angular2 by Roman Viskin */

import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'ng-pdf',
    styleUrls: ['app/angular-pdf.component.css'],
    templateUrl: 'app/angular-pdf.component.html'
})
export class PdfJsComponent implements OnInit, AfterViewInit {

    //@ViewChild('element') elementRef: ElementRef;
    @Input() boundingElement: HTMLElement;

    @ViewChild('pdfCanvas') canvasRef: ElementRef;
    canvas: HTMLCanvasElement;

    private _pageNum: number;
    public get pageNum(): number {
        return this._pageNum;
    }

    @Input() page: number;
    
    public scroll: number;

    private _pdfUrl: string
    @Input() public get pdfUrl(): string {
        return this._pdfUrl;
    }

    @Input() scale: number | string;

    public pageCount: number;

    pageToDisplay: number;

    private pdfDoc: PDFDocumentProxy = null;

    private ctx: CanvasRenderingContext2D = null;

    private pageFit: boolean = false;

    private renderTask: PDFRenderTask = null;

    private pdfLoaderTask: PDFPromise<PDFDocumentProxy> = null;

    @Input() debug = false;

    @Input() usecredentials: boolean;

    public httpHeaders;

    ngOnInit() {
    }

    ngAfterViewInit() {
        //TODO
        //element.css('display', 'block');
        //var httpHeaders = scope.httpHeaders;

        //this.element = this.elementRef.nativeElement;
        this.canvas = this.canvasRef.nativeElement;

        this.pageToDisplay = isFinite(this.page) ? this.page : 1;
        this.pageFit = this.scale === 'page-fit';

        this.scale = this.scale > 0 ? this.scale : 1;
        this.ctx = this.canvas.getContext('2d');

        PDFJS.disableWorker = true;

        this.pageNum = this.pageToDisplay
    }

    onResize(event: UIEvent) {
        let target = <Window>event.target;
        this.scroll = target.scrollY;
    }

    private backingScale(canvas: HTMLCanvasElement) {
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    }

    private setCanvasDimensions(canvas: HTMLCanvasElement, w, h) {
        var ratio = this.backingScale(canvas);
        canvas.width = Math.floor(w * ratio);
        canvas.height = Math.floor(h * ratio);
        canvas.style.width = Math.floor(w) + 'px';
        canvas.style.height = Math.floor(h) + 'px';
        canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
        return canvas;
    }

    private clearCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    public renderPage(num: number) {
        if (this.renderTask) {
            //TODO: _internalRenderTask not defined in definitely typed
            this.renderTask._internalRenderTask.cancel();
        }
        this.pdfDoc.getPage(num).then((page) => {
            var viewport: PDFPageViewport;
            var pageWidthScale: number;
            var pageHeightScale: number;
            var renderContext: PDFRenderParams;

            if (this.pageFit) {
                viewport = page.getViewport(1);
                var clientRect = this.boundingElement.getBoundingClientRect();
                pageWidthScale = clientRect.width / viewport.width;
                this.scale = pageWidthScale;
            }
            viewport = page.getViewport(<number>this.scale)

            this.setCanvasDimensions(this.canvas, viewport.width, viewport.height);

            renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };

            this.renderTask = page.render(renderContext);

            this.renderTask.then(() => {
                this.pageRender.emit(null);
            }, (reason) => {
                console.log(reason);
            });
        });
    }

    public goPrevious() {
        if (this.pageToDisplay <= 1) {
            return;
        }
        this.pageToDisplay = this.pageToDisplay - 1;
        this.pageNum = this.pageToDisplay;
    }

    public goNext() {
        if (this.pageToDisplay >= this.pdfDoc.numPages) {
            return;
        }
        this.pageToDisplay = this.pageToDisplay + 1;
        this.pageNum = this.pageToDisplay;
    }

    public zoomIn() {
        this.pageFit = false;
        this.scale = <number>this.scale + 0.2;
        this.renderPage(this.pageToDisplay);
        return this.scale;
    }

    public zoomOut() {
        this.pageFit = false;
        this.scale = <number>this.scale - 0.2;
        this.renderPage(this.pageToDisplay);
        return this.scale;
    }

    public fit() {
        this.pageFit = true;
        this.renderPage(this.pageToDisplay);
    }

    public changePage() {
        this.renderPage(this.pageToDisplay);
    }

    public rotate() {
        if (this.canvas.getAttribute('class') === 'rotate0') {
            this.canvas.setAttribute('class', 'rotate90');
        } else if (this.canvas.getAttribute('class') === 'rotate90') {
            this.canvas.setAttribute('class', 'rotate180');
        } else if (this.canvas.getAttribute('class') === 'rotate180') {
            this.canvas.setAttribute('class', 'rotate270');
        } else {
            this.canvas.setAttribute('class', 'rotate0');
        }
    }

    private renderPDF() {
        this.clearCanvas();

        var params: PDFSource = {
            'url': this.pdfUrl,
            //TODO: withCredentials not defined in definitely typed
            'withCredentials': this.usecredentials
        };

        if (this.httpHeaders) {
            params.httpHeaders = this.httpHeaders;
        }

        if (this.pdfUrl && this.pdfUrl.length) {
            this.pdfLoaderTask = PDFJS.getDocument(params, null, null, (progressData: PDFProgressData) => this.progress.emit(progressData));
            this.pdfLoaderTask.then(
                (_pdfDoc) => {
                    this.loaded.emit(null);

                    this.pdfDoc = _pdfDoc;
                    this.renderPage(this.pageToDisplay);
                    this.pageCount = _pdfDoc.numPages;
                }, (error) => {
                    if (error) {
                        this.error.emit(error);
                    }
                }
            );
        }
    }

    public set pageNum(newVal: number) {
        this._pageNum = newVal;
        this.pageToDisplay = newVal;
        if (this.pdfDoc !== null) {
            this.renderPage(this.pageToDisplay);
        }
    }

    public set pdfUrl(newVal: string) {
        this._pdfUrl = newVal;
        if (newVal !== '') {
            if (this.debug) {
                console.log('pdfUrl value change detected: ', this.pdfUrl);
            }
            this.pageNum = this.pageToDisplay;
            if (this.pdfLoaderTask) {
                //TODO: destroy() not defined in definitely typed
                this.pdfLoaderTask.destroy().then(() => {
                    this.renderPDF();
                });
            } else {
                this.renderPDF();
            }
        }
    }

    @Output() loaded: EventEmitter<any> = new EventEmitter();

    @Output() progress: EventEmitter<PDFProgressData> = new EventEmitter<PDFProgressData>();

    @Output() error: EventEmitter<any> = new EventEmitter();

    @Output() pageRender: EventEmitter<any> = new EventEmitter();

}

