var GTFB_F_images = [];

jQuery(document).ready(function ($) {

  //PEXELS
  $('body').on('click touch', '#GTFB_F_search_btn', function () {
    var source = $("#GTFB_F_source_input").val();

    if (source == "pexels") {
      GTFB_F_clear_result_panel();
      GTFB_F_pexels_search(1);
    }
    else if (source == "flaticon") {
      GTFB_F_clear_result_panel();
      GTFB_F_flaticon_search(1);
    }
    else if (source == "iconfinder") {
      GTFB_F_clear_result_panel();
      GTFB_F_iconfinder_search(1);
    }
  });

  $('body').on('click touch', '#GTFB_F_load_more', function () {
    var source = $("#GTFB_F_source_input").val();
    if (source == "pexels") {
      var count = $(".GTFB_F_item").length;
      var page = count / 12 + 1;
      GTFB_F_pexels_search(page);
    }
    else if (source == "pixabay") {
      var count = $(".GTFB_F_item").length;
      var page = count / 12 + 1;
      GTFB_F_pixabay_search(page);
    }
    else if (source == "unsplash") {
      var count = $(".GTFB_F_item").length;
      var page = count / 12 + 1;
      GTFB_F_unsplash_search(page);
    }
    else if (source == "flaticon") {
      var count = $(".GTFB_F_item").length;
      var page = count / 100 + 1;
      GTFB_F_flaticon_search(page);
    }
    else if (source == "iconfinder") {
      var count = $(".GTFB_F_item").length;
      var page = count / 100 + 1;
      GTFB_F_iconfinder_search(page);
    }
  });

  function GTFB_F_pexels_search(page) {
    GTFB_F_load_search_btn();
    GTFB_F_load_more_btn();
    var data = {
      key: jQuery('#GTFB_F_search_input').val(),
      page: page,
    };

    jQuery.ajax({
      method: 'POST',
      url: GTFB_F_script_vars.GTFB_F_script_root + "gtfb-f/search/pexels",
      data: data,
      success: function (response) {

        GTFB_F_show_pexels_images(JSON.parse(response), page);
        GTFB_F_reset_search_btn();
        GTFB_F_reset_more_btn();
      },
      error: function () {
        console.log('error');
      },
    });
  }

  function GTFB_F_show_pexels_images(data, page) {
    if (data.photos != 'undefined') {
      for (var i = 0; i < data.photos.length; i++) {
        var img_id = '';
        var img_title = '';
        if (data.photos[i].id != undefined) {
          img_id = "pexels_" + data.photos[i].id;
        } else {
          img_id = "pexels_" + data.photos[i].id;
        }
        var img_ext = data.photos[i].src.original.split('.').pop().toUpperCase().substring(0, 4);
        var img_site = data.photos[i].url;
        var img_thumb = data.photos[i].src.tiny;
        var img_full = data.photos[i].src.original;
        var img_width = data.photos[i].width;
        var img_height = data.photos[i].height;
        if (data.photos[i].photographer != undefined) {
          img_title = String(data.photos[i].photographer);
        } else {
          img_title = img_id;
        }

        jQuery('#GTFB_F_result_panel').append('<div class="GTFB_F_item" bg="' + img_thumb + '"><div class="GTFB_F_item_overlay" rel="' + img_id + '"></div><span>' +
            img_ext + ' | ' + img_width + 'x' + img_height + '</span></div>'
        );

        GTFB_F_images[img_id] = {
          img_ext: img_ext,
          img_site: img_site,
          img_thumb: img_thumb,
          img_full: img_full,
          img_width: img_width,
          img_height: img_height,
          img_title: img_title,
          img_caption: ''
        };

      }
      jQuery('.GTFB_F_item').each(function () {
        var bg_url = jQuery(this).attr('bg');
        jQuery(this).css('background-image', 'url(' + bg_url + ')');
      });
    }

    if (data.total_results != 'undefined') {

      var count = $(".GTFB_F_item").length;
      var text = count + " / " + data.total_results
      var per_page = 12;

      jQuery('#GTFB_F_more_result_panel').empty();
      if (data.total_results - count > 0) {
        var html = "<div class='GTFB_F_more_result'><input type='button' class='btn-primary btn btn-sm' value='" + text + "' id='GTFB_F_load_more'></div>";
        jQuery('#GTFB_F_more_result_panel').append(html);
      }
    }
  }


  function GTFB_F_clear_result_panel() {
    jQuery('#GTFB_F_result_panel').empty();
    jQuery('#GTFB_F_more_result_panel').empty();
    GTFB_F_images = [];
  }

  //PIXABAY
  $('body').on('click touch', '#GTFB_F_search_btn', function () {
    var source = $("#GTFB_F_source_input").val();

    if (source == "pixabay") {
      GTFB_F_clear_result_panel()
      GTFB_F_pixabay_search(1);
    }

  });

  function GTFB_F_pixabay_search(page) {
    GTFB_F_load_search_btn();
    GTFB_F_load_more_btn();

    var data = {
      q: jQuery('#GTFB_F_search_input').val(),
      page: page,
    };

    jQuery.ajax({
      method: 'POST',
      url: GTFB_F_script_vars.GTFB_F_script_root + "gtfb-f/search/pixabay",
      data: data,
      success: function (response) {

        GTFB_F_show_pixabay_images(JSON.parse(response), page);
        GTFB_F_reset_search_btn();
        GTFB_F_reset_more_btn();
      },
      error: function () {
        console.log('error');
      },
    });
  }

  function GTFB_F_show_pixabay_images(data, page) {

    if (data.totalHits > 0) {
      for (var i = 0; i < data.hits.length; i++) {
        var img_id = "pixabay_" + data.hits[i].id;
        var img_ext = data.hits[i].webformatURL.split('.').pop().toUpperCase().substring(0, 4);
        var img_thumb = data.hits[i].previewURL;

        var img_title = '';

        if (data.hits[i].hasOwnProperty('pageURL')) {
          img_site = data.hits[i].pageURL;
        } else {
          img_site = 'https://pixabay.com';
        }

        if (data.hits[i].hasOwnProperty('tags')) {
          img_title = String(data.hits[i].tags);
        } else if (data.hits[i].hasOwnProperty('user')) {
          img_title = data.hits[i].user + ' (CC0), Pixabay';
        } else {
          img_title = '';
        }

        var img_full = data.hits[i].imageURL;
        var img_width = data.hits[i].imageWidth;
        var img_height = data.hits[i].imageHeight;

        if (!data.hits[i].hasOwnProperty('imageURL')) {

          img_full = data.hits[i].imageURL;
          img_width = data.hits[i].imageWidth;
          img_height = data.hits[i].imageHeight;
          img_site = 'https://pixabay.com/goto/' + img_id;
        }


        jQuery('#GTFB_F_result_panel').append('<div class="GTFB_F_item" bg="' + img_thumb + '"><div class="GTFB_F_item_overlay" rel="' + img_id + '"></div><span>' +
            img_ext + ' | ' + img_width + 'x' + img_height + '</span></div>'
        );

        GTFB_F_images[img_id] = {
          img_ext: img_ext,
          img_site: img_site,
          img_thumb: img_thumb,
          img_full: img_full,
          img_width: img_width,
          img_height: img_height,
          img_title: img_title,
          img_caption: ''
        };
      }

      jQuery('.GTFB_F_item').each(function () {
        var bg_url = jQuery(this).attr('bg');
        jQuery(this).css('background-image', 'url(' + bg_url + ')');
      });
    }

    if (data.totalHits > 0) {

      var count = $(".GTFB_F_item").length;
      var text = count + " / " + data.totalHits
      var per_page = 12;

      jQuery('#GTFB_F_more_result_panel').empty();
      if (data.totalHits - count > 0) {
        var html = "<div class='GTFB_F_more_result'><input type='button' class='btn-primary btn btn-sm' value='" + text + "' id='GTFB_F_load_more'></div>";
        jQuery('#GTFB_F_more_result_panel').append(html);
      }
    }
  }


  //UNSPLASH
  $('body').on('click touch', '#GTFB_F_search_btn', function () {
    var source = $("#GTFB_F_source_input").val();

    if (source == "unsplash") {
      GTFB_F_clear_result_panel()
      GTFB_F_unsplash_search(1);
    }

  });

  function GTFB_F_unsplash_search(page) {
    GTFB_F_load_search_btn();
    GTFB_F_load_more_btn();

    var data = {
      q: jQuery('#GTFB_F_search_input').val(),
      page: page,
    };

    jQuery.ajax({
      method: 'POST',
      url: GTFB_F_script_vars.GTFB_F_script_root + "gtfb-f/search/unsplash",
      data: data,
      success: function (response) {
        GTFB_F_show_unsplash_images(JSON.parse(response), page);
        GTFB_F_reset_search_btn();
        GTFB_F_reset_more_btn();
      },
      error: function () {
        console.log('error');
      },
    });
  }

  function GTFB_F_show_unsplash_images(data, page) {
    if (data.results != 'undefined') {
      for (var i = 0; i < data.results.length; i++) {
        var img_id = '';
        var img_title = '';
        var img_id = "unsplash_" + data.results[i].id;

        var img_ext = '';//data.results[i].src.original.split( '.' ).pop().toUpperCase().substring( 0, 4 );
        var img_site = data.results[i].links.html;
        var img_thumb = data.results[i].urls.thumb;
        var img_full = data.results[i].links.download;
        var img_width = data.results[i].width;
        var img_height = data.results[i].height;
        if (data.results[i].user != undefined) {
          img_title = String(data.results[i].user.username);
        } else {
          img_title = img_id;
        }

        jQuery('#GTFB_F_result_panel').append('<div class="GTFB_F_item" bg="' + img_thumb + '"><div class="GTFB_F_item_overlay" rel="' + img_id + '"></div><span>' +
            img_ext + ' | ' + img_width + 'x' + img_height + '</span></div>'
        );

        GTFB_F_images[img_id] = {
          img_ext: img_ext,
          img_site: img_site,
          img_thumb: img_thumb,
          img_full: img_full,
          img_width: img_width,
          img_height: img_height,
          img_title: img_title,
          img_caption: ''
        };

      }
      jQuery('.GTFB_F_item').each(function () {
        var bg_url = jQuery(this).attr('bg');
        jQuery(this).css('background-image', 'url(' + bg_url + ')');
      });
    }

    if (data.total != 'undefined') {

      var count = $(".GTFB_F_item").length;
      var text = count + " / " + data.total
      var per_page = 12;

      jQuery('#GTFB_F_more_result_panel').empty();
      if (data.total - count > 0) {
        var html = "<div class='GTFB_F_more_result'><input type='button' class='btn-primary btn btn-sm' value='" + text + "' id='GTFB_F_load_more'></div>";
        jQuery('#GTFB_F_more_result_panel').append(html);
      }
    }
  }

  //FLATICON
  function GTFB_F_flaticon_search(page) {
    GTFB_F_load_search_btn();
    GTFB_F_load_more_btn();

    var data = {
      q: jQuery('#GTFB_F_search_input').val(),
      page: page,
    };

    jQuery.ajax({
      method: 'POST',
      url: GTFB_F_script_vars.GTFB_F_script_root + "gtfb-f/search/flaticon",
      data: data,
      success: function (response) {
        GTFB_F_show_flaticon_images(JSON.parse(response), page);
        GTFB_F_reset_search_btn();
        GTFB_F_reset_more_btn();
      },
      error: function () {
        console.log('error');
      },
    });
  }

  function GTFB_F_show_flaticon_images(data, page) {
    if (data.data != 'undefined') {
      for (var i = 0; i < data.data.length; i++) {
        var img_id = "flaticon_" + data.data[i].id;
        var img_title = '';

        var img_ext = "png";
        var img_site = data.data[i].images.png["128"];
        var img_thumb = data.data[i].images.png["512"];
        var img_full = data.data[i].images.svg;
        var img_width = 512;
        var img_height = 512;
        if (data.data[i].designer_name != undefined) {
          img_title = String(data.data[i].designer_name);
        } else {
          img_title = img_id;
        }

        jQuery('#GTFB_F_result_panel').append('<div class="GTFB_F_item GTFB_F_icon" bg="' + img_thumb + '"><div class="GTFB_F_icon_container"></div><div class="GTFB_F_item_overlay" rel="' + img_id + '"></div><span>' +
            img_ext + ' | ' + img_width + 'x' + img_height + '</span></div>'
        );

        GTFB_F_images[img_id] = {
          img_ext: img_ext,
          img_site: img_site,
          img_thumb: img_thumb,
          img_full: img_full,
          img_width: img_width,
          img_height: img_height,
          img_title: img_title,
          img_caption: ''
        };

      }
      jQuery('.GTFB_F_item').each(function () {
        var bg_url = jQuery(this).attr('bg');
        var child = jQuery(this).children(".GTFB_F_icon_container").css('background-image', 'url(' + bg_url + ')');
        //jQuery( this ).css( 'background-image', 'url(' + bg_url + ')' );
      });
    }


    if (data.metadata != 'undefined') {

      var count = $(".GTFB_F_item").length;
      var text = count + " / " + data.metadata.total
      var per_page = 12;

      jQuery('#GTFB_F_more_result_panel').empty();
      if (data.metadata.total - count > 0) {
        var html = "<div class='GTFB_F_more_result'><input type='button' class='btn-primary btn btn-sm' value='" + text + "' id='GTFB_F_load_more'></div>";
        jQuery('#GTFB_F_more_result_panel').append(html);
      }
    }
  }

  //ICONFINDER
  function GTFB_F_iconfinder_search(page) {
    GTFB_F_load_search_btn();
    GTFB_F_load_more_btn();

    var data = {
      q: jQuery('#GTFB_F_search_input').val(),
      page: page,
    };

    jQuery.ajax({
      method: 'POST',
      url: GTFB_F_script_vars.GTFB_F_script_root + "gtfb-f/search/iconfinder",
      data: data,
      success: function (response) {
        GTFB_F_show_iconfinder_images(JSON.parse(response), page);
        GTFB_F_reset_search_btn();
        GTFB_F_reset_more_btn();
      },
      error: function (e) {
        console.log('error', e);
      },
    });
  }

  function GTFB_F_show_iconfinder_images(data, page) {
    if (data.icons != 'undefined') {
      for (var i = 0; i < data.icons.length; i++) {
        var img_id = "iconfinder_" + data.icons[i].icon_id;
        var img_title = '';

        var img_ext = "png";

        var last_rastr = data.icons[i].raster_sizes[data.icons[i].raster_sizes.length - 1];
        var img_site = "";
        var img_thumb = last_rastr.formats[0].preview_url;
        var img_full = "https://www.iconfinder.com/icons/" + data.icons[i].icon_id + "/download/png/" + last_rastr.size
        var img_width = last_rastr.size_width;
        var img_height = last_rastr.size_height;
        var img_title = data.icons[i].icon_id;


        jQuery('#GTFB_F_result_panel').append('<div class="GTFB_F_item GTFB_F_icon" bg="' + img_thumb + '"><div class="GTFB_F_icon_container"></div><div class="GTFB_F_item_overlay" rel="' + img_id + '"></div><span>' +
            img_ext + ' | ' + img_width + 'x' + img_height + '</span></div>'
        );

        GTFB_F_images[img_id] = {
          img_ext: img_ext,
          img_site: img_site,
          img_thumb: img_thumb,
          img_full: img_full,
          img_width: img_width,
          img_height: img_height,
          img_title: img_title,
          img_caption: ''
        };

      }
      jQuery('.GTFB_F_item').each(function () {
        var bg_url = jQuery(this).attr('bg');
        var child = jQuery(this).children(".GTFB_F_icon_container").css('background-image', 'url(' + bg_url + ')');
        //jQuery( this ).css( 'background-image', 'url(' + bg_url + ')' );
      });
    }


    if (data.total_count != 'undefined') {

      var count = $(".GTFB_F_item").length;
      var text = count + " / " + data.total_count;
      var per_page = 100;

      jQuery('#GTFB_F_more_result_panel').empty();
      if (data.total_count - count > 0) {
        var html = "<div class='GTFB_F_more_result'><input type='button' class='btn-primary btn btn-sm' value='" + text + "' id='GTFB_F_load_more'></div>";
        jQuery('#GTFB_F_more_result_panel').append(html);
      }
    }
  }


  $('body').on('click touch', '.GTFB_F_item_overlay', function (event) {
    var checkbox_id = $(this).attr('rel');
    var sel = GTFB_F_images[checkbox_id];

    $(this).text(GTFB_F_script_vars['Loading']);
    saveImage(checkbox_id, sel, $(this));

  });


  //

  function saveImage(id, info, el) {
    var data = {
      id: id,
      url: info.img_full,
    };


    jQuery.ajax({
      method: 'POST',
      url: GTFB_F_script_vars.GTFB_F_script_root + "gtfb-f/upload/",
      data: data,
      success: function (response) {
        $(el).text(GTFB_F_script_vars['Resizing']);
        resizeImage(response.path, response.filename, info.img_title, response.filename, "", info.img_caption, el);
      },
      error: function () {
        console.log('error');
      },
    });

  }

  function resizeImage(path, filename, title, custom_filename, alt, caption, el) {

    var data = {
      path: path,
      filename: filename,
      title: title,
      custom_filename: custom_filename,
      alt: alt,
      caption: caption,
    };

    jQuery.ajax({
      method: 'POST',
      url: GTFB_F_script_vars.GTFB_F_script_root + "gtfb-f/resize/",
      data: data,
      success: function (response) {
        if(window.GTFBIsUploader){
          window.GTFBIsUploader.model.frame.content.mode("browse");
          window.GTFBIsUploader.model.get("selection").add(response.attachmentData);
          window.GTFBIsUploader.model.frame.trigger("library:selection:add");
          window.GTFBIsUploader.model.get("selection");
          $(".media-frame .media-button-select").click()
        }
        $(el).text('OK');
      },
      error: function () {
        $(el).text(GTFB_F_script_vars['Error']);
        console.log('error');
      }
    });
  }


  function GTFB_F_load_search_btn() {
    var text = $("#GTFB_F_search_btn").attr("GTFB_F_load_text");
    $("#GTFB_F_search_btn").attr("disabled", true);
    $("#GTFB_F_search_btn").val(text);
  }

  function GTFB_F_reset_search_btn() {
    var text = $("#GTFB_F_search_btn").attr("GTFB_F_text");
    $("#GTFB_F_search_btn").removeAttr("disabled");
    $("#GTFB_F_search_btn").val(text);
  }

  function GTFB_F_load_more_btn() {
    $("#GTFB_F_load_more").attr("disabled", true);
  }

  function GTFB_F_reset_more_btn() {
    $("#GTFB_F_load_more").removeAttr("disabled");
  }
});


