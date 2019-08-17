$(document).ready(function () {

    if ($('#file_dropzone').length) {
        var previewTemplate = document.querySelector('#tpl').innerHTML;
        $("div#file_dropzone").dropzone({
            url: "http://google.com",
            previewTemplate:previewTemplate,
            previewsContainer: '.file-upload-display',
            acceptedFiles: 'accept',
            //addRemoveLinks: true,
        });
    }

    

    //hamburger action
    $('#hamburger').click(function () {
        var deviceWidth = window.innerWidth;
        $(this).toggleClass('open');
        $('.sidebar').toggleClass('active');
    });

});