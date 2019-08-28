<?php

class gtfbIsFile
{
  function __construct()
  {
    add_action( 'rest_api_init', array( $this, 'registerRoute' ) );
  }


  function registerRoute()
  {
    register_rest_route( 'gtfb-f/', '/upload', array(
      'methods' => 'POST',
      'callback' => array( $this, 'uploadFile' ),
    ) );

    register_rest_route( 'gtfb-f/', '/resize', array(
      'methods' => 'POST',
      'callback' => array( $this, 'resizeFile' ),
    ) );
  }


  function uploadFile( WP_REST_Request $request )
  {

    if ( ! $this->checkUploadDir() ) {
      $response = json_encode(
        array(
          'error' => true,
          'msg' => __( 'Unable to save the picture, the folder is missing `uploads/gtfb-finder`', 'gtfb-f' )
        )
      );
      wp_send_json( $response );
    }

    if ( ! $this->checkPermissionsUploadDir() ) {
      $response = json_encode(
        array(
          'error' => true,
          'msg' => __( 'Unable to save the picture, the folder `uploads / gtfb-finder` does not have write permissions', 'gtfb-f' )
        )
      );
      wp_send_json( $response );
    }

    $params = $request->get_body_params();
    $path = GTFB_F_UPLOAD_PATH . '/';

    if ( $params ) {
      $id = $params["id"];
      $url = $params["url"];
    }

    // Create temp. image variables

    $ext = wp_check_filetype( $url );

    if ( ! $ext["ext"] ) {
      $response =
        array(
          'error' => true,
          'msg' => __( 'Невозможно сохранить картинку, wp не поддерживает данный тип файла', 'gtfb-f' )

      );
      wp_send_json( $response );
    }

    // Create temp. image variables
    $filename = $id . '.' . $ext["ext"];
    $img_path = $path . '' . $filename;


    // If ID and IMG not set, exit
    if ( ! isset( $id ) || ! isset( $url ) ) {
      $response = array(
        'error' => true,
        'msg' => __( 'Problems with the transfer of data about the picture', 'gtfb-f' ),
        'path' => $path,
        'filename' => $filename
      );
      wp_send_json( $response );
    }

    if ( function_exists( 'copy' ) ) {
      // Save file to server using copy() function
      $saved_file = @copy( $url, $img_path );

      // Was the temporary image saved?
      if ( $saved_file ) {
        if ( file_exists( $path . '' . $filename ) ) {
          //OK
          $response = array(
            'error' => false,
            'msg' => __( 'Image uploaded successfully', 'gtfb-f' ),
            'path' => $path,
            'filename' => $filename
          );
        } else {
          //ERROR
          $response = array(
            'error' => true,
            'msg' => __( 'Uploaded image not found, please ensure you have proper permissions set on the uploads directory.', 'gtfb-f' ),
            'path' => '',
            'filename' => ''
          );
        }
      } else {
        // ERROR - Error on save
        $response = array(
          'error' => true,
          'msg' => __( 'Unable to download image to server, please check the server permissions of the gtfb-f folder in your WP uploads directory.', 'gtfb-f' ),
          'path' => '',
          'filename' => ''
        );
      }
    } // copy() not enabled
    else {
      $response = array(
        'error' => true,
        'msg' => __( 'The core PHP copy() function is not available on your server. Please contact your server administrator to upgrade your PHP version.', 'gtfb-f' ),
        'path' => $path,
        'filename' => $filename
      );
    }

    wp_send_json( $response );
  }

