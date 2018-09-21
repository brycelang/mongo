$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {

     $("#artical").append(
      data[i].link + "<h5>" + data[i].title + "</h5><hr>" + data[i].snippet );
}
});

$(document).on("click", ".btn-fetch", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .done(function(data) {
      location.reload();
    });
});



