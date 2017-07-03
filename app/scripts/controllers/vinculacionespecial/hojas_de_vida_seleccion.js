'use strict';

angular.module('contractualClienteApp')
  .controller('HojasDeVidaSeleccionCtrl', function (contratacion_request,contratacion_mid_request,$scope,$mdDialog,$routeParams,$translate) {
    
    var self = this;

    self.idResolucion=$routeParams.idResolucion;
    
    self.dedicaciones=[];
    self.proyectos=[];
    contratacion_request.getOne("resolucion_vinculacion_docente",self.idResolucion).then(function(response){      
      self.datosFiltro=response.data;
      contratacion_request.getAll("proyecto_curricular/"+self.datosFiltro.NivelAcademico.toLowerCase()+"/"+self.datosFiltro.IdFacultad).then(function(response){
        self.proyectos=response.data;
      });
      switch(self.datosFiltro.Dedicacion){      
        case "TCO-MTO":
          contratacion_request.getAll("dedicacion","query=NombreDedicacion%3ATCO").then(function(response){
            if(typeof(response.data)=="object"){
              self.dedicaciones=self.dedicaciones.concat(response.data);
            }
          });
          contratacion_request.getAll("dedicacion","query=NombreDedicacion%3AMTO").then(function(response){
            if(typeof(response.data)=="object"){
              self.dedicaciones=self.dedicaciones.concat(response.data);
            }
          });
          break;
        case "HCP":
          contratacion_request.getAll("dedicacion","query=NombreDedicacion%3AHCP").then(function(response){
            if(typeof(response.data)=="object"){
              self.dedicaciones=self.dedicaciones.concat(response.data);
            }
          });
          break;
        case "HCH":
          contratacion_request.getAll("dedicacion","query=NombreDedicacion%3AHCH").then(function(response){
            if(typeof(response.data)=="object"){
              self.dedicaciones=self.dedicaciones.concat(response.data);
            }
          });
          break;
      }
      self.cargarDatosPersonas();
      self.cargarDatosPrecontratados();
    });

    self.datosPersonas = {
      paginationPageSizes: [10, 15, 20],
      paginationPageSize: 10,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs : [
        {
          field: 'Id', 
          displayName: $translate.instant('DOCUMENTO')
        },
        {
          field: 'NombreCompleto', 
          width: '40%', displayName: 
          $translate.instant('NOMBRE')
        },
        {
          field: 'Escalafon', 
          displayName: $translate.instant('CATEGORIA')
        },
        {
            name: $translate.instant('OPCIONES'),
            enableFiltering: false,
            width: '15%',  
            cellTemplate: '<center>' +
               '<a class="ver" ng-click="grid.appScope.verInformacionPersonal(row)">' +
               '<i title="{{\'BTN.VER\' | translate }}" class="fa fa-user fa-lg  faa-shake animated-hover"></i></a> ' +
               '<a class="editar" ng-click="grid.appScope.verFormacionAcademica(row)">' +
               '<i title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-graduation-cap fa-lg  faa-shake animated-hover"></i></a> ' +
               '<a class="ver" ng-click="grid.appScope.verHistoriaLaboral(row)">' +
               '<i title="{{\'BTN.CONFIGURAR\' | translate }}" class="fa fa-pencil fa-lg faa-shake animated-hover"></i></a> ' +
               '<a class="editar" ng-click="grid.appScope.verTrabajosInvestigacion(row)">' +
               '<i title="{{\'BTN.CONFIGURAR\' | translate }}" class="fa fa-book fa-lg fa-lg animated-hover"></i></a> ' +
               '</center>'
        }
      ],
      onRegisterApi : function(gridApi){
        self.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          self.personasSeleccionadas=gridApi.selection.getSelectedRows();
          if(self.personasSeleccionadas.length==0){
            self.persona=null;
          }else{
            contratacion_request.getOne("informacion_persona_natural",row.entity.Id).then(function(response){
              if(typeof(response.data)=="object"){
                self.persona=row.entity;
                self.persona.FechaExpedicionDocumento = new Date(self.persona.FechaExpedicionDocumento).toLocaleDateString('es');
              }else{
                swal({
                  title: "Problema",
                  text: $translate.instant('MENSAJE_ERROR'),
                  type: "danger",
                  confirmButtonText: $translate.instant('ACEPTAR'),
                  closeOnConfirm: false,
                  showLoaderOnConfirm: true,
                }); 
              }
            });
          }
        });
      }
    };

    self.getNumeroProyecto=function(num){
      if(self.proyectos[num]){
        return self.proyectos[num].Id
      }else{
        return 0
      }
    }

    self.precontratados = {
      enableSorting: true,
      enableFiltering : true,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id', visible : false},
        {field: 'NombreCompleto', width: '25%', displayName: $translate.instant('NOMBRE')},
        {field: 'Documento', displayName: $translate.instant('CEDULA')},
        {field: 'Expedicion', displayName: $translate.instant('EXPEDICION')},
        {field: 'Categoria', displayName: $translate.instant('CATEGORIA')},
        {field: 'Dedicacion', displayName: $translate.instant('DEDICACION')},
        {field: 'HorasSemanales', displayName: $translate.instant('HORAS_SEMANALES')},
        {field: 'Semanas', displayName: $translate.instant('SEMANAS')},
        {field: 'ValorContrato', displayName: $translate.instant('VALOR_CONTRATO'), cellClass:"valorEfectivo"},
        {field: 'ProyectoCurricular', visible: false, filter: {
                        noTerm: true,
                        condition: function(searchTerm, cellValue) {
                            return (cellValue == self.getNumeroProyecto(self.selectedIndex));
                        }
                    }},
        {
          field: 'cancelar',
          enableSorting: false,
          enableFiltering: false,
          width: '5%',
          displayName: '',
          cellTemplate: '<center>' +
            '<a class="borrar" ng-click="grid.appScope.verCancelarInscripcionDocente(row)">' +
            '<i title="{{\'BTN.BORRAR\' | translate }}" class="fa fa-trash fa-lg  faa-shake animated-hover"></i></a></div>' +
            '</center>'
        }
      ]
    };

    self.refresh = function(){
      self.precontratados.data=JSON.parse(JSON.stringify(self.precontratados.data))
    }

    self.cargarDatosPersonas = function(){
      contratacion_request.getAll("persona_escalafon").then(function(response){
        self.datosPersonas.data=response.data;
        self.datosPersonas.data.forEach(function(row){
          row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
        });
      });
    }

    self.cargarDatosPrecontratados = function(){
      contratacion_request.getAll("precontratado/"+self.idResolucion.toString()).then(function(response){      
        self.precontratados.data=response.data;
        if(self.precontratados.data != null){
          self.precontratados.data.forEach(function(row){
            row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
            contratacion_mid_request.post("calculo_salario/"+self.datosFiltro.NivelAcademico+"/"+row.Documento+"/"+row.Semanas+"/"+row.HorasSemanales+"/"+row.Categoria.toLowerCase()+"/"+row.Dedicacion.toLowerCase()).then(function(response){
              row.ValorContrato=FormatoNumero(response.data,0);
            });          
          });
        }
      });
    }

    self.agregarPrecontratos = function(){
      var idDedicacion;
      switch(self.datosValor.dedicacion){
        case "TCO":
          idDedicacion=4;
          break;
        case "MTO":
          idDedicacion=3;
          break;
        case "HCH":
          idDedicacion=1;
          break;
        case "HCP":
          idDedicacion=2;
          break;
      }

      var vinculacionesData=[];

      self.personasSeleccionadas.forEach(function(personaSeleccionada){
        var vinculacionDocente = {
          IdPersona: {Id: personaSeleccionada.Id},
          NumeroHorasSemanales: self.datosValor.NumHorasSemanales,
          NumeroSemanas: self.datosValor.NumSemanas,
          IdResolucion: {Id: parseInt(self.idResolucion)},
          IdDedicacion: {Id: idDedicacion},
          IdProyectoCurricular: parseInt(self.datosValor.proyectoCurricular)
        };

        vinculacionesData.push(vinculacionDocente);
      })

      contratacion_request.post("vinculacion_docente/InsertarVinculaciones",vinculacionesData).then(function(response){
          if(typeof(response.data)=="object"){
            self.cargarDatosPrecontratados();
          }
      })
    }

    self.calcularValorContratos = function(){
      self.personasSeleccionadas.forEach(function(personaSeleccionada){
        contratacion_mid_request.post("calculo_salario/"+self.datosFiltro.NivelAcademico+"/"+self.persona.Id+"/"+self.datosValor.NumSemanas+"/"+self.datosValor.NumHorasSemanales+"/"+self.persona.Escalafon.toLowerCase()+"/"+self.datosValor.dedicacion.toLowerCase()).then(function(response){
          if(typeof(response.data)=="number"){
            self.valorContrato=response.data;
            personaSeleccionada.valorContrato=self.valorContrato;
            if(personaSeleccionada.Id==self.persona.Id){
              if(self.personasSeleccionadas.length>1){
                swal({
                  text: $translate.instant('NUMERO_VINCULACIONES')+self.personasSeleccionadas.length,
                  type: 'info',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonClass: 'btn btn-success',
                  buttonsStyling: false,
                  confirmButtonText: $translate.instant('ACEPTAR')
                });
              }else{
                swal({
                  text: $translate.instant('VALOR_CONTRATO_FORMATO')+FormatoNumero(response.data)+$translate.instant('MONEDA_CORRIENTE')+NumeroALetras(response.data).toLowerCase()+")",
                  type: 'info',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonClass: 'btn btn-success',
                  buttonsStyling: false,
                  confirmButtonText: $translate.instant('ACEPTAR')
                });
              }
              self.agregarPrecontratos();
              self.datosValor={};
            }
          }else{
            swal({
              title: $translate.instant('ALERTA'),
              text: $translate.instant('SALARIO_NO_CALCULADO1')+personaSeleccionada.NombreCompleto+$translate.instant('SALARIO_NO_CALCULADO2'),
              type: "warning",
              confirmButtonText: $translate.instant('ACEPTAR'),
              showLoaderOnConfirm: true,
            });
          }
        });
      })
    }

    self.validarContratos = function(){
      contratacion_mid_request.post("validar_contrato/"+self.persona.Id+"/"+self.datosValor.NumHorasSemanales+"/"+self.datosValor.dedicacion.toLowerCase()).then(function(response){
        if(response.data==1){
          self.calcularValorContratos();
        }else{
          swal({
            text: $translate.instant('VALIDAR_CONTRATO'),
            type: "warning",
            confirmButtonText: $translate.instant('ACEPTAR'),
            showLoaderOnConfirm: true,
          });
        }
      });
    }

    self.registrarContratos = function(){
      var advertenciaVisualizada=false;
      if(self.datosValor.proyectoCurricular && self.datosValor.NumSemanas && self.datosValor.NumHorasSemanales && self.datosValor.dedicacion){
        self.personasSeleccionadas.forEach(function(personaSeleccionada){
          contratacion_request.getOne("precontratado/"+self.idResolucion.toString(),personaSeleccionada.Id).then(function(response){
            if(response.data && !advertenciaVisualizada){
              advertenciaVisualizada=true;
              swal({
                text: $translate.instant('REGISTRAR_CONTRATOS'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('AGREGAR_CONTRATO'),
                cancelButtonText: $translate.instant('CANCELAR'),
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
              }).then(function () {
                self.validarContratos()
              }, function (dismiss) {
                if (dismiss === 'cancel') {
                  swal(
                    $translate.instant('CANCELADO'),
                    $translate.instant('REGISTRO_CANCELADO'),
                    'error'
                  )
                }
              }) 
            }else{
              if(personaSeleccionada.Id==self.persona.Id && !advertenciaVisualizada){
                self.validarContratos()
              }
            }
          })
        })
      }
    }

    $scope.verCancelarInscripcionDocente=function(row){
      swal({
        title: $translate.instant('PREGUNTA_SEGURO'),
        text: $translate.instant('CONFIRMAR_DESVINCULACION'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: $translate.instant('DEVINCULAR_DOCENTE'),
        cancelButtonText: $translate.instant('CANCELAR'),
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).then(function () {
        self.desvincularDocente(row);
      }, function (dismiss) {
        if (dismiss === 'cancel') {
          swal(
            $translate.instant('CANCELADO'),
            $translate.instant('DESVINCULACION_CANCELADA'),
            'error'
          )
        }
      })
    }

    self.desvincularDocente = function(row){
      var idDedicacion;
      switch(row.entity.Dedicacion){
        case "TCO":
          idDedicacion=4;
          break;
        case "MTO":
          idDedicacion=3;
          break;
        case "HCH":
          idDedicacion=1;
          break;
        case "HCP":
          idDedicacion=2;
          break;
      }

      var vinculacionCancelada = {
        IdPersona: {Id: row.entity.Documento},
        NumeroHorasSemanales: row.entity.HorasSemanales,
        NumeroSemanas: row.entity.Semanas,
        IdResolucion: {Id: parseInt(self.idResolucion)},
        IdDedicacion: {Id: parseInt(idDedicacion)},
        IdProyectoCurricular: parseInt(row.entity.ProyectoCurricular),
        Estado: false
      };

      contratacion_request.put("vinculacion_docente",row.entity.Id,vinculacionCancelada).then(function(response){
        self.cargarDatosPrecontratados();
      })
    }

    self.inscribirContratos = function(){
      self.contratosInscritos = self.contratados.data;
      self.verCalcularSalario();
    }

    self.asignarContrato = function(){
      self.verCalcularSalario();
    }

    self.verCalcularSalario = function(){
       $mdDialog.show({
        controller: "ContratoRegistroCtrl",
        controllerAs: "contratoRegistro",
        templateUrl: 'views/vinculacionespecial/contrato_registro.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {persona: self.persona, nivelAcademico: self.nivelAcademico, idFacultad: self.idFacultad, idProyectoCurricular: self.idProyectoCurricular,contratados: self.contratosInscritos}
      })
    };

    self.mostrarReglas = function(){
      var textoReglas="";
      switch(self.datosFiltro.Dedicacion){ 
        case "HCH":
          textoReglas=textoReglas+'<p><b>'+$translate.instant('HCH')+'</b>'+ $translate.instant('HCH1')+'</p>'
          break;
        case "HCP":
          textoReglas=textoReglas+'<p><b>'+$translate.instant('HCP')+'</b>'+$translate.instant('HCP1')+'</p>'
          break;     
        case "TCO-MTO":
          textoReglas=textoReglas+'<p><b>'+$translate.instant('MTO')+'</b>'+$translate.instant('MTO1')+'</p>'+
                                  '<p><b>'+$translate.instant('TCO')+'</b>'+$translate.instant('TCO1')+'</p>'
          break;
      }
      swal({
        title: 'Reglas',
        type: 'info',
        html: textoReglas
      })
    }

    $scope.verInformacionPersonal = function(row){
      $mdDialog.show({
        controller: "InformacionPersonalCtrl",
        controllerAs: 'informacionPersonal',
        templateUrl: 'views/vinculacionespecial/informacion_personal.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      }) 
    }

    $scope.verHistoriaLaboral = function(row){
      $mdDialog.show({
        controller: "HistoriaLaboralCtrl",
        controllerAs: 'historiaLaboral',
        templateUrl: 'views/vinculacionespecial/experiencia_laboral_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      }) 
    }

    $scope.verFormacionAcademica = function(row){
      $mdDialog.show({
        controller: "FormacionAcademicaCtrl",
        controllerAs: "formacionAcademica",
        templateUrl: 'views/vinculacionespecial/formacion_academica_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      })
    };

    $scope.verTrabajosInvestigacion = function(row){
       $mdDialog.show({
        controller: "TrabajosInvestigacionCtrl",
        controllerAs: "trabajosInvestigacion",
        templateUrl: 'views/vinculacionespecial/trabajos_investigacion_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      })
    };

  });
