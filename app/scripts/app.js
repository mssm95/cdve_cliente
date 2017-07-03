'use strict';

/**
 * @ngdoc overview
 * @name contractualClienteApp
 * @description
 * # contractualClienteApp
 *
 * Main module of the application.
 */
angular
  .module('contractualClienteApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'afOAuth2',
    'treeControl',
    'ngMaterial',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.treeView',
    'ui.grid.selection',
    'ui.grid.pagination',
    'ui.grid.exporter',
    'ui.grid.autoResize',
    'ngStorage',
    'ngWebSocket',
    'angularMoment',
    'ui.utils.masks',
    'pascalprecht.translate',
    'financieraService',
    'coreService',
    'administrativaService',
    'agoraService',
    'oikosService',
    'financieraMidService',
    'adminMidService',
    'argoNosqlService',
    'kyronService',
    'contratacion_service',
    'contratacion_mid_service',
    'sicapital_service',
    'titan_service'

  ])
    .run(function(amMoment) {
      amMoment.changeLocale('es');
    })
    .config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix("");
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/notificaciones', {
        templateUrl: 'views/notificaciones.html',
        controller: 'NotificacionesCtrl',
        controllerAs: 'notificaciones'

      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/necesidad/solicitud_necesidad', {
        templateUrl: 'views/necesidad/solicitud_necesidad.html',
        controller: 'SolicitudNecesidadCtrl',
        controllerAs: 'solicitudNecesidad'
      })
      .when('/necesidades', {
        templateUrl: 'views/necesidad/necesidades.html',
        controller: 'NecesidadesCtrl',
        controllerAs: 'necesidades'
      })
      .when('/rp_solicitud_personas', {
        templateUrl: 'views/rp/rp_solicitud_personas.html',
        controller: 'RpSolicitudPersonasCtrl',
        controllerAs: 'rpSolicitudPersonas'
      })
      .when('/rp/rp_solicitud/', {
        templateUrl: 'views/rp/rp_solicitud.html',
        controller: 'RpSolicitudCtrl',
        controllerAs: 'rpSolicitud'
      })
      .when('/seguimientoycontrol/financiero', {
        templateUrl: 'views/seguimientoycontrol/financiero.html',
        controller: 'SeguimientoycontrolFinancieroCtrl',
        controllerAs: 'sFinanciero'
      })
      .when('/seguimientoycontrol/financiero/contrato', {
        templateUrl: 'views/seguimientoycontrol/financiero/contrato.html',
        controller: 'SeguimientoycontrolFinancieroContratoCtrl',
        controllerAs: 'sFcontrato'
      })
      .when('/seguimientoycontrol/financiero/ordenes_pago', {
        templateUrl: 'views/seguimientoycontrol/financiero/ordenes_pago.html',
        controller: 'SeguimientoycontrolFinancieroOrdenesPagoCtrl',
        controllerAs: 'sFordenesPago'
      })
      .when('/seguimientoycontrol/financiero/estadisticas', {
        templateUrl: 'views/seguimientoycontrol/financiero/estadisticas.html',
        controller: 'SeguimientoycontrolFinancieroEstadisticasCtrl',
        controllerAs: 'sFestadisticas'
      })
      .when('/seguimientoycontrol/legal', {
        templateUrl: 'views/seguimientoycontrol/legal.html',
        controller: 'SeguimientoycontrolLegalCtrl',
        controllerAs: 'sLegal'
      })
      .when('/seguimientoycontrol/legal/acta_inicio/:contrato_id', {
        templateUrl: 'views/seguimientoycontrol/legal/acta_inicio.html',
        controller: 'SeguimientoycontrolLegalActaInicioCtrl',
        controllerAs: 'sLactaInicio'
      })
      .when('/seguimientoycontrol/legal/acta_suspension/:contrato_id', {
        templateUrl: 'views/seguimientoycontrol/legal/acta_suspension.html',
        controller: 'SeguimientoycontrolLegalActaSuspensionCtrl',
        controllerAs: 'sLactaSuspension'
      })
      .when('/seguimientoycontrol/legal/acta_reinicio/:contrato_id', {
        templateUrl: 'views/seguimientoycontrol/legal/acta_reinicio.html',
        controller: 'SeguimientoycontrolLegalActaReinicioCtrl',
        controllerAs: 'sLactaReinicio'
      })
      .when('/seguimientoycontrol/legal/acta_cesion/:contrato_id', {
        templateUrl: 'views/seguimientoycontrol/legal/acta_cesion.html',
        controller: 'SeguimientoycontrolLegalActaCesionCtrl',
        controllerAs: 'sLactaCesion'
      })
      .when('/seguimientoycontrol/legal/acta_adicion_prorroga', {
        templateUrl: 'views/seguimientoycontrol/legal/acta_adicion_prorroga.html',
        controller: 'SeguimientoycontrolLegalActaAdicionProrrogaCtrl',
        controllerAs: 'sLactaAdicionProrroga'
      })
      .when('/seguimientoycontrol/legal/acta_liquidacion', {
        templateUrl: 'views/seguimientoycontrol/legal/acta_liquidacion.html',
        controller: 'SeguimientoycontrolLegalActaLiquidacionCtrl',
        controllerAs: 'sLactaLiquidacion'
      })
      .when('/seguimientoycontrol/legal/acta_terminacion_liquidacion_bilateral', {
        templateUrl: 'views/seguimientoycontrol/legal/acta_terminacion_liquidacion_bilateral.html',
        controller: 'SeguimientoycontrolLegalActaTerminacionLiquidacionBilateralCtrl',
        controllerAs: 'sLactaTerminacionAnticipada'
      })
      .when('/seguimientoycontrol/legal/novedad_otro_si_aclaratorio', {
        templateUrl: 'views/seguimientoycontrol/legal/novedad_otro_si_aclaratorio.html',
        controller: 'SeguimientoycontrolLegalNovedadOtroSiAclaratorioCtrl',
        controllerAs: 'sLotroSiAclaratorio'
      })
      .when('/seguimientoycontrol/legal/novedad_otro_si_modificatorio', {
        templateUrl: 'views/seguimientoycontrol/legal/novedad_otro_si_modificatorio.html',
        controller: 'SeguimientoycontrolLegalNovedadOtroSiModificatorioCtrl',
        controllerAs: 'sLotroSiModificatorio'
      })
      .when('/vinculacionespecial/resolucion_generacion', {
        templateUrl: 'views/vinculacionespecial/resolucion_generacion.html',
        controller: 'ResolucionGeneracionCtrl',
        controllerAs: 'resolucionGeneracion'
      })
      .when('/vinculacionespecial/hojas_de_vida_seleccion/:idResolucion', {
        templateUrl: 'views/vinculacionespecial/hojas_de_vida_seleccion.html',
        controller: 'HojasDeVidaSeleccionCtrl',
        controllerAs: 'hojasDeVidaSeleccion'
      })
      .when('/vinculacionespecial/contrato_registro', {
        templateUrl: 'views/vinculacionespecial/contrato_registro.html',
        controller: 'ContratoRegistroCtrl',
        controllerAs: 'contratoRegistro'
      })
      .when('/vinculacionespecial/contrato_detalle', {
        templateUrl: 'views/vinculacionespecial/contrato_detalle.html',
        controller: 'ContratoDetalleCtrl',
        controllerAs: 'contratoDetalle'
      })
      .when('/vinculacionespecial/resolucion_gestion', {
        templateUrl: 'views/vinculacionespecial/resolucion_gestion.html',
        controller: 'ResolucionGestionCtrl',
        controllerAs: 'resolucionGestion'
      })
      .when('/vinculacionespecial/resolucion_detalle/:idResolucion', {
        templateUrl: 'views/vinculacionespecial/resolucion_detalle.html',
        controller: 'ResolucionDetalleCtrl',
        controllerAs: 'resolucionDetalle'
      })
      .when('/vinculacionespecial/resolucion_vista', {
        templateUrl: 'views/vinculacionespecial/resolucion_vista.html',
        controller: 'ResolucionVistaCtrl',
        controllerAs: 'resolucionVista'
      })
      .when('/vinculacionespecial/resolucion_administracion', {
        templateUrl: 'views/vinculacionespecial/resolucion_administracion.html',
        controller: 'ResolucionAdministracionCtrl',
        controllerAs: 'resolucionAdministracion'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
