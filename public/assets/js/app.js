$(document).ready(function() {
    $('.save-article').on("click", function () {
        $.ajax({
            url: "/api/post",
            type: "POST",
            data: {title: $(this).attr("data-title"),link: $(this).attr("data-link")},
            success: function(response){
                console.log(response);
            }
        });
    });
    $(".noteAdd").on("submit", function() {
        const url = $(this).attr("data-article");
        $.ajax({
            url: `/api/note/${url}`,
            type: "POST",
            data: {text: $(this).find("input[name=addNote]").val().trim()},
            success: function(response){
                console.log(response);
            }
        }).then(_ => {
            location.reload();
        })
    })
    $(".delete").on("click", function() {
        $.ajax({
            url: `/api/article/${$(this).attr("data-id")}`,
            type: "DELETE",
            data: {id: $(this).attr("data-id")},
            success: function(response){
                console.log(response);
            }
        }).then(function() {
            location.reload();
        })
    });
    $(".del-note").on("click", function() {
        $.ajax({
            url: `/api/note/${$(this).attr("data-id")}`,
            type: "DELETE",
            data: {id: $(this).attr("data-id")},
            success: function(response){
                console.log(response);
            }
        }).then(function() {
            location.reload();
        })
    });
    $("#clearAll").on("click", function() {
        $.ajax({
            url: "/api/clearall",
            type: "DELETE",
            data: "",
            success: function(response){
                console.log(response);
            }
        }).then(function() {
            location.reload();
        })
    })
}) 
