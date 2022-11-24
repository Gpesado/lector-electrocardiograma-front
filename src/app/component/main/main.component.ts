import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  selectedFile: any = null;
  chart: any;
  chartVia2: any;
  imageName: string = '';
  labels: string[] = [];
  data: string[] = [];
  labelsVia2: string[] = [];
  dataVia2: string[] = [];
  procesando: boolean = false;
  graduacionNegro: any = 80;
  graduacionRojo: any = 80;
  horizontalMovementFix: any = 1
  numberOfVias: any = 1
  dissplacementVias: any = 10

  constructor(
    private imageService: ImageService,
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.imageName = this.selectedFile.file.name;

      // this.imageService.uploadImage(this.selectedFile.src).subscribe(
      //   (res) => {
      //     this.splitData(res);
      //     this.grafica();
      //   },
      //   (err) => {
      //     console.log(err);
      //   })

    });

    reader.readAsDataURL(file);
  }

  analize() {
    this.procesando = true;
    this.imageService.uploadImage(this.selectedFile.src, this.graduacionNegro, this.graduacionRojo, this.horizontalMovementFix, this.numberOfVias, this.dissplacementVias).subscribe(
      (res) => {
        this.splitData(res[0]);
        this.grafica();
        if(this.numberOfVias == 2){
          this.splitDataVia2(res[1]);
          this.graficaVia2();
        } 
        this.procesando = false;
      },
      (err) => {
        console.log(err);
        this.procesando = false;
      })
  }

  grafica() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Length',
            data: this.data,
            backgroundColor: 'blue'
          }
        ]
      },
      options: {
        aspectRatio: 3
      }
    })
  }
  
  graficaVia2() {
    if (this.chartVia2) {
      this.chartVia2.destroy();
    }
    this.chartVia2 = new Chart("MyChartVia2", {
      type: 'line',
      data: {
        labels: this.labelsVia2,
        datasets: [
          {
            label: 'Length',
            data: this.dataVia2,
            backgroundColor: 'Green'
          }
        ]
      },
      options: {
        aspectRatio: 3
      }
    })
  }

  splitData(res: DataResponse[]) {
    this.labels = [];
    this.data = [];
    for (const iterator of res) {
      this.labels.push(iterator.tiempo.toString());
      this.data.push(iterator.valor.toString())
    }
  }
  
  splitDataVia2(res: DataResponse[]) {
    this.labelsVia2 = [];
    this.dataVia2 = [];
    for (const iterator of res) {
      this.labelsVia2.push(iterator.tiempo.toString());
      this.dataVia2.push(iterator.valor.toString())
    }
  }

}

export interface DataResponse {
  tiempo: Number,
  valor: Number
}

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}