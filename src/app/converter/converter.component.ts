import { Component } from '@angular/core';
import {createWorker, recognize} from 'tesseract.js';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
})
export class ConverterComponent {
  ocrResult: string = 'Detectando texto...';
  progress: number = 0;
  urlImagen: string = 'assets/img/descarga.jpg';

  constructor() {}

  ngOnInit() {}

  async extraerTexto() {
    const worker = await createWorker({
      logger: (m) => {
        console.log(m);
        if (m.status === 'recognizing text') {
          let p = m.progress * 100;
          //convertir p a entero
          this.progress = Math.round(p);
        }
      },
    });
    (async () => {
      await worker.loadLanguage('eng+chi_tra');
      await worker.initialize('eng');
      const {
        data: { text },
      } = await worker.recognize(this.urlImagen);
      console.log(text);
      // this.ocrResult = text;

      //verificar si en la cadena existen dos ii seguidas y reemplazarla por una ñ
      let re = /ii/gi;
      let newstr = text.replace(re, 'ñ');
      console.log(newstr);
      this.ocrResult = newstr;

      await worker.terminate();
    })();
  }
}
