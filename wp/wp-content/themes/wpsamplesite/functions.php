<?php
/**
 * The file to create functions and definitions.
 *
 */
?>
<?php
function pageBanner($args = null): void {
    if (!isset($args['title'])) {
        $args['title'] = get_the_title();
    }
    if (!isset($args['subtitle'])) {
        $args['subtitle'] = get_field('page_banner_subtitle');
    }
    if (!isset($args['image'])) {
        if (!is_archive() && !is_home() && get_field('page_banner_background_image')) {
	        $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
        } else {
	        $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
        }
    }
?>
	<div class="page-banner">
		<div class="page-banner__bg-image" style="background-image: url(<?php echo $args['photo']; ?>);"></div>
		<div class="page-banner__content container container--narrow">
			<h1 class="page-banner__title"><?php echo $args['title']; ?></h1>
			<div class="page-banner__intro">
				<p><?php echo $args['subtitle']; ?></p>
			</div>
		</div>
	</div>
<?php }


function wp_sample_site_files(): void {
    // Style
	wp_enqueue_style('wp-sample-site_main_styles', get_theme_file_uri('/build/style-index.css'));
	wp_enqueue_style('wp-sample-site_extra_styles', get_theme_file_uri('/build/index.css'));
	wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
	wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

	// Script
	wp_enqueue_script('googleMap', '//maps.googleapis.com/maps/api/js?key=' . $_ENV['GOOGLE_MAP_KEY'], NULL, '1.0', true);
	wp_enqueue_script('wp-sample-site-main-js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.0', true);

	wp_localize_script('wp-sample-site-main-js', 'wpSampleSiteData', array(
		'root_url' => get_site_url(),
	));
}

add_action('wp_enqueue_scripts', 'wp_sample_site_files');

function wp_sample_site_features(): void {
	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_image_size('professorLandscape', 400, 260, true);
	add_image_size('professorPortrait', 480, 650, true);
	add_image_size('pageBanner', 1500, 350, true);
}

add_action('after_setup_theme', 'wp_sample_site_features');

function event_adjust_query($query): void {
    // Program
	if(
		!is_admin() &&
		is_post_type_archive('program') &&
		$query->is_main_query())
	{
		$query->set('orderby', 'title');
		$query->set('order', 'ASC');
		$query->set('posts_per_page', -1);
	}

    // Event
	if (
		!is_admin() &&
		is_post_type_archive('event') &&
		$query->is_main_query()
	) {
		$today = date('Ymd');
		$query->set('meta_key', 'event_date');
		$query->set('orderby', 'meta_value_num');
		$query->set('order', 'ASC');
		$query->set('meta_query', array(
			array(
				'key' => 'event_date',
				'compare' => '>=',
				'value' => $today,
				'type' => 'numeric'
			)
		));
	}

    // Campus
	if (
            !is_admin() &&
            is_post_type_archive('campus') &&
            $query->is_main_query()
    ) {
		$query->set('posts_per_page', -1);
	}

}

add_action('pre_get_posts', 'event_adjust_query');

function wp_sample_site_map_key($api) {
    $api['key'] = $_ENV['GOOGLE_MAP_KEY'];
	return $api;
}

add_filter('acf/fields/google_map/api', 'wp_sample_site_map_key');