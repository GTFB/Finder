<?php

class gtfbIsSearch {
    
    function __construct() {
        add_action( 'rest_api_init', array( $this, 'registerRoute' ));
    }
    
    function registerRoute() {
        register_rest_route( 'gtfb-f/', '/search/pexels', array(
            'methods'  => 'POST',
            'callback' => array( $this, 'GTFB_F_pexels_search_ajax' ),
        ));
        register_rest_route( 'gtfb-f/', '/search/pixabay', array(
            'methods'  => 'POST',
            'callback' => array( $this, 'GTFB_F_pixabay_search_ajax' ),
        ));
        register_rest_route( 'gtfb-f/', '/search/unsplash', array(
            'methods'  => 'POST',
            'callback' => array( $this, 'GTFB_F_unsplash_search_ajax' ),
        ));
        register_rest_route( 'gtfb-f/', '/search/flaticon', array(
            'methods'  => 'POST',
            'callback' => array( $this, 'GTFB_F_flaticon_search_ajax' ),
        ));
        register_rest_route( 'gtfb-f/', '/search/iconfinder', array(
            'methods'  => 'POST',
            'callback' => array( $this, 'GTFB_F_iconfinder_search_ajax' ),
        ));
    }
    
    function GTFB_F_pexels_search_ajax( WP_REST_Request $request ) {
        
        $params = $request->get_body_params();
        $page = $params["page"];
        $key = $params["key"];
        
        $ch   = curl_init();
        
        $query_params = array(
            "query" => esc_attr( $key ),
            "page" => $page,
            "per_page" => 25,
        );
        
        if($key) {
            curl_setopt( $ch, CURLOPT_URL, 'https://api.pexels.com/v1/search?' . _http_build_query($query_params));
        }
        else {
            curl_setopt( $ch, CURLOPT_URL, 'https://api.pexels.com/v1/search?query=popular&per_page=25&page=1' );
        }

            
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array(
                'Authorization: '.GTFB_F_PEXELS_KEY,
        ) );
        
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        
        $response = curl_exec( $ch );
        wp_send_json($response);
        curl_close( $ch );
        die();
    }
    
    function GTFB_F_pixabay_search_ajax( WP_REST_Request $request ) {
        
        $params = $request->get_body_params();
        $page = $params["page"];
        $q = $params["q"];
        
        $ch   = curl_init();
        
        $query_params = array(
            "response_group" => "high_resolution",
            "lang" => "en",
            "category" => "all",
            "image_type" => "all",
            "orientation" => "all",
            "editors_choice" => false,
            "order" => "popular",
            "safesearch" => false,
            "key" => esc_attr( GTFB_F_PIXABAY_KEY ),
            "q" => urlencode($q),
            "page" => $page,
            "per_page" => 25,
        );
        
        if($q) {
            curl_setopt( $ch, CURLOPT_URL, 'https://pixabay.com/api/?' . http_build_query($query_params) );
        }
        else {
            curl_setopt( $ch, CURLOPT_URL, 'https://pixabay.com/api/?response_group=high_resolution&key=' . esc_attr( GTFB_F_PIXABAY_KEY ) . '?per_page=8&page=1' );
        }
        
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ) );
        
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        
        $response = curl_exec( $ch );
        wp_send_json($response);
        curl_close( $ch );
        die();
    }
    
    function GTFB_F_unsplash_search_ajax( WP_REST_Request $request ) {
        
        $params = $request->get_body_params();
        $page = $params["page"];
        $key = "5746b12f75e91c251bddf6f83bd2ad0d658122676e9bd2444e110951f9a04af8";
        $q = $params["q"];
        
        $ch   = curl_init();
        
        $query_params = array(
            "query" => esc_attr( $q ),
            "page" => $page,
            "client_id" => esc_attr( GTFB_F_UNSPLASH_KEY ),
            "per_page" => 25,
        );
        
        if($q) {
            curl_setopt( $ch, CURLOPT_URL, "https://api.unsplash.com/search/photos/?" . http_build_query($query_params) );
        }
        else {
            curl_setopt( $ch, CURLOPT_URL, "https://api.unsplash.com/photos/?client_id=" . esc_attr( GTFB_F_UNSPLASH_KEY ) . "&per_page=12&page=1&order_by=latest" );
        }
            
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ) );
        
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        
        $response = curl_exec( $ch );
        wp_send_json($response);
        curl_close( $ch );
        die();
    }
    
    function GTFB_F_flaticon_search_ajax( WP_REST_Request $request ) {
        
        $params = $request->get_body_params();
        $page = $params["page"];
        $key = $params["q"];
        
        $ch   = curl_init();
        $token = $this->GTFB_F_flaticon_get_token();
        
        if(!$token) {
            $response = json_encode(
         	array(
                    'error' => true,
                    'msg' => __('Auth Error Flaticon', 'gtfb-f')
      		)
            );
            wp_send_json($response);
        }
        
        $query_params = array(
            "q" => esc_attr( $key ),
            "page" => $page,
        );
        
        if($key) {
            curl_setopt( $ch, CURLOPT_URL, 'https://api.flaticon.com/v2/search/icons/priority?'.http_build_query($query_params) );
        }
        else {
            curl_setopt( $ch, CURLOPT_URL, 'https://api.flaticon.com/v2/search/icons/priority?'.http_build_query($query_params) );
        }
            
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array(
                'Authorization: Bearer '.$token,
                'Content-Type: application/json'
        ) );
        
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        
        $response = curl_exec( $ch );
        wp_send_json($response);
        curl_close( $ch );
        die();
    }
    
    function GTFB_F_flaticon_get_token() {
        $ch   = curl_init();
        curl_setopt( $ch, CURLOPT_URL, 'https://api.flaticon.com/v2/app/authentication');
        
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        curl_setopt($ch, CURLOPT_POST, 1 );
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array("apikey" => GTFB_F_FLATICON_KEY))); 
        
        $response = json_decode(curl_exec( $ch ));
        
        
        curl_close( $ch );
        return $response->data->token;
        
        
    }
    
    function GTFB_F_iconfinder_search_ajax( WP_REST_Request $request ) {
        
        $params = $request->get_body_params();
        $page = $params["page"];
        $key = $params["q"];
        
        $ch   = curl_init();
        
        $query_params = array(
            "query" => esc_attr( $key ),
            "client_id" => GTFB_F_ICONFINDER_CLIENT_ID,
            "client_secret" => GTFB_F_ICONFINDER_CLIENT_SECRET,
            "count" => 100,
            "offset" => $page * 100 - 100,
            "license" => "none",
            "price" => "free",
            "premium" => 0
        );
        
        if($key) {
            curl_setopt( $ch, CURLOPT_URL, 'https://api.iconfinder.com/v3/icons/search?'.http_build_query($query_params)) ;
        }
        else {
            curl_setopt( $ch, CURLOPT_URL, 'https://api.iconfinder.com/v3/icons/search?'.http_build_query($query_params)) ;
        }
        
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        
        $response = curl_exec( $ch );
        
        wp_send_json($response);
        curl_close( $ch );
        die();
    }
    
}
