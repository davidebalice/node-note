$(document).on("ready", function () {
  console.log("Il DOM è pronto!");
});

$(document).ready(function () {
  (function ($) {
    $.fn.viewModal = function (id) {
      alert(id);
      $("#noteModal").modal("show");
      //var sourceText = $("#sourceDiv").html();
      //$("#destinationDiv").html(sourceText);
    };
  })(jQuery);
});
