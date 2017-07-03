'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalActaInicioCtrl
 * @description
 * # SeguimientoycontrolLegalActaInicioCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolLegalActaInicioCtrl', function ($log, $scope, $routeParams, administrativaRequest) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var self = this;
    self.contrato_id = $routeParams.contrato_id;
    self.contrato_obj = {};
    self.poliza_obj = {};

    /*
    * Obtencion de datos del contrato del servicio
    */
    administrativaRequest.get('contrato_general',$.param({
      query: "Id:" + self.contrato_id
    })).then(function(response) {
      self.contrato_obj.id = response.data[0].Id;
      self.contrato_obj.contratista = response.data[0].Contratista;
      self.contrato_obj.valor = response.data[0].ValorContrato;
      self.contrato_obj.objeto = response.data[0].ObjetoContrato;
      self.contrato_obj.plazo = response.data[0].PlazoEjecucion;
      self.contrato_obj.contratante = "Universidad Distrital Francisco José de Caldas";
      self.contrato_obj.fecha_registro = response.data[0].FechaRegistro;
      self.contrato_obj.supervisor = response.data[0].Supervisor;
      $log.log(response.data);
    });

    /*
    * Obtencion de datos de la poliza
    */
    administrativaRequest.get('poliza',$.param({
      query: "NumeroContrato:" + self.contrato_id
    })).then(function(response) {
      self.poliza_obj.id = response.data[0].Id;
      self.poliza_obj.numero_poliza = response.data[0].NumeroPoliza;
      self.poliza_obj.fecha_expedicion = response.data[0].FechaRegistro;
      self.poliza_obj.fecha_aprobacion = response.data[0].FechaAprobacion;
      $log.log(response.data);
    });

    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: false,
      multiSelect: false,
      enableSelectAll: false,
      columnDefs : [
        {field: 'TipoBien',  displayName: 'Tipo de Bien',width: 150},
        {field: 'Placa' ,  displayName: 'Placa',width: 160},
        {field: 'Descripcion',  displayName: 'Descripción',width: 200},
        {field: 'Sede',  displayName: 'Sede',width: 390},
        {field: 'Dependencia',  displayName: 'Dependencia', width: 150},
        {field: 'Estado',  displayName: 'Estado del Bien', width: 180},
      ],
      onRegisterApi : function( gridApi ) {
        self.gridApi = gridApi;
      }
    };
    
    self.gridOptions.data = [{"TipoBien": "Bien de Consumo", "Placa":"1234556666","Descripcion":"Teclado LED", "Sede":"Macarena A", "Dependencia": "Bienestar", "Estado":""},
    {"TipoBien": "Bien de Consumo", "Placa":"1234556667","Descripcion":"CPU X", "Sede":"Macarena A", "Dependencia": "Bienestar", "Estado":""}];

    self.generarActa = function(){
      swal(
        'Buen trabajo!',
        'Se ha generado el acta, se iniciará la descarga',
        'success'
      );
    };


  });
