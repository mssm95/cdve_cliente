'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadNecesidadesCtrl
 * @description
 * # NecesidadNecesidadesCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('NecesidadesCtrl', function($scope, administrativaRequest) {
    var self = this;
    //self.g_necesidad = {};



    self.gridOptions = {
      paginationPageSizes: [10, 15, 20],
      paginationPageSize: 10,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'NumeroElaboracion',
          displayName: 'Número de Elaboración',
          type: 'number',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row) {
            return row.entity.NumeroElaboracion;
          },
          width: '7%'
        },
        {
          field: 'Vigencia',
          displayName: 'Vigencia',
          type: 'number',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row) {
            return row.entity.Vigencia;
          },
          width: '7%'
        },
        {
          field: 'Objeto',
          displayName: 'Objeto',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row) {
            return row.entity.Objeto;
          },
          width: '35%'
        },
        {
          field: 'Justificacion',
          displayName: 'Justificación',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row) {
            return row.entity.Justificacion;
          },
          width: '25%'
        },
        {
          field: 'Estado.Nombre',
          displayName: 'Estado',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row) {
            return row.entity.Estado.Nombre + ".\n" + row.entity.Estado.Descripcion;
          },
          width: '20%'
        },
        {
          field: 'ver',
          displayName: 'ver',
          cellTemplate: function() {
            return '<center><a href="" style="border:0" type="button" ng-click="grid.appScope.direccionar(row.entity)"><span class="fa fa-eye"></span></a></center>';
          },
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row) {
            return row.entity.Estado.Nombre + ".\n" + row.entity.Estado.Descripcion;
          },
          width: '6%'
        }

      ]
    };
    self.gridOptions.multiSelect = false;

    $scope.direccionar = function(necesidad) {
      self.g_necesidad = necesidad;
      self.numero_el = necesidad.NumeroElaboracion;
      self.vigencia = necesidad.Vigencia;
      if (necesidad.Estado.Nombre === 'Solicitada') {
        self.mod_aprobar = true;
        self.mod_cdp = false;
      } else if (necesidad.Estado.Nombre === 'Aprobada' || necesidad.Estado.Nombre === 'Cdp Solicitado') {
        self.mod_aprobar = false;
        self.mod_cdp = true;
      } else {
        self.mod_cdp = false;
        self.mod_aprobar = false;
      }
      $("#myModal").modal();

    };

    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      self.gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        //console.log(row.entity);
        self.necesidad = row.entity;
        //console.log(row);
      });
    };

    self.recargar_grid = function() {
      administrativaRequest.get('necesidad', $.param({
        query: "Estado.Nombre__not_in:Borrador",
        limit: 0
      })).then(function(response) {
        self.gridOptions.data = response.data;
      });
    };

    self.recargar_grid();


    self.aprobar_necesidad = function() {
      administrativaRequest.get('estado_necesidad', $.param({
        query: "Nombre:Aprobada"
      })).then(function(response) {
        self.g_necesidad.Estado = response.data[0];
        administrativaRequest.put('necesidad', self.g_necesidad.Id, self.g_necesidad).then(function(response) {
          self.alerta = "";
          for (var i = 1; i < response.data.length; i++) {
            self.alerta = self.alerta + response.data[i] + "\n";
          }
          swal("", self.alerta, response.data[0]);

          self.recargar_grid();
          $("#myModal").modal("hide");
          self.g_necesidad=undefined;
        });
      });
    };

    self.rechazar_necesidad = function() {

      swal({
        title: 'Indica una justificación por el rechazo',
        input: 'textarea',
        showCancelButton: true,
        inputValidator: function (value) {
          return new Promise(function (resolve, reject) {
            if (value) {
              resolve();
            } else {
              reject('Por favor indica una justificación!');
            }
          });
        }
      }).then(function(text) {
        console.log(text);
        var nec_rech={
          Justificacion: text,
          Necesidad: self.g_necesidad
        };
          administrativaRequest.post('necesidad_rechazada', nec_rech).then(function(response) {
            if (response.data !== undefined) {
              swal(
                'Ok!',
                'La necesidad ha sido Rechazada!',
                'success'
              );
            } else {
              swal(
                'error!',
                'La necesidad no pudo ser rechazada!',
                'error'
              );
            }
            self.recargar_grid();
            self.self.g_necesidad=undefined;
            $("#myModal").modal("hide");
          });

      });
    };

    self.solicitar_cdp = function() {
      self.sol_cdp = {};
      self.sol_cdp.Necesidad = self.g_necesidad;
      administrativaRequest.post("solicitud_disponibilidad", self.sol_cdp).then(function(response) {
        self.alerta = "";
        for (var i = 1; i < response.data.length; i++) {
          self.alerta = self.alerta + response.data[i] + "\n";
        }
        swal("", self.alerta, response.data[0]);
        self.recargar_grid();
        self.necesidad=undefined;
        $("#myModal").modal("hide");
      });
    };




    $scope.$watch('[necesidades.gridOptions.paginationPageSize, necesidades.gridOptions.data]', function() {
      if ((self.gridOptions.data.length <= self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize === null) && self.gridOptions.data.length > 0) {
        $scope.gridHeight = self.gridOptions.rowHeight * 2 + (self.gridOptions.data.length * self.gridOptions.rowHeight);
        if (self.gridOptions.data.length <= 10) {
          self.gridOptions.enablePaginationControls = false;
        }
      } else {
        $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
        self.gridOptions.enablePaginationControls = true;
      }
    });

  });
