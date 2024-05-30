<?php
/**
 * The plugin
 *
 * @return void
 */
function events_types(): void {
	register_post_type('event', array(
		'supports' => array('title', 'editor', 'author', 'excerpt'),
		'rewrite' => array('slug' => 'event'),
		'has_archive' => true,
		'public' => true,
		'show_in_rest' => true,
		'labels' => array(
			'name' => 'Events',
			'add_new_item' => 'Add New Event',
			'edit_item' => 'Edit Event',
			'all_items' => 'All Events',
			'singular_name' => 'Event'
		),
		'menu_icon' => 'dashicons-calendar'
	));
}

add_action('init', 'events_types');