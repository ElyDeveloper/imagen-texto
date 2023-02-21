import { Component } from '@angular/core';
import {createWorker, recognize} from 'tesseract.js';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent {
  ocrResult: string = 'Detectando texto...';
  progress: number = 0;
  
  constructor() { }

  ngOnInit() {
    this.iniciar();
  }

  async iniciar() { 
    const worker =  await createWorker({
      logger: m => { 
        console.log(m);
        if (m.status === 'recognizing text') {
          let p = m.progress * 100;
          //convertir p a entero
          this.progress = Math.round(p);
        }
      }
    });
    (async () => {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize('assets/img/image.jpeg');
      console.log(text);
      this.ocrResult = text;

      await worker.terminate();
    })();
  }
}
