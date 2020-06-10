# Máscara de números

Para testar funcionalidade bastar acessar o link [Teste da aplicação](https://viniciusrufop.github.io/rochaut-mask-number/)

## Instalar dependência
Rodar comando `npm install rochaut-mask-number`.

## Exemplo simples
Adicionar módulo `RochautMaskNumberModule`
```
import { NgModule } from '@angular/core';
import { RochautMaskNumberModule } from 'rochaut-mask-number';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...
    RochautMaskNumberModule,
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Adicionar no html
```
 <input type="text" [allowLess]="false" units="2" decimals="2" />
```

# RochautMaskNumber

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
