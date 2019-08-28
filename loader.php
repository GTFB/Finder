<?php
/**
 * Date: 30.06.2019
 * Time: 15:57
 * @property GTFB_Finder_Loader _instance
 */

class GTFB_Finder_Loader
{
  /**
   * @var $_instance GTFB_Finder_Loader
   */
  private static $_instance;

  /**
   * @return GTFB_Finder_Loader
   */
  public static function instance()
  {
    if ( is_null( self::$_instance ) ) {
      self::$_instance = new self();
    }

    return self::$_instance;
  }

  private function __construct()
  {
    add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'enqueue_editor_scripts' ] );

  }

  function enqueue_editor_scripts()
  {
    $this->enqueue_admin_scripts();

    wp_enqueue_script( 'is-editor-script', GTFB_F_URI . 'assets/js/editor.js', [ 'jquery', ], GTFB_F_VERSION, true );

    $editor_l10n = [
      'tabTitle' => __( 'GTFB Image Search', 'gtfb-f' ),
    ];

    $plugin = gtfbFinder::instance();

    ob_start();
    $plugin->GTFB_F_media_menu();
    $editor_l10n['searchTemplate'] = ob_get_clean();

    wp_localize_script( 'is-editor-script', 'GTFBEditorL10n', $editor_l10n );
  }

  function enqueue_admin_scripts()
  {
    wp_enqueue_script( 'gtfb-f-script', GTFB_F_URI . 'assets/js/gtfb-f-script.js', array( 'jquery' ), GTFB_F_VERSION, true );
    wp_enqueue_style( 'gtfb-f-style', GTFB_F_URI . 'assets/css/gtfb-f-style.css' );
    wp_localize_script( 'gtfb-f-script', 'GTFB_F_script_vars', array(
      'GTFB_F_script_root' => esc_url_raw( rest_url() ),
      'Loading' => __( 'Loading', 'gtfb-f' ),
      'Resizing' => __( 'Resizing', 'gtfb-f' ),
      'Error' => __( 'Error', 'gtfb-f' ),
    ) );
  }
}