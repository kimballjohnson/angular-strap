'use strict';

describe('typeahead', function () {

  var $compile, $templateCache, $typeahead, scope, sandboxEl, $q;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.typeahead'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$typeahead_, _$q_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $typeahead = _$typeahead_;
    $q = _$q_;
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {selectedState: '', states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']},
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'default-with-id': {
      scope: {selectedState: '', states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']},
      element: '<input id="typeahead1" type="text" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'default-value': {
      scope: {selectedState: 'Alaska', states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']},
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'watch-options': {
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in states" data-watch-options="1" bs-typeahead>'
    },
    'single-match': {
      scope: {selectedCode: '', codes: ['000000', '000001']},
      element: '<input type="text" ng-model="selecteCode" bs-options="code for code in codes" bs-typeahead>'
    },
    'comparator': {
      scope: {selectedCode: '', codes: ['001000', '002001']},
      element: '<input type="text" ng-model="selecteCode" bs-options="code for code in codes" bs-typeahead comparator="{{ comparator }}">'
    },
    'markup-ngRepeat': {
      element: '<ul><li ng-repeat="i in [1, 2, 3]"><input type="text" ng-model="selectedState" bs-options="state for state in states" bs-typeahead></li></ul>'
    },
    'markup-objectValue': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'}, {value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'}, {value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'}, {value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" data-html="1" bs-options="icon as icon.label for icon in icons" bs-typeahead>'
    },
    'markup-objectValue-custom': {
      scope: {selectedIcon: {}, icons: [{val: 'gear', fr_FR: '<i class="fa fa-gear"></i> Gear'}, {val: 'globe', fr_FR: '<i class="fa fa-globe"></i> Globe'}, {val: 'heart', fr_FR: '<i class="fa fa-heart"></i> Heart'}, {val: 'camera', fr_FR: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" data-html="1" bs-options="icon as icon[\'fr_FR\'] for icon in icons" bs-typeahead>'
    },
    'markup-renew-items': {
      scope: {selectedIcon: {}, icons: function(){return [{alt: 'Gear'}, {alt: 'Globe'}, {alt: 'Heart'}, {alt: 'Camera'}];}},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" bs-options="icon as icon.alt for icon in icons()" bs-typeahead>'
    },
    'options-animation': {
      element: '<input type="text" data-animation="am-flip-x" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-placement': {
      element: '<input type="text" data-placement="bottom" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-placement-exotic': {
      element: '<input type="text" data-placement="bottom-right" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-trigger': {
      element: '<input type="text" data-trigger="hover" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-html': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'}, {value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'}, {value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'}, {value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" data-html="1" bs-options="icon.value as icon.label for icon in icons" bs-typeahead>'
    },
    'options-template': {
      element: '<input type="text" data-template="custom" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-minLength': {
      element: '<input type="text" ng-model="selectedState" data-min-length="0" bs-options="state for state in states" bs-typeahead>'
    },
    'options-autoSelect': {
      scope: {states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']},
      element: '<input type="text" ng-model="selectedState" data-min-length="0" data-auto-select="1" ng-options="state for state in states" bs-typeahead>'
    }
  };

  function compileDirective(template, locals, hook) {
    template = templates[template];
    angular.extend(scope, template.scope || templates['default'].scope, locals);
    var element = $(template.element).appendTo(sandboxEl);
    if(angular.isFunction(hook)) hook(scope);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  function triggerKeyDown(elm, keyCode) {
    var evt = $.Event('keydown');
    evt.which = evt.keyCode = keyCode;
    angular.element(elm[0]).triggerHandler(evt);
  }

  // Tests

  describe('with default template', function () {

    it('should open on focus', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
    });

    it('should close on blur', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(elm[0]).triggerHandler('blur');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe($typeahead.defaults.limit);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text()).toBe(scope.states[0]);
      expect(elm.val()).toBe('');
    });

    it('should correctly set the default value', function() {
      var elm = compileDirective('default-value');
      expect(elm.val()).toBe(scope.states[1]);
    });

    it('should correctly filter the dropdown list when input changes', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.states[0].substr(0, 2));
      expect(elm.val()).toBe(scope.states[0].substr(0, 2));
      angular.element(elm[0]).triggerHandler('change');
      elm.val(elm.val() + scope.states[0].substr(2, 4));
      expect(elm.val()).toBe(scope.states[0].substr(0, 2 + 4));
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(1);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text()).toBe(scope.states[0]);
    });

    it('should correctly select a value', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe($typeahead.defaults.limit);
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedState).toBe(scope.states[0]);
    });

    it('should only show one match when there is only one match left', function () {
      var elm = compileDirective('single-match');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.codes[0].substr(0, 5)); // 00000
      expect(elm.val()).toBe(scope.codes[0].substr(0, 5));
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(2); // 000000 & 000001
      elm.val(scope.codes[0].substr(0, 6)); // 000000
      expect(elm.val()).toBe(scope.codes[0].substr(0, 6));
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(1); // 000000
    });

    it('should not use a comparator if one is not set', function () {
      scope.comparator = '';

      var elm = compileDirective('comparator');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.codes[0].substr(0, 3)); // 001
      expect(elm.val()).toBe(scope.codes[0].substr(0, 3));
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(2); // 001000, 002001
    });

    it('should use the comparator if it is set', function () {
      scope.startsWith = function (actual, expected) { return actual.indexOf(expected) === 0; };
      scope.comparator = 'startsWith';

      var elm = compileDirective('comparator');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.codes[0].substr(0, 3)); // 001
      expect(elm.val()).toBe(scope.codes[0].substr(0, 3));
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(1); // Our comparator should only match the beginning - 001000
    });

    // @TODO
    // it('should correctly select a value', function(done) {
    //   var elm = compileDirective('default');
    //   angular.element(elm[0]).triggerHandler('focus');
    //   elm.val('notintthelist');
    // });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-typeahead]:eq(0)')).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe($typeahead.defaults.limit);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text()).toBe(scope.states[0]);
    });

    it('should support objectValue markup', function() {
      var elm = compileDirective('markup-objectValue');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe(scope.icons[0].label);
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedIcon).toBe(scope.icons[0]);
      expect(elm.val()).toBe(jQuery('div').html(scope.icons[0].label).text().trim());
    });

    it('should support custom objectValue markup', function() {
      var elm = compileDirective('markup-objectValue-custom');
      scope.selectedIcon = scope.icons[1];
      scope.$digest();
      expect(elm.val()).toBe(jQuery('<div></div>').html(scope.icons[1].fr_FR).text().trim());
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe(scope.icons[1].fr_FR);
      elm.val('');
      angular.element(elm[0]).triggerHandler('change');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedIcon).toBe(scope.icons[0]);
      expect(elm.val()).toBe(jQuery('<div></div>').html(scope.icons[0].fr_FR).text().trim());
    });

    it('should support custom label with renewed source', function() {
      var elem = compileDirective('markup-renew-items');
      var target = scope.icons()[0];

      elem.val('');
      angular.element(elem[0]).triggerHandler('focus');
      scope.$digest();
      expect(sandboxEl.find('.dropdown-menu li a').length).toBe(4);

      elem.val(target.alt);
      angular.element(elem[0]).triggerHandler('change');
      scope.$digest();
      expect(elem.val()).toBe(target.alt);

      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      scope.$digest();

      expect(elem.val()).toBe(target.alt);
    });

    it('should support numeric values', function() {
      var elm = compileDirective('default', { states: [1, 2, 3] });
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe('1');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedState).toBe(scope.states[0]);
      expect(elm.val()).toBe(jQuery('div').html(scope.states[0]).text().trim());
    });

  });

  describe('bsOptions', function () {

    it('should correctly watch for changes', function() {
      var elm = compileDirective('watch-options');
      scope.states.shift();
      scope.$digest();
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text().trim()).toBe(scope.states[0]);
    });

  });

  describe('options', function () {

    describe('animation', function () {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('placement', function () {
      var $$rAF,
          $timeout;

      beforeEach(inject(function (_$$rAF_, _$timeout_) {
        $$rAF = _$$rAF_;
        $timeout = _$timeout_;
      }));

      it('should default to `top` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-left')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-right')).toBeTruthy();
      });

      it('should re-apply placement when the results change', function () {
        var typeahead = $typeahead($('<input>'), null, { placement: 'top' });
        spyOn(typeahead, '$applyPlacement');
        typeahead.update([]);

        $timeout.flush();
        expect(typeahead.$applyPlacement).toHaveBeenCalled();
      });

      it('should not re-apply placement when the results change if the placement is bottom', function () {
        var typeahead = $typeahead($('<input>'), null, { placement: 'bottom' });
        spyOn(typeahead, '$applyPlacement');
        typeahead.update([]);

        $timeout.flush();
        expect(typeahead.$applyPlacement).not.toHaveBeenCalled();
      });

      it('should not re-apply placement when the results change if the placement is bottom-left', function () {
        var typeahead = $typeahead($('<input>'), null, { placement: 'bottom-left' });
        spyOn(typeahead, '$applyPlacement');
        typeahead.update([]);

        $timeout.flush();
        expect(typeahead.$applyPlacement).not.toHaveBeenCalled();
      });

      it('should not re-apply placement when the results change if the placement is bottom-right', function () {
        var typeahead = $typeahead($('<input>'), null, { placement: 'bottom-right' });
        spyOn(typeahead, '$applyPlacement');
        typeahead.update([]);

        $timeout.flush();
        expect(typeahead.$applyPlacement).not.toHaveBeenCalled();
      });
    });

    describe('trigger', function () {

      it('should support an alternative trigger', function() {
        var elm = compileDirective('options-trigger');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
        angular.element(elm[0]).triggerHandler('mouseleave');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      });

    });

    describe('html', function () {

      it('should correctly compile inner content', function() {
        var elm = compileDirective('options-html');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
        expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe(scope.icons[0].label);
      });

    });

    describe('template', function () {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner">foo: {{states.length}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('foo: ' + scope.states.length);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><ul><li ng-repeat="state in states">{{state}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe(scope.states.join(''));
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe(scope.states.join(''));
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><a class="btn" ng-click="dropdown.counter=dropdown.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        scope.dropdown = {counter: 0};
        angular.element(elm[0]).triggerHandler('focus');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(2);
      });

    });

  });

  describe('minLength', function() {

    it('should not throw when ngModel.$viewValue is undefined', function() {
      var elm = compileDirective('options-minLength', {}, function(scope) { delete scope.selectedState; });
      scope.$digest();
      expect(scope.$$childHead.$isVisible).not.toThrow();
    });

    it('should should show options on focus when minLength is 0', function() {
      var elm = compileDirective('options-minLength', {}, function(scope) { delete scope.selectedState; });
      angular.element(elm[0]).triggerHandler('focus');
      scope.$digest();
      expect(sandboxEl.find('.dropdown-menu li').length).toBe($typeahead.defaults.limit);
      expect(scope.$$childHead.$isVisible()).toBeTruthy();
    });

  });

  describe('autoSelect', function() {

    it('should not auto-select the first match upon meeting minLength', function() {
      var elm = compileDirective('options-minLength', {});
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').hasClass('active')).not.toBeTruthy();
    });

    it('should auto-select the first match upon meeting minLength', function() {
      var elm = compileDirective('options-autoSelect', {});
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').hasClass('active')).toBeTruthy();
    });

  });

  describe('select event', function() {

    it('should dispatch .select event when item is selected', function() {
      var elm = compileDirective('default');

      var selected = null;
      scope.$on('$typeahead.select', function(evt, value, index, typeahead) {
        selected = index;
      });

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a').get(0)).triggerHandler('click');

      expect(selected).toBe(1);
    });

    it('should call .select event with typeahead element instance id', function() {
      var elm = compileDirective('default-with-id');

      var id = '';
      scope.$on('$typeahead.select', function(evt, value, index, typeahead) {
        id = typeahead.$id;
      });

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a').get(0)).triggerHandler('click');

      expect(id).toBe('typeahead1');
    });
  });

});
