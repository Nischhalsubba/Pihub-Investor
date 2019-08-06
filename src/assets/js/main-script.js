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

        // other code here
    }
    
    $("#tags").select2({
        tags: true,
        tokenSeparators: [',', ' '],
        selectOnClose: true,
        CloseOnselect: false
    });

    $('input[type="range"]').rangeslider({
        polyfill: false,

        // Default CSS classes
        rangeClass: 'rangeslider',
        disabledClass: 'rangeslider--disabled',
        horizontalClass: 'rangeslider--horizontal',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',

        onSlide: function (position, value) {
            var $handle = $('input#' + this.$element.attr('id') + '-value');
            var $prefix = "";
            if ($handle.attr("data-prefix"))
                $prefix = $handle.attr("data-prefix");
            
            var $sufix = "";
            if ($handle.attr("data-sufix"))
                $sufix = $handle.attr("data-sufix")
            
            $handle.val($prefix + value+$sufix);
        },
    });

    $('.js-example-basic-single').select2();









});