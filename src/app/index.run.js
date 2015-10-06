(function() {
  'use strict';

  angular
    .module('exemploSonar')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
