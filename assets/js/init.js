$(document).on("ready", function () {});

$(document).ready(function () {
  (function ($) {
    $.fn.viewModal = function (id) {
      $("#noteModal").modal("show");
      var sourceDate = $("#date" + id).html();
      $("#modalDate").html(sourceDate);
      var sourceTitle = $("#title" + id).html();
      $("#modalTitle").html(sourceTitle);
      var sourceText = $("#description" + id).html();
      $("#modalDescription").html(sourceText);
    };
  })(jQuery);
});