  function resizeFile( WP_REST_Request $request )
  {
    require_once( ABSPATH . 'wp-admin/includes/file.php' ); // download_url()
    require_once( ABSPATH . 'wp-admin/includes/image.php' ); // wp_read_image_metadata()

    // Get JSON Data
    //$body = json_decode($request->get_body(), true); // Get contents of request body
    //$data = json_decode($body['data']); // Get contents of data
    $params = $request->get_body_params();
    if ( $params ) {
      $path = $params["path"];
      $name = $params["filename"];
      $filename = $path . $name; // full filename
      $filetype = wp_check_filetype( basename( $filename ), null );
      $title = $params["title"];
      $alt = $params["alt"];
      $caption = $params["caption"];
      $custom_filename = $params["custom_filename"];

      $name = ( ! empty( $custom_filename ) ) ? $custom_filename . '.' . $filetype["ext"] : $name;

      $image = wp_get_image_editor( $filename );
      if ( ! is_wp_error( $image ) ) {
        $image->resize( GTFB_F_MAX_DOWNLOAD_WIDTH, GTFB_F_MAX_DOWNLOAD_HEIGHT, false );
        $image->save( $filename );
      }

      $wp_upload_dir = wp_upload_dir();

      $new_filename = $wp_upload_dir['path'] . '/' . $name;
      $copy_file = @copy( $filename, $new_filename );

      if ( ! $copy_file ) {
        // Error
        $response = array(
          'success' => false,
          'msg' => __( 'Unable to copy image to the media library. Please check your server permissions.', 'gtfb-f' )
        );

      } else {
        // Build attachment array
        $attachment = array(
          'guid' => $wp_upload_dir['url'] . basename( $new_filename ),
          'post_mime_type' => $filetype['type'],
          'post_title' => $title,
          'post_excerpt' => $caption,
          'post_content' => '',
          'post_status' => 'inherit'
        );

        $image_id = wp_insert_attachment( $attachment, $new_filename, 0 ); // Insert as attachment

        update_post_meta( $image_id, '_wp_attachment_image_alt', $alt ); // Add alt text

        $attach_data = wp_generate_attachment_metadata( $image_id, $new_filename ); // Generate metadata
        wp_update_attachment_metadata( $image_id, $attach_data ); // Add metadata

        // Response
        if ( file_exists( $new_filename ) ) { // If image was uploaded temporary image

          // Success
          $response = array(
            'success' => true,
            'msg' => __( 'Image successfully uploaded to your media library!', 'gtfb-f' ),
            'id' => $image_id,
            'url' => wp_get_attachment_url( $image_id )
          );
        } else {
          // Error
          $response = array(
            'success' => false,
            'msg' => __( 'There was an error sending the image to your media library. Please check your server permissions and confirm the upload_max_filesize setting (php.ini) is large enough for the downloaded image (8mb minimum is recommended).', 'gtfb-f' ),
            'id' => '',
            'url' => ''
          );
        }
      }

      // Delete temporary image
      if ( file_exists( $filename ) ) {
        unlink( $filename );
      }
      // response for elementor


      if ( $response['success']
        && class_exists( '\Elementor\Plugin' )
        && isset( $response['id'] )
        && $response['id'] ) {

        $response['attachmentData'] = wp_prepare_attachment_for_js( $response['id'] );

        $response['data'] = [
          'content' => [
            [
              'id' => \Elementor\Utils::generate_random_string(),
              'elType' => 'section',
              'settings' => [],
              'isInner' => false,
              'elements' => [
                [
                  'id' => \Elementor\Utils::generate_random_string(),
                  'elType' => 'column',
                  'elements' => [
                    [
                      'id' => \Elementor\Utils::generate_random_string(),
                      'elType' => 'widget',
                      'settings' => [
                        'image' => [
                          'url' => wp_get_attachment_url( $response['id'] ),
                          'id' => $response['id'],
                        ],
                        'image_size' => 'full',
                      ],
                      'widgetType' => 'image'
                    ]
                  ],
                  'isInner' => false
                ],
              ]
            ]
          ]
        ];

      }

      wp_send_json( $response ); // Send response as JSON

    } else {
      $response = array(
        'success' => false,
        'msg' => __( 'There was an error resizing the image, please try again.', 'gtfb-f' ),
        'id' => '',
        'url' => ''
      );
      wp_send_json( $response ); // Send response as JSON
    }
  }

  //Проверяем доступы к папке
  function checkPermissionsUploadDir()
  {
    if ( ! is_writable( GTFB_F_UPLOAD_PATH . '/' ) ) return false;
    else return true;
  }

  //Создаем папку для загрузки файлов
  function checkUploadDir()
  {
    if ( ! is_dir( GTFB_F_UPLOAD_PATH ) ) {
      return wp_mkdir_p( GTFB_F_UPLOAD_PATH );
    } else return true;
  }
}
