import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-conversor',
  templateUrl: './conversor.component.html',
  styleUrls: ['./conversor.component.scss']
})
export class ConversorComponent implements OnInit {
  cadValue: number = 0;
  arsValue: number = 0;
  gbpValue: number = 0;
  fixedCadValue: number = 0;
  fixedArsValue: number = 0;
  fixedGbpValue: number = 0;
  fixedBrlValue: number = 1;
  variation: number = 0;
  lastUpdate: Date | null = null;
  brlValue: number | null = null;
  showFixedConversionMessage: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCurrencyData();
    setInterval(() => {
      this.fetchCurrencyData();
    }, 180000); // Atualiza a cada 3 minutos (180000 ms)
  }

  fetchCurrencyData() {
    this.http.get('https://economia.awesomeapi.com.br/last/CAD-BRL,ARS-BRL,GBP-BRL').subscribe((data: any) => {
      const cadRate = data.CADBRL.ask;
      const arsRate = data.ARSBRL.ask;
      const gbpRate = data.GBPBRL.ask;
      const variation = data.CADBRL.varBid;
      const lastUpdate = data.CADBRL.create_date;

      this.cadValue = 1 / cadRate;
      this.arsValue = 1 / arsRate;
      this.gbpValue = 1 / gbpRate;
      this.fixedCadValue = 1 / cadRate; // Valor fixo do Dólar Canadense (CAD)
      this.fixedArsValue = 1 / arsRate; // Valor fixo do Peso Argentino (ARS)
      this.fixedGbpValue = 1 / gbpRate; // Valor fixo da Libra Esterlina (GBP)
      this.variation = variation;
      this.lastUpdate = new Date(lastUpdate);
    });
  }

  getCurrencyColor(value: number): string {
    if (value <= 1) {
      return 'red';
    } else if (value <= 5) {
      return 'green';
    } else {
      return 'blue';
    }
  }

  convertToCurrency() {
    if (this.brlValue === null || isNaN(this.brlValue)) {
      return;
    }
  
    if (this.brlValue === 1) {
      this.showFixedConversionMessage = true;
    } else {
      this.showFixedConversionMessage = false;
  
      const newValue = parseFloat(this.brlValue.toString());
  
      this.cadValue = this.fixedCadValue * newValue;
      this.arsValue = this.fixedArsValue * newValue;
      this.gbpValue = this.fixedGbpValue * newValue;
    }
  }
}  