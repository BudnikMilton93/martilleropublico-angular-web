import { Injectable } from '@angular/core';
import { ICL_MOCK, ICLIndice } from '../../mocks/calculadora/calculadora.mock';

@Injectable({
  providedIn: 'root'
})

export class IclService {
  getIndices(): ICLIndice[] {
    return ICL_MOCK;
  }

  getIndiceByFecha(fecha: string): ICLIndice | undefined {
    return ICL_MOCK.find(x => x.fecha === fecha);
  }
}