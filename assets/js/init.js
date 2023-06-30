$(document).on("ready", function () {
});

$(document).ready(function () {
  (function ($) {
    $.fn.viewModal = function (id) {
      $("#noteModal").modal("show");
      //var sourceText = $("#sourceDiv").html();
      //$("#destinationDiv").html(sourceText);
    };
  })(jQuery);
});


