$('#calendar').datepicker({});

!(function($) {
  $(document).on('click', 'ul.nav li.parent', function() {
    if ($(this).attr('aria-expanded') === 'true') {
      $(this)
        .find('em:last-child')
        .removeClass('fa-plus')
        .addClass('fa-minus');
    } else {
      $(this)
        .find('em:last-child')
        .removeClass('fa-minus')
        .addClass('fa-plus');
    }
  });
  $('.sidebar span.icon')
    .find('em:first')
    .addClass('fa-plus');
})(window.jQuery);
$(window).on('resize', () => {
  if ($(window).width() > 768) $('#sidebar-collapse').collapse('show');
});
$(window).on('resize', () => {
  if ($(window).width() <= 767) $('#sidebar-collapse').collapse('hide');
});

$(document).on('click', '.panel-heading span.clickable', function(e) {
  const $this = $(this);
  if (!$this.hasClass('panel-collapsed')) {
    $this
      .parents('.panel')
      .find('.panel-body')
      .slideUp();
    $this.addClass('panel-collapsed');
    $this
      .find('em')
      .removeClass('fa-toggle-up')
      .addClass('fa-toggle-down');
  } else {
    $this
      .parents('.panel')
      .find('.panel-body')
      .slideDown();
    $this.removeClass('panel-collapsed');
    $this
      .find('em')
      .removeClass('fa-toggle-down')
      .addClass('fa-toggle-up');
  }
});
